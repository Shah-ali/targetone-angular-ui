import { Clipboard } from '@angular/cdk/clipboard';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { DataService } from '@app/core/services/data.service';
import { HttpService } from '@app/core/services/http.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { GlobalConstants } from '@app/design-channels/common/globalConstants';
import { TranslateService } from '@ngx-translate/core';
import lodash, { find } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { TreeItem, TreeviewConfig, TreeviewItem } from 'ngx-treeview';

@Component({
  selector: 'app-custom-tree-expand-merge-tag',
  templateUrl: './custom-tree-expand-merge-tag.component.html',
  styleUrls: ['./custom-tree-expand-merge-tag.component.scss']
})
export class CustomTreeExpandMergeTagComponent implements OnInit {
  @ViewChild('mergeTagsListData', { static: false }) mergeTagsListData!: ElementRef;
  @ViewChild('listOfMergeTagDataElemReference') eachMergeTagDataElemReference!: ElementRef;
  @Output() sendMergeTagDataToComponent = new EventEmitter<any>();
  @ViewChild('showcurrentMergeTagDrpdwn') showcurrentMergeTagDrpdwn!: ElementRef;
  isPersonalizeTagMode: boolean = false;
  tagKey: any;
  promotionKey: number = 0;
  currentSplitId: any;
  commChannelKey: any;
  
