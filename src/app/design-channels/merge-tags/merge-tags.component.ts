import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { HttpService } from '@app/core/services/http.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalConstants } from '../common/globalConstants';
import { Clipboard } from '@angular/cdk/clipboard';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-merge-tags',
  templateUrl: './merge-tags.component.html',
  styleUrls: ['./merge-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MergeTagsComponent implements OnInit {
  @Output() tagEmitter = new EventEmitter<string>();
  @Output() onAdd = new EventEmitter<any>();
  @Output() addTagOnInput: EventEmitter<any> = new EventEmitter();
  tagDetails: any;
  selectedTag: any;
  varArgsMergeTags: any = [];
  mTagsWithoutoptgroup: any = [];
  mergeTagModels: any = [];
  isDmeModel: boolean = false;
  isPTagModel: boolean = false;
  personalizedMergeTags: any = [];
  apiPMergeTags: any = [];
  selectGroupOptDME: any = [];

  filteredOptions: any = [];
  isFreeStyleSelectedTag = {};
  selectedType: any;
  selectedTagOptions: any;
  showExtDropdown: boolean = false;
  showEventArrayType: boolean = false;

  /* options1: any = [
    { value: 'Customer', label: 'Customer' },
    { value: 'Product', label: 'Product' }
  ];

  options2: any = [
    { value: '{{FirstName}}', label: 'FirstName', link: 'Customer' },
    { value: '{{LastName}}', label: 'LastName', link: 'Customer' },
    { value: '{{Age}}', label: 'Age', link: 'Customer' },
    { value: '{{Birthday}}', label: 'Birthday', link: 'Customer' },
    { value: '{{SKU}}', label: 'SKU', link: 'Product' },
    { value: '{{price}}', label: 'Price', link: 'Product' },
    { value: '{{name}}', label: 'Name', link: 'Product' },
    { value: '{{description}}', label: 'Product Description', link: 'Product' },
    { value: '{{image}}', label: 'Image', link: 'Product' },
    { value: '{{link}}', label: 'Buy Now Link', link: 'Product' }
  ] */

  constructor(
    private http: HttpService,
    public bsModalRef: BsModalRef,
    private ref: ChangeDetectorRef,
    private clipboard: Clipboard,
    private translate: TranslateService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    if (GlobalConstants.isOpenGlobalTags) {
      this.isDmeModel = true;
      this.mergeTagModels = Object.keys(GlobalConstants.selectedDmeModels);
      let varArgs = GlobalConstants.varArgs;
      let varArgs2 = GlobalConstants.varArgs;
      if (GlobalConstants.selectedDmeModels.length != 0) {
        //varArgs = varArgs.concat(GlobalConstants.selectedDmeModels);
        let groupSelect = {
          type: GlobalConstants.selectedDmeModels[0].type,
          group: GlobalConstants.selectedDmeModels,
        };
        this.selectGroupOptDME.push(groupSelect);
        varArgs = varArgs.concat(GlobalConstants.selectedDmeModels);
      }

      this.personalizedMergeTags = GlobalConstants.selectedPTags;
      if(this.personalizedMergeTags !== null){
        if (this.personalizedMergeTags.length != 0) {
          varArgs = varArgs.concat(this.personalizedMergeTags);
          varArgs2 = varArgs2.concat(this.personalizedMergeTags);
        }
      }      

      if (GlobalConstants.selectedApiModels.length != 0) {
        let groupSelect2 = {
          type: GlobalConstants.selectedApiModels[0].type,
          group: GlobalConstants.selectedApiModels,
        };
        this.selectGroupOptDME.push(groupSelect2);
        varArgs = varArgs.concat(GlobalConstants.selectedApiModels);
      }

      let productMergeTags = GlobalConstants.productMergeTags;
      if (productMergeTags.length != 0) {
        varArgs = varArgs.concat(productMergeTags);
        varArgs2 = varArgs2.concat(productMergeTags);
      }
      this.varArgsMergeTags = varArgs;
      this.mTagsWithoutoptgroup = varArgs2;
      if(this.mTagsWithoutoptgroup.length > 0){
        this.filteredOptions = this.mTagsWithoutoptgroup[0].userdata;
        this.tagDetails = this.filteredOptions[0].value;
        this.selectedTag = this.filteredOptions[0].value;
      }      
    } else {
      this.varArgsMergeTags = GlobalConstants.varArgs;
      this.mTagsWithoutoptgroup = GlobalConstants.varArgs;
      if(this.varArgsMergeTags.length > 0){
        this.filteredOptions = this.varArgsMergeTags[0].userdata;
        this.tagDetails = this.filteredOptions[0];
      }      
    }
  }

  getSelectedTag() {
    const sObj: any = {};
    if (this.tagDetails != undefined) {
      sObj['name'] = this.tagDetails.name;
      sObj['value'] = '{' + this.tagDetails.value + '}';
      sObj['cvalue'] = this.tagDetails.value;

      if (GlobalConstants.isFromSubjectRedirect == true) {
        this.addTagOnInput.emit(sObj);
      } else {
        this.onAdd.emit(sObj);
      }
      this.onClose();
    }
  }

  dropDownChanged(selectedOption) {
    let tempFilter = this.varArgsMergeTags.filter((o) => o.id === selectedOption.target.value);
    this.filteredOptions = tempFilter[0].userdata;
    this.selectedTag = this.filteredOptions.value;
    this.selectedType = selectedOption.target.value;
    if (this.filteredOptions.length > 0) {
      this.selectedTag = this.filteredOptions[0].value;
      this.showEventArrayType = this.filteredOptions[0].varArrayType;
      this.tagDetails = this.filteredOptions[0].value;
    }
    
    if (typeof this.selectedTag === 'object' && this.selectedTag.length) {
      this.isFreeStyleSelectedTag[this.selectedType] = true;
      this.selectedTagOptions = this.filteredOptions[0].value;
      this.selectedTag = this.filteredOptions[0].value[0];
      this.tagDetails = this.filteredOptions[0].name;
    } else {
      this.isFreeStyleSelectedTag[this.selectedType] = false;
    }
    this.ref.detectChanges();
  }

  /* dropDownChangedDME(selectedOption) {
    this.filteredOptions = this.varArgsMergeTags[selectedOption.target.value];
    this.ref.detectChanges();
  } */

  selectProperty(selectedOption) {
    this.selectedTag = selectedOption.target.value;
    this.showEventArrayType = false;
  
    if (this.isFreeStyleSelectedTag[this.selectedType]) {
      this.selectedTagOptions = this.filteredOptions.filter((o) => o.name === this.selectedTag)[0].value;
      this.selectedTag = this.selectedTagOptions[0];
      this.showExtDropdown = false;
    } else {
      this.selectedTagOptions = this.filteredOptions?.find(o => o.value === this.selectedTag);
      if (selectedOption && this.selectedTagOptions.varArrayType) {
        this.showEventArrayType = this.selectedTagOptions.varArrayType;
      }
    }
    this.ref.detectChanges();
  }

  onClose(): void {
    if (this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }

  selectExtOption(option: string) {
    this.selectedTag = option;
    this.showExtDropdown = false;
  }
  openExtDropdown() {
    this.showExtDropdown = !this.showExtDropdown;
  }

  copyToPaste() {
    if (this.selectedTag != undefined) {
      this.clipboard.copy('{' + this.selectedTag + '}');
      this.onClose();
      //console.log(this.tagDetails);

      Swal.fire({
        title: '{' + this.selectedTag + '}',
        text: this.translate.instant('mergeTagsComponent.aboveTagHasBeenCopiedPasteItAnywhereLbl'),
        icon: 'success',
        showCancelButton: false,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  copyToPasteInstant(tooltip, refEl: any, varArrayType) {
    this.ngZone.run(() => {
      if (tooltip.isOpen()) {
        tooltip.close();
      } else {
        let encodePipeStr = refEl;
        tooltip.open({ encodePipeStr });
        if(varArrayType === true){
          this.clipboard.copy("{"+refEl+"[0]}");
        } else {
          this.clipboard.copy("{"+refEl+"}");
        }
        
        setTimeout(() => {
          tooltip.close();
        }, 1000);
      }
    });
  }
}
