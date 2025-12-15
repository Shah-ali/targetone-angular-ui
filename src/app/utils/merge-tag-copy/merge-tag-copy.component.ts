import { Clipboard } from '@angular/cdk/clipboard';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { DataService } from '@app/core/services/data.service';
import { HttpService } from '@app/core/services/http.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { GlobalConstants } from '@app/design-channels/common/globalConstants';
import { DefaultTreeviewI18n } from '@app/design-channels/default-treeview-i18n';
import { TranslateService } from '@ngx-translate/core';
import { TreeItem, TreeviewConfig, TreeviewI18n, TreeviewItem } from 'ngx-treeview';

@Component({
  selector: 'app-merge-tag-copy',
  templateUrl: './merge-tag-copy.component.html',
  styleUrls: ['./merge-tag-copy.component.scss'],
  providers: [{ provide: TreeviewI18n, useClass: DefaultTreeviewI18n }],
})
export class MergeTagCopyComponent implements OnInit {
  @ViewChild('mergeTagsListData', { static: false }) mergeTagsListData!: ElementRef;

  isPersonalizeTagMode: boolean = false;
  tagKey: any;
  promotionKey: number = 0;
  currentSplitId: any;
  commChannelKey: any;
  mergeTagDataItems: any;
  customBootstrapStyle: any = ['btn btn-outline-primary buttonStyle shadow-none'];
  copiedDivEnabled: boolean = false;
  items!: TreeviewItem[];
  configuration = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500,
  });
  mergeTagModels: any;

  constructor(
    private translate: TranslateService,
    private shareService: SharedataService,
    private dataService: DataService,
    private httpService: HttpService,
    private clipboard: Clipboard
  ) {
    this.tagKey = dataService.activeContentTagKey; //localStorage.getItem('tagKeyPersonalization');
    this.shareService.personalizeTagService.subscribe((result) => {
      this.isPersonalizeTagMode = result;
    });

    this.dataService.$sharedPromoKey.subscribe((result) => {
      this.promotionKey = result;
    });
    this.shareService.currentSelectedChannelObj.subscribe((res: any) => {
      this.currentSplitId = res.currentSplitId;
      this.commChannelKey = res.commChannelKey;
    });

    this.getMergeTagData();
  }

  ngOnInit(): void {}

  getMergeTagData() {
    let url: any;
    const baseEndpoint = AppConstants.API_END_POINTS.GET_DME_MERGE_TAG_OBJ;
    const parentComponentName = GlobalConstants.parentComponentName;
    let apiParams = '';

    console.log(parentComponentName);

    if (parentComponentName == 'ApiPersonalizationComponent' || parentComponentName == 'EnsembleAIComponent') {
      apiParams = '&api=false&prod=false&dme=false';
    } else if (parentComponentName == 'RatingsComponent') {
      apiParams = '&api=false&prod=false';
    } else if (parentComponentName == 'TextAddonsComponent' || parentComponentName == 'ImageAddonsComponent' || parentComponentName == 'UseInlineFuncComponent') {
      if (this.isPersonalizeTagMode) {
        apiParams = '&api=true&prod=false';
      } else {
        apiParams = '&api=false&prod=false';
      }
    } else if( parentComponentName == "MapAddonsComponent"){
      apiParams = '&api=false&prod=true&dme=true';
    } else if( parentComponentName == "MergeTagInjectionComponent"){
      apiParams = '&api=true&prod=false&dme=true';
    } else {
      apiParams = '&api=false&prod=true';
    }

    if (this.isPersonalizeTagMode) {
      url = `${baseEndpoint}?tagKey=${this.tagKey}&wa=true${apiParams}`;
    } else if (parentComponentName == "MergeTagInjectionComponent") {
      url = `${baseEndpoint}?promoKey=${this.promotionKey}&splitKey=${this.currentSplitId}&wa=true${apiParams}&mergeTagJourney=true`;
    } else {
      url = `${baseEndpoint}?promoKey=${this.promotionKey}&splitKey=${this.currentSplitId}&wa=true${apiParams}`;
    }

    this.httpService.post(url).subscribe((data) => {
      if (data.status === 'SUCCESS') {
        this.mergeTagDataItems = JSON.parse(data.response).root;
        this.loadData();
      }
    });
  }

  onSelectedChange(item): void {
    if (item.length == 1 && item.length != 0 && item[0] !== '') {
      this.copyText('{' + item + '}');
      this.copiedDivEnabled = true;
      setTimeout(() => {
        this.copiedDivEnabled = false;
      }, 1500);
      this.resetCheckedFalseInMergeTag();
    } else {
      this.resetCheckedFalseInMergeTag();
    }
  }
  copyText(textToCopy: string) {
    this.clipboard.copy(textToCopy);
  }
  loadData() {
    const parentComponentName = GlobalConstants.parentComponentName;
    if (parentComponentName == 'TextAddonsComponent' || parentComponentName == 'ImageAddonsComponent' || parentComponentName == 'UseInlineFuncComponent' || parentComponentName == 'MergeTagInjectionComponent') {
      this.items = this.getItemsAdvanced(this.mergeTagDataItems);
    } else {
      this.items = this.getItems(this.mergeTagDataItems);
    }
    setTimeout(() => {
      this.resetCheckedFalseInMergeTag();
    }, 500);
  }
  resetCheckedFalseInMergeTag() {
    let dropdownEMl: any = this.mergeTagsListData;
    dropdownEMl.buttonLabel = this.translate.instant('recommendationComponent.CopyFromMergeTags');
    if (dropdownEMl.items != undefined) {
      dropdownEMl.items.forEach((item) => {
        item.checked = false;
        item.internalCollapsed = true;
        if (item['internalChildren'] !== undefined) {
          item['internalChildren'].forEach((item) => {
            item.checked = false;
            item.internalCollapsed = true;
            if (item['internalChildren'] !== undefined) {
              item['internalChildren'].forEach((item) => {
                item.checked = false;
                item.internalCollapsed = true;
              });
            }
          });
        }
      });
    }
  }

  getItems(parentChildObj: any[]) {
    let itemsArray: TreeviewItem[] = [];
    parentChildObj.forEach((set: TreeItem) => {
      if (set.children != undefined) {
        itemsArray.push(new TreeviewItem(set, true));
      }
    });
    return itemsArray;
  }

  getItemsAdvanced(parentChildObj: any[]) {
    let selectedDME = GlobalConstants.selectedDmeModels;
    let selectedAPI = GlobalConstants.selectedApiModels;
    const id1 = selectedDME.map((item) => item.id);
    const id2 = selectedAPI.map((item) => item.id);
    const ids = [...id1, ...id2];
    let itemsArray: TreeviewItem[] = [];
    parentChildObj.forEach((set: TreeItem) => {
      let newSet;
      if (set.children != undefined && set.text !== 'Customer' && set.text !== 'Tag parameters' && set.text !== 'Product' && set.text !== 'Promotion' && set.text !== 'Event') {
        const filterTextValues = ids;
        const newSetChildren = set.children.filter(function (item) {
          return filterTextValues.includes(item.text);
        });
        if (newSetChildren.length != 0) {
          newSet = { ...set, children: newSetChildren };
        }
      } else {
        if (set.text === 'Product') {
          newSet = undefined;
        } else {
          newSet = { ...set };
        }
      }

      if (newSet) {
        if (newSet.children) {
          if(GlobalConstants.parentComponentName == 'MergeTagInjectionComponent') {
            newSet.children.forEach((item) => {
              if(item.varArrayType) {
                item.value = item.value+'[X]';
              }
            });
          }
          itemsArray.push(new TreeviewItem(newSet, true));
        }
      }
    });
    return itemsArray;
  }
}