  customBootstrapStyle: any = ['btn btn-outline-primary buttonStyle shadow-none'];
  copiedDivEnabled: boolean = false;
  items!: TreeviewItem[];
  uuidOnload:string = "";
  expandChildName:any;
  configuration = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500,
  });
  openMergeTagDataPopup: boolean =false;
  @Input() currentSelectedInput:any;
  @Input() mergeTagDataItems:any;
  @Input() parentMergeTagExtJSON:any;
  @Input() currentDynamicContentRule:any;
  @Input() selectedRowModelName:any;
  selectedMergeTagChildObj: any;
  constructor(
    private translate: TranslateService,
    private shareService: SharedataService,
    private dataService: DataService,
    private httpService: HttpService,
    private clipboard: Clipboard,
    private renderer: Renderer2
  ) {
    this.tagKey = localStorage.getItem('tagKeyPersonalization');
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

    //this.getMergeTagData();
    Window["CustomTreeExpandMergeTagComponent"] = this;
  }

  ngOnInit(): void {}

  // getMergeTagData() {
  //   let url: any;
  //   const baseEndpoint = AppConstants.API_END_POINTS.GET_DME_MERGE_TAG_OBJ;
  //   const parentComponentName = GlobalConstants.parentComponentName;
  //   let apiParams = '';

  //   console.log(parentComponentName);
    
  //   if(parentComponentName == "RatingsComponent") {
  //     apiParams = '&api=true&prod=true';
  //   } else {
  //     apiParams = '&api=false&prod=true';
  //   }

  //   if (this.isPersonalizeTagMode) {
  //     url = `${baseEndpoint}?tagKey=${this.tagKey}&wa=true${apiParams}`;
  //   } else {
  //     url = `${baseEndpoint}?promoKey=${this.promotionKey}&splitKey=${this.currentSplitId}&wa=false${apiParams}`;
  //   }

  //   this.httpService.post(url).subscribe((data) => {
  //     if (data.status === 'SUCCESS') {
  //       this.mergeTagDataItems = JSON.parse(data.response).root;
  //       //this.loadData();
  //       //console.log(this.mergeTagDataItems);
  //     }
  //   });
  // }
  showMergeTagDropDownMethod(){
    //this.uuidOnload = uuidv4();
  //  this.openMergeTagDataPopup = true;
  //  if(this.openMergeTagDataPopup)
  //this.currentSelectedInput =
   
   let mergepopupDivposition = this.showcurrentMergeTagDrpdwn.nativeElement;
   //let count = evt.target.scrollHeight+45;
   //mergepopupDivposition.setAttribute("style","top:"+count+'px');
   //let presentDiv = mergepopupDivposition.getElementsByClassName(key);
  //presentDiv.className = presentDiv.className.replace('d-none','d-block');
   this.openMergeTagDataPopup = !this.openMergeTagDataPopup;
  }
  stringfyJsonMethod(obj){
    let strFyObj = JSON.stringify(obj);
    return strFyObj;
  }
  eachIterationMethod(evt){
    let checkIfChildrenPresent = evt.target.getAttribute('name');
    let childObj = JSON.parse(checkIfChildrenPresent);
    console.log(childObj);
  }
  innerChildDataMethod(evt,objStr){
    //let parentElem = evt;
     let childObj = JSON.parse(lodash.unescape(objStr));
     if(childObj.children !== undefined){
      this.getChildrenDataMethod(evt,childObj);
     }
     
    //console.log(objStr);
  }
  copyMergeTagAndSendDataMethod(evt,val){
    //let val = evt.getAttribute('data-value');
    this.sendMergeTagDataToComponent.emit({value:val,inputId:this.currentSelectedInput});
    //console.log(val);
  }
  
  getChildrenDataMethod(evt,itemObj){  
    let findElem;
    let isElemStatus;
    let isExpandedElemFound;
    if(this.eachMergeTagDataElemReference !== undefined){
      findElem = this.eachMergeTagDataElemReference.nativeElement;

      isExpandedElemFound =findElem.getElementsByClassName('pExpandChildName_'+itemObj.text);
      //isExpandedElemFound = findElem.getElementsByClassName('allchildExpandNameSection');
      isElemStatus = !lodash.isEmpty(isExpandedElemFound);
      if(evt.target === undefined){
        evt.className = evt.className.replace('fa-caret-up','fa-caret-down');
      }else{
        evt.target.className = evt.target.className.replace('fa-caret-up','fa-caret-down');
      }
      
    }else{
      findElem = evt.parentElement.parentElement;
      isExpandedElemFound = findElem.getElementsByClassName('pExpandChildName_'+itemObj.text);
      isElemStatus = !lodash.isEmpty(isExpandedElemFound);
      evt.className = evt.className.replace('fa-caret-up','fa-caret-down');
    }    
    
    if(isElemStatus){     
      isExpandedElemFound[0].remove();
    }else{
    let parentElem;
    if(evt.target !== undefined){
      parentElem = evt.target.parentElement;
      evt.target.className = evt.target.className.replace('fa-caret-down','fa-caret-up');
    }else{
      parentElem = evt.parentElement;
      evt.className = evt.className.replace('fa-caret-down','fa-caret-up');
    }
    
    //let childObj = lodash.find(this.mergeTagDataItems,{text:}).children;
    let childObj = itemObj.children;
    let liOBjArry:any = [];
    let labelText:any;
    let liHtml:any;
    let checkIfMultiResponse:any = false;
    if(itemObj.text === "API parameters"){
      this.selectedMergeTagChildObj =  this.parentMergeTagExtJSON.find(x => x.name == itemObj.text).child;
    }else if(itemObj.text === "DME"){
      let nonCustomerDMEs = this.parentMergeTagExtJSON.find(x => x.type == "NonCustomerDme")!== undefined ? this.parentMergeTagExtJSON.find(x => x.type == "NonCustomerDme").child : [];
      let customerDMEs = this.parentMergeTagExtJSON.find(x => x.type == "customerDme") !== undefined ? this.parentMergeTagExtJSON.find(x => x.type == "customerDme").child : [];
      let combineBoth = [...nonCustomerDMEs,...customerDMEs];
      this.selectedMergeTagChildObj = combineBoth;      
    }
          
          if(itemObj.text !== "API parameters" && itemObj.text !== "DME" && itemObj.text !== "Device parameters" && itemObj.text !== "Tag parameters" && itemObj.text !== 'Customer' && itemObj.text !== 'Promotion' && itemObj.text !== 'Product'){
            if(this.selectedMergeTagChildObj !== undefined){
              if(this.currentDynamicContentRule?.maxCount !== undefined && this.currentDynamicContentRule?.maxCount > 1 && itemObj.text === this.selectedRowModelName){
                //checkIfMultiResponse = this.selectedMergeTagChildObj.find(x => x.name == itemObj.text).isMultiObjOutput || false; // old logic
                checkIfMultiResponse = this.currentDynamicContentRule?.maxCount > 1 ? true : false;
              }else{
                checkIfMultiResponse = false;
              }                  
            }else{
              checkIfMultiResponse = false;
            }
          }
            if(checkIfMultiResponse){
              // This is for number of records if multi response API / DME then show only 1 attribute "number of records" 
              let objItem = {children:[],text:'number_of_records',value:'number_of_records'};
              // let iTagEleRef = document.createElement("i");
              let multiICon = document.createElement("i");
              // multiICon.className = 'far fa-snowflake mr-2';
              // multiICon.setAttribute('data.value',itemObj.value);
              // multiICon.setAttribute("title",'Multi response API'); 
                    labelText = `<label class="m-0 lighterInnerColorTitle ellipseText smallLabel" title="`+objItem.text+`">`+objItem.text+`</label>`;
                    liHtml = document.createElement("li");
                    liHtml.className = "list-group-item d-flex justify-content-left align-items-center p-2 pl-5 pointer smallLabel";
                    liHtml.setAttribute("value",objItem.value);
                    liHtml.setAttribute("title",objItem.text);
                    liHtml.setAttribute("onclick",`Window.CustomTreeExpandMergeTagComponent.copyMergeTagAndSendDataMethod(this,"`+objItem.value+`")`); 
                  //  copyIconElem = copyIcon.outerHTML;
                  liHtml.innerHTML = multiICon.outerHTML+labelText;
                  let liStructure = liHtml.outerHTML;
                  liOBjArry.push(liStructure);
            }else{
              if(childObj !== undefined){
                childObj.forEach((item,i) => {
                  let iTagEleRef = document.createElement("i");
                  let copyIconElem:any;
                   
                  
                  if(item.children !== undefined){             
                        iTagEleRef.className = "fas fa-caret-down mr-3";
                        iTagEleRef.setAttribute("data-index",i);
                        iTagEleRef.setAttribute("data-label",item.text);
                        let paramsChildobj = lodash.escape(JSON.stringify(item));
                        iTagEleRef.setAttribute("onclick",`Window.CustomTreeExpandMergeTagComponent.innerChildDataMethod(this,"`+paramsChildobj+`")`);
                        copyIconElem = "";
                        labelText = `<label class="m-0 lightColorTitle ellipseText smallLabel" title="`+item.text+`">`+item.text+`</label>`;
                        liHtml = document.createElement("li");
                        liHtml.className = "list-group-item d-flex justify-content-left align-items-center p-2 pl-3 pointer smallLabel";
                        liHtml.setAttribute("value",item.value);
                        liHtml.setAttribute("title",item.text);
                        //liHtml.setAttribute("onclick",`Window.CustomTreeExpandMergeTagComponent.copyMergeTagAndSendDataMethod(this,"`+item.value+`")`); 
                      //}
                    
                  }else{                    
                    let copyIcon = document.createElement("i");
                    copyIcon.className = 'far fa-copy fa-lg floatCopyIcon';
                    copyIcon.setAttribute('data.value',item.value);
                    copyIcon.setAttribute("onclick",`Window.CustomTreeExpandMergeTagComponent.copyMergeTagAndSendDataMethod(this,"`+item.value+`")`); 
                    labelText = `<label class="m-0 lighterInnerColorTitle ellipseText smallLabel" title="`+item.text+`">`+item.text+`</label>`;
                    liHtml = document.createElement("li");
                    liHtml.className = "list-group-item d-flex justify-content-left align-items-center p-2 pl-5 pointer smallLabel";
                    liHtml.setAttribute("value",item.value);
                    liHtml.setAttribute("title",item.text);
                    liHtml.setAttribute("onclick",`Window.CustomTreeExpandMergeTagComponent.copyMergeTagAndSendDataMethod(this,"`+item.value+`")`); 
                    copyIconElem = copyIcon.outerHTML;
                  }
                  liHtml.innerHTML = iTagEleRef.outerHTML+labelText;
                  // let liStructure:any = `
                  //   `+liHtml.outerHTML+`
                  //     `+iTagEleRef.outerHTML+`
                  //     `+labelText+`
                  //     </li>
                  //     `
                  let liStructure = liHtml.outerHTML;
                    liOBjArry.push(liStructure);
                });
              }
            }
          
    
    let joinLiContent = liOBjArry.join('');
     
    
    let UlLiStructure = `<ul class="col p-0 list-group ulExpandChildName_`+itemObj.text+`">
      `+joinLiContent+`
    </ul>
          `
    let eleRef = document.createElement('p');
    eleRef.className = "allchildExpandNameSection pExpandChildName_"+itemObj.text+ ' m-0';
    // eleRef.setAttribute("*ngIf","expandChildName =="+itemObj.text);
    eleRef.innerHTML = UlLiStructure;
    parentElem.after(eleRef);
    //this.renderer.(evt.target,UlLiStructure);
    }
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
    this.items = this.getItems(this.mergeTagDataItems);
    setTimeout(() => {
      this.resetCheckedFalseInMergeTag();
    }, 500);
  }
  resetCheckedFalseInMergeTag() {
    let dropdownEMl: any = this.mergeTagsListData;
    dropdownEMl.buttonLabel = this.translate.instant('recommendationComponent.CopyFromMergeTags');
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
  getItems(parentChildObj: any[]) {
    let itemsArray: TreeviewItem[] = [];
    parentChildObj.forEach((set: TreeItem) => {
      if (set.children != undefined) {
        itemsArray.push(new TreeviewItem(set, true));
      }
    });
    return itemsArray;
  }
}
