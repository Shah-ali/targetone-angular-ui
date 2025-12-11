import { Clipboard } from '@angular/cdk/clipboard';
import { AfterViewInit, ChangeDetectorRef, Component, HostListener, NgZone, OnInit } from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { DataService } from '@app/core/services/data.service';
import { HttpService } from '@app/core/services/http.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-global-merge-tags',
  templateUrl: './global-merge-tags.component.html',
  styleUrls: ['./global-merge-tags.component.scss'],
})
export class GlobalMergeTagsComponent implements OnInit, AfterViewInit {
  mergeTagExtJSON: any = [];
  extInputValues: string[] = [];
  isPersonalizeTagMode: boolean = false;
  tagKey: any;
  addDropdownObj: any;
  promotionKey: any;
  currentSplitId: any;
  selectExtObj: any = [];
  selectedItem: any;
  selectedTableData: any = [];
  hiddenInputSection: boolean = true;
  hiddenAddTagSection: boolean = true;
  editMergeTagBttn: boolean = true;
  isModelDME: boolean = true;
  modelTypeSelected: string = '';
  selectedExtValue: string = '';
  showExtDropdown: boolean = false;
  prevSelectedExtValue: string = '';
  filteredExtOptions: any;
  childInputs: any = [];
  selectedInputs: any = [];


  constructor(private bsModalRef: BsModalRef, private shareService: SharedataService, private dataService: DataService, private httpService: HttpService,private ngZone:NgZone, private clipboard: Clipboard, private translate: TranslateService, private cdref: ChangeDetectorRef) {
    this.tagKey = this.dataService.activeContentTagKey;//localStorage.getItem('tagKeyPersonalization');

    this.dataService.$sharedPromoKey.subscribe((result) => {
      this.promotionKey = result;
    });

    this.shareService.personalizeTagService.subscribe((result) => {
      this.isPersonalizeTagMode = result;
    });

    this.shareService.currentSelectedChannelObj.subscribe((res: any) => {
      this.currentSplitId = res.currentSplitId;
    });
  }
  

  ngOnInit(): void {}
  
  ngAfterViewInit() {
    this.ngZone.run(() => {
      this.getMergeTagExt();
      this.cdref.detectChanges();
    });
  }
  
  getMergeTagExt() {
    let url: string;
    const baseEndpoint = AppConstants.API_END_POINTS.GET_PMERGETAG_EXT_URL;
    const commonParams = '&wa=true';

    if (this.isPersonalizeTagMode) {
      url = `${baseEndpoint}?tagKey=${this.tagKey}${commonParams}&pta=true`;
    } else {
      url = `${baseEndpoint}?promoKey=${this.promotionKey}&splitKey=${this.currentSplitId}${commonParams}&pta=false&api=false`;
    }

    this.httpService.post(url).subscribe((res) => {
      this.mergeTagExtJSON = JSON.parse(res.response).root;

      if (!this.isPersonalizeTagMode) {
        this.mergeTagExtJSON = this.mergeTagExtJSON.filter((item) => item.type.toLowerCase() !== 'api');
      }

      this.selectedItem = this.mergeTagExtJSON[0];
      this.selectedTableData = this.selectedItem.fields;

    });
  }

  selectItem(event, item): void {
    if (event != '') {
      const selectedElement = document.querySelector('li.rowSelected');
      if (selectedElement) {
        selectedElement.classList.remove('rowSelected');
      }
      event.target.closest('li').classList.add('rowSelected');
    }

    this.selectedItem = item;
    this.selectedTableData = item.fields;
  }

  openAddMergeTag(itemType) {
    this.hiddenInputSection = true;
    this.hiddenAddTagSection = false;
    this.editMergeTagBttn = false;
    this.modelTypeSelected = itemType;
    this.isModelDME = itemType === AppConstants.PTAG_STATIC_DATA.CUSTOMER_DME;
    this.extInputValues = [];

    this.selectedExtValue = '';
    this.addDropdownObj = this.mergeTagExtJSON.find((x) => x.type === itemType)?.child || [];
    this.filteredExtOptions = this.addDropdownObj;
  }

  editExtMergeTag(itemType, selectedExtValue) {
    this.hiddenAddTagSection = false;
    this.editMergeTagBttn = true;
    this.isModelDME = itemType === AppConstants.PTAG_STATIC_DATA.CUSTOMER_DME;
    this.selectedExtValue = selectedExtValue;
    this.prevSelectedExtValue = selectedExtValue;
    this.addDropdownObj = this.mergeTagExtJSON.find((x) => x.type === itemType)?.child || [];
    this.filteredExtOptions = this.addDropdownObj;
    this.onChangeExtValue(selectedExtValue, this.selectedInputs);
  }

  deleteExtMergeTag(selectedExtValue) {
    this.selectExtObj = this.selectExtObj.filter((item) => item.name !== selectedExtValue);
    this.selectedInputs = this.selectedInputs.filter((item) => item.name !== selectedExtValue);
  }

  closeMergeTagExt() {
    this.hiddenAddTagSection = true;
  }
  openExtDropdown() {
    this.showExtDropdown = true;
  }
  filterExtOptions(event: any) {
    const searchText = event.target.value;
    this.filteredExtOptions = this.addDropdownObj.filter((option) =>
      option.name.toLowerCase().includes(searchText.toLowerCase())
    );
    this.showExtDropdown = this.filteredExtOptions.length > 0;
    this.cdref.detectChanges();
  }
  addExtMergeTags() {
    if (this.editMergeTagBttn) {
      this.deleteExtMergeTag(this.prevSelectedExtValue);
    }
    const tempObj = this.addDropdownObj.find((x) => x.name === this.selectedExtValue);

    if (tempObj) {
      this.selectExtObj.push(tempObj);
      this.selectExtObj = [...new Set(this.selectExtObj)];
      this.hiddenAddTagSection = true;

      let tempExt = {
        type: tempObj.type,
        ctype: tempObj.ctype,
        name: tempObj.name,
        inputs: tempObj.inputs != null ? tempObj.inputs : null,
      };

      const index = this.selectedInputs.findIndex((item) => item.name === tempExt.name);
      if (index !== -1) {
        this.selectedInputs[index] = tempExt;
      } else {
        this.selectedInputs.push(tempExt);
      }
    } else {
      Swal.fire({
        title: this.translate.instant('designEditor.mergeTagExtensions.validationMessages.mergeTagNotSelected'),
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      });
    }
  }
  selectExtOption(option: string) {
    this.onChangeExtValue(option, '');
    this.selectedExtValue = option;
    this.showExtDropdown = false;
  }

  onClose(): void {
    if (this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }

  copyToPaste(tooltip, refEl: any) {
    tooltip.open({ refEl });
    this.clipboard.copy('{' + refEl + '}');
    setTimeout(() => tooltip.close(), 1000);
  }

  onChangeExtValue(evt, list) {
    this.hiddenInputSection = false;
    let selectedDropdown = this.addDropdownObj.find((x) => x.name === evt);
    if (list) {
      selectedDropdown.inputs = list.find((x) => x.name === evt).inputs;
    }
    if (selectedDropdown) {
      this.childInputs = selectedDropdown.inputs || [];
    }
    this.selectItem('', selectedDropdown);
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as Element;
    if (!target.closest('.mergeTagExt-dropdown')) {
      this.showExtDropdown = false;
    }
  }
}
