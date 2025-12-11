import { Component, OnInit, Output,EventEmitter, ViewChild, ElementRef,HostListener, AfterViewInit,NgZone} from "@angular/core";
import { AppConstants } from "@app/app.constants";
import { GlobalConstants } from '../../design-channels/common/globalConstants';
import { HttpService } from "@app/core/services/http.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataService } from '@app/core/services/data.service';
import { LoaderService } from '@app/core/services/loader.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dm-columnar',
  templateUrl: './dm-columnar.component.html',
  styleUrls: ['./dm-columnar.component.scss']
})
export class DmColumnarComponent implements OnInit {
  @ViewChild('columnarTemplateElement') columnarTemplateElement!: ElementRef;
  @ViewChild('exportSettingsElements') exportSettingsElements!: ElementRef;
  @ViewChild('tableColumnarData') tableColumnarData!: ElementRef;  
  @ViewChild('colValInputContent') colValInputContent!: ElementRef;   
  offerDrawerSectionEnable: boolean = false;
  backropOffersEnable: boolean = false;
  modalRef?: BsModalRef;
  insertOfferAt: any;
  selectedPlaceHolderInput: any;
  isDmColumnarEditModeEnable:any = {};
  currentSplitId: any;
  channelsPayloadObj: any;
  senderDetails: any;
  senderId: any;
  columnHerderVal: any;
  venderDesc: any;
  selectedRecoOffersToSubmit: any = [];
  selectedOffersToSubmit: any = [];
  promoKey: any;
  commChannelKey: any;
  finalDmPayloadData:any;
  dbKey: any;
  channelName: any;
  currentObj: any;
  channelObj: any;
  collectOffersFromInputSelected: any = [];
  enablePlusBtn: boolean = false;
  columnarTableData:any = [];
  orderRowId: any = 1;
  promotionSplitHelper: any;
  channelSavedArray: any;
  columnarTemplates: any;
  maxCollength: any;
  templateWitNoofColumns: any;
  selectedDelimiter: any = ',';
  selectedEnclosure: any = '';
  isIncludeHeaders: boolean = false;
  createColumnData: any = [];
  columnObj = {};
  selectedColumnarTemplate: any;
  selectedTemplateName: any;
  venderDetails: any;
  offersDataJson: any;
  isSaveAsTemplateEnable:boolean = false;
  templateNameEntered: any;
  selectedRecoOffersEdit: any;
  tempPublishArry: any = [];
  publishRecommendationOffers: any = [];
  constructor(private httpService: HttpService, private dataService: DataService, private shareService:SharedataService,
    private modalService:BsModalService, private loader:LoaderService,private translate:TranslateService, private ngzone: NgZone) { 
      AppConstants.OFFERS_ENABLE.MERGE_TAG = true;
      AppConstants.OFFERS_ENABLE.RECOMMENDATION_OFFERS = true;
      AppConstants.OFFERS_ENABLE.STATIC_OFFERS = true;
      
      this.shareService.currentSelectedChannelObj.subscribe((res:any) => {
        if(Object.keys(res).length > 0){
          this.currentSplitId = res.currentSplitId;
          this.promoKey = res.promotionKey;
          this.commChannelKey=res.commChannelKey;
          this.channelName = res.channelName;
          this.currentObj = res.currentObj;
        }      
      });
      this.shareService.channelObj.subscribe(res => {
        this.channelObj = res;   
      });
      
      this.shareService.offersToSubmit.subscribe(res => {
        if(Object.keys(res).length > 0){
          if(this.selectedOffersToSubmit.length > 0){
            this.selectedOffersToSubmit.push(...res); // insert items add newly.
          }else{
            this.selectedOffersToSubmit = res;
          }
                    
        }
      });
      this.shareService.recomendationOffersToSubmit.subscribe(res => {
        if(Object.keys(res).length > 0){
          if(this.selectedRecoOffersToSubmit.length > 0){
            this.selectedRecoOffersToSubmit.push(...res); // insert items add newly.
          }else{
            this.selectedRecoOffersToSubmit = res;
          }
        }
      });

      this.columnarTableData = [
        // {id:1,colname:'',colvalue:'',order:1,splitId:this.currentSplitId},
        // {id:2,colname:'',colvalue:'',order:2,splitId:this.currentSplitId},
        // {id:3,colname:'',colvalue:'',order:3,splitId:this.currentSplitId},
        // {id:4,colname:'',colvalue:'',order:4,splitId:this.currentSplitId}
      ]
      setTimeout(() => {
        this.getVendorNameObj();
        this.getColumnarTemplates();        
        this.getSavedData();
      },1000);

     }
     @HostListener('document:click', ['$event.target'])
      clickout(event) {        
        if(event.className.includes('columnValueInp')){
          let id = event.id;
        if(id !== undefined){
          id = id.split('_')[1];
        }
          this.orderRowId = id;
          this.enablePlusBtn = true;
        }else{
          this.enablePlusBtn = false;
        }
      }
     getCaretIndex(evt:any, inputId) {
      this.selectedPlaceHolderInput = inputId;
      var sel, range;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          //range.deleteContents();
          this.insertOfferAt = range;
          GlobalConstants.insertionPoint = this.insertOfferAt;
        }
      }      
       
       this.collectDraggedOffers(evt,false);
    }
    updateColumnValue(id,html){
      // let currtEle = this.colValInputContent.nativeElement;
      // let colEle = currtEle.getElementsByClassName('colVal_'+id)[0];
      // if(colEle !== undefined){

      // }
      let colId = id.split('_')[1];
      this.createColumnData[colId]['value'] = html;
    }
    getVendorNameObj() {
      if(this.channelObj !== undefined && this.currentSplitId !== undefined){
        this.currentObj = this.channelObj.find(x => x.promoSplitId === this.currentSplitId);
        this.senderId = this.currentObj.senderId;
        this.dbKey = this.currentObj.dbKey;
      }     
      if(typeof(GlobalConstants.promoKey) !== 'undefined'){
        let url = AppConstants.API_END_POINTS.GET_VENDOR_NAMES+`?promoKey=${GlobalConstants.promoKey}`;
        this.httpService.post(url).subscribe((resultObj) => {
          this.venderDetails = JSON.parse(resultObj.response);
          this.senderDetails = this.venderDetails[this.commChannelKey]['senderIds'][this.senderId];
          this.venderDesc = this.venderDetails[this.commChannelKey]['vendorDesc'];
          //this.getoffersDataObj("");
        });
      }
    }
    async getoffersDataObj(filterBy) {
      const promoKey = {
       promotionKey: this.promoKey, // mandatory
       maxRecordsDisplay: 50, // optional, default to 50
       startPos: 0,
       isCouponEnable: false,
       filterByKey: "offerCode",
       filterByValue: filterBy,
       splitKey:this.currentSplitId
     };
     const resultObj = await this.httpService.post(AppConstants.API_END_POINTS.GET_OFFERS_DATA,promoKey).toPromise();
     if(resultObj.status == 'SUCCESS'){
       this.offersDataJson = resultObj.response.offers;    
     }
     
   }
    openOfferSliderPopup(evt,isInput){
      let idEle = isInput;
      this.selectedPlaceHolderInput = idEle;
      this.shareService.showMergedTagCopyIcon.next(true);
      if(this.offerDrawerSectionEnable){
        this.backropOffersEnable = false;
        this.offerDrawerSectionEnable = false;
      }else{
        this.backropOffersEnable = true;
        this.offerDrawerSectionEnable = true;
      }   
      this.loader.HideLoader();
    }
    formatToneWidgetText(inputText:any) {
      return inputText.replaceAll('&lt;tonewidget&gt;', '<tonewidget>').
      replaceAll('&lt;/tonewidget&gt;', '</tonewidget>').replace(/<[\/]{0,1}(div)[^><]*>/g,' ').replace(/(?:&nbsp;)/g,' ').replace(/\<p>/gi, '').replace(/\<\/p>/gi, '').replaceAll("\"","&quot;").replaceAll("&amp;","&").replaceAll("\'","&#39;")
    }
     collectDraggedOffers(evt,isEditLoad){
       this.collectOffersFromInputSelected = [];
       let eachSpan;
       if(isEditLoad){
          eachSpan = evt.getElementsByTagName('span');
       }else{
          eachSpan = evt.target.getElementsByTagName('span');
       }    
       if(eachSpan.length > 0){
       Object.values(eachSpan).map((obj:any) => {
         let dbkeyAttr = obj.getAttribute('data-dbkey');
         let nameAttr = obj.getAttribute('data-name');
         let offerCount = obj.getAttribute('data-selectedRecoCount');
         if(dbkeyAttr !== undefined && nameAttr !== undefined){
           const savedAttrsObj = {"id":dbkeyAttr,"value":nameAttr,"offerSelected":offerCount};
           this.collectOffersFromInputSelected.push(savedAttrsObj);
           //console.log(this.collectOffersFromInputSelected);  
         }
       });    
     }
     this.shareService.dmColumnarEditModeOffersSelected.next(this.collectOffersFromInputSelected);
     }

     getSavedData() {
      let url = AppConstants.API_END_POINTS.GET_SAVED_USAGE_TEMPLATES+`?promoKey=${GlobalConstants.promoKey}`;
      this.httpService.post(url).subscribe((data) => {
        if(data.status === 'SUCCESS') {
          if(data.response.adminCommTemplate !== "") {
            this.channelSavedArray = JSON.parse(data.response.adminCommTemplate);
            this.shareService.channelsPayloadObj.next(this.channelSavedArray);
            var dmEditObj = this.channelSavedArray.find(x => x.promoSplitKey === this.currentSplitId);
            
          }
          this.promotionSplitHelper = JSON.parse(data.response.promotionSplitHelper);
            if(Object.keys(this.promotionSplitHelper).length > 0) {
              GlobalConstants.varArgs = this.promotionSplitHelper.splitsGroups[0].channels[0].varArgs.root.item;
            }
            if(dmEditObj !== undefined) {              
              this.updateSavedData(dmEditObj);
             }
             // else {
            //   this.setActiveTab('');
            // }
        }
      });
      this.setActiveTab('');
    }
    updateSavedData(editObj){
      let edObj = JSON.parse(editObj.templateText);      
      let tempElemt = this.columnarTemplateElement.nativeElement;
      let exportElemts = this.exportSettingsElements.nativeElement;      
      //let tempName = this.columnarTemplates.find(x => x.templateName == edObj.templateName);
      tempElemt.value = editObj.templateParentKey;
      this.selectedColumnarTemplate = editObj.templateParentKey;
      //this.selectedColumnarTemplate = edObj.templatedbkey;
      let delElemt = exportElemts.getElementsByClassName('delimiterSelect')[0];
      let enclosElemt = exportElemts.getElementsByClassName('enclosureSelect')[0];
      let includeHeadElemt = exportElemts.getElementsByClassName('includeHeaderCheck')[0];
      delElemt.value = edObj.structure.colSep;
      if(edObj.structure.colEncloser == ''){
        edObj.structure.colEncloser = '-1';
     } 
      enclosElemt.value = edObj.structure.colEncloser;
      includeHeadElemt.checked = edObj.structure.includeHeaders;
      this.selectedDelimiter = edObj.structure.colSep;           
      this.selectedEnclosure = edObj.structure.colEncloser;
      this.isIncludeHeaders = edObj.structure.includeHeaders;
      this.eachColRepeatEdit(edObj.structure.col);

      //--------- collect Saved selected offer and Reco
      let selOffrs = this.promotionSplitHelper.splitsGroups.find(x => x.splitId === this.currentSplitId).channels[0].selectedOffers;
      let selectOffersStatic = selOffrs.filter(x => x.ruleKey === 0);
      this.selectedRecoOffersEdit = selOffrs.filter((y:any) => y.ruleKey !== 0);
      const recoFilteredObj =  [...new Map(selOffrs.map(item =>
        [item['ruleKey'], item])).values()];
      let selectRecoOffers = recoFilteredObj.filter((y:any) => y.ruleKey !== 0);
      if(selectOffersStatic !== undefined){
        if(selectOffersStatic.length > 0 ){
          selectOffersStatic.forEach(each => {
            const savedAttrsObj = {"offerKey":each.offerKey,"couponFlg":each.noTemplateCouponEnabled};
            this.collectOffersFromInputSelected.push(savedAttrsObj);
          });
          this.selectedOffersToSubmit = this.collectOffersFromInputSelected;
        } 
      }
      if(selectRecoOffers !== undefined){
        if(selectRecoOffers.length > 0 ){
          selectRecoOffers.forEach((each:any,i) => {
            let countVal = this.selectedRecoOffersEdit.filter(x => x.ruleKey === each.ruleKey);
            if(countVal !== undefined){
              countVal = countVal.length;
            }
            var couponFlg;
            if(each.noTemplateCouponEnabled){
              couponFlg = 1;
            }else{
              couponFlg = 0;
            }

            this.tempPublishArry.push({
              key: each.ruleKey,
              offerTemplateKey:0,
              widgetId:i+1,
              count: countVal,
              couponFlg: couponFlg,  
              ruleTemplateKey:'-1',
              type: "RO"
            });
          });
          

      } 
      this.publishRecommendationOffers.push(
        {
          promotionKey: this.promoKey,
          splitKey: this.currentSplitId,
          commChannelKey: this.commChannelKey,
          item: this.tempPublishArry
        }
      )
      this.shareService.recomendationOffersToSubmit.next(this.publishRecommendationOffers);
    }
    }
    eachColRepeatEdit(objArry){
      objArry.map((each:any,i) => {
        let obj =  {id:i,colname:each.header,colvalue:each.value,order:i,editable:each.editable};
        let cobj = {header:each.header,value:each.value,type:null,editable:true};
        this.createColumnData.push(cobj); // Noof row for Save as template
        this.columnarTableData.push(obj); // noof rows for UI rendering
        setTimeout(() => {
          let colInpVal = this.colValInputContent.nativeElement.getElementsByClassName('colVal_'+i)[0];
          colInpVal.innerHTML = each.value;
        },700);        
      });
    }
    async getColumnarTemplates(){
      this.selectedColumnarTemplate = '-1';
      const resultObj = await this.httpService.post(AppConstants.API_END_POINTS.GET_DM_COLUMNAR_TEMPLATE_OBJ+this.commChannelKey).toPromise();
      if(resultObj.status == 'SUCCESS'){
        this.columnarTemplates = JSON.parse(resultObj.response.templates);  
      }
    }
    getColumnarTemplateData(evt){
      let tempdbkey = evt.target.value;
      if(tempdbkey == '-1'){
        this.columnarTableData = [];
        this.createColumnData = [];
        this.selectedColumnarTemplate = tempdbkey;
      }else{
        let currentTempls = this.columnarTemplates.find(x => x.dbKey == tempdbkey);
        let currtTempCols = JSON.parse(currentTempls.templateText).structure;
        this.selectedColumnarTemplate = tempdbkey;
        this.maxCollength = currtTempCols.maxcol;
        this.templateWitNoofColumns = currtTempCols.col;
        this.selectedTemplateName = currentTempls.templateName;
        if(this.templateWitNoofColumns !== undefined){
          this.columnarTableData = [];
          this.createColumnData = [];          
          this.templateWitNoofColumns.map((each:any,i) => {
            let obj =  {id:i,colname:each.header,colvalue:each.value,order:i,editable:each.editable};
            let cobj = {id:i,header:each.header,value:each.value,type:null,editable:each.editable};
            this.createColumnData.push(cobj); // Noof row for Save as template
            this.columnarTableData.push(obj); // noof rows for UI rendering
            setTimeout(() => {
              let colInpVal = this.colValInputContent.nativeElement.getElementsByClassName('colVal_'+i)[0];
              colInpVal.innerHTML = each.value;
            },700); 
          });
        }
      }
    }
    
    addFieldsColumn(evt){
      let colsLength = this.columnarTableData.length;
      let saveObjlength = this.createColumnData.length;
      let filterOrderBy = this.columnarTableData.sort((a, b) => a.id - b.id);
      let lastIndex = filterOrderBy[colsLength - 1].id;
      if(colsLength > 0){
        let obj =  {id:lastIndex+1,colname:'',colvalue:'',order:lastIndex+1,editable:true};
        this.columnarTableData.push(obj);
      }
      if(saveObjlength > 0){
        let cobj = {id:lastIndex+1,header:'',value:'',type:null,editable:true};
        this.createColumnData.push(cobj); // Noof row for Save as template
      }
    }
    deleteFieldsColumns(delId){
      if(this.columnarTableData.length > 1){
        let indexTemp = this.columnarTableData.findIndex(x => x.id == delId); 
        this.columnarTableData.splice(indexTemp,1);
        this.createColumnData.splice(indexTemp,1);
      }      
    }
    
    columnMoveUp(order,index) {
      //console.log("up", this.array[index]);
      if (index >= 1){
        this.swap(this.columnarTableData, index,index-1,order);
      }
        
    }
  
    columnMoveDown(order,index) {
      //console.log("down", this.array[index])
     if (index < this.columnarTableData.length - 1){
      this.swap(this.columnarTableData, index,index+1, order);
     }
        
    }
  
    swap(array:any[], x: any, y: any,order) {
      var b = array[x];
      array[x] = array[y];
      array[y] = b;
      
    }
    selectDelimiter(evt){
      let selVal = evt.target.value
      this.selectedDelimiter = selVal;
    }
    selectEnclosure(evt){
      let selVal = evt.target.value
      this.selectedEnclosure = selVal;
    }
    checkIncludeHeader(evt){
      if(evt.target.checked){
        this.isIncludeHeaders = true;
      }else{
        this.isIncludeHeaders = false;
      }
     }
     getColunmValues(evt,type,order){      
      let isType = type;      
      if(type === 'name'){
        let seleVal = evt.target.value;       
        this.createColumnData[order]['header'] = seleVal;
      }else if(type === 'value'){
        let seleVal = evt.currentTarget.innerHTML;        
        this.createColumnData[order]['value'] = this.dataService.formatToneWidgetText(seleVal);
      }
     }
     updateColumnValues(val,type,order){      
      let isType = type;      
      if(type === 'name'){
        let seleVal = val;       
        this.createColumnData[order]['header'] = seleVal;
      }else if(type === 'value'){
        let seleVal = val;        
        this.createColumnData[order]['value'] = this.dataService.formatToneWidgetText(seleVal);
      }
     }
     saveAsTemplate(){      
      let saveTemp = {
        "saveTemp": true,
        "editable": true,
        "structure": {
            "colSep": this.selectedDelimiter,
            "colEncloser": this.selectedEnclosure,
            "encloserSepEnable": true,
            "type": null,
            "maxCol": 1000,
            "minCol": 1,
            "includeHeaders": this.isIncludeHeaders,
            "col": this.createColumnData
        },
        "headerEditable": true,
        "includeHeaderEnable": this.isIncludeHeaders,
       // "templateName":this.selectedColumnarTemplate,
    }
    let channelType = this.channelObj.find(x => x.promoSplitId === this.currentSplitId).channelType;
    let mainSavedObj = {
      channelKey: this.commChannelKey,
      promotionKey: this.promoKey,
      template_json:JSON.stringify(saveTemp),
      template_name:this.templateNameEntered,
      templateKey :this.selectedColumnarTemplate,
      channelType:channelType,
    }
    return mainSavedObj;
    }
    openPopupForSaveAsTemplate(){
      let resObj = this.checkColumnValuesArePresent();
      if(resObj){
        this.backropOffersEnable = true;
      this.isSaveAsTemplateEnable = true;
      }      
    }
    checkColumnValuesArePresent(){
      let flag = true;
      if(this.createColumnData.length > 0){ 
        let lengthFieldName = this.createColumnData.filter(x => x.header == null || x.header == '').length;
      let lengthFieldValue = this.createColumnData.filter(x => x.value == null || x.value == '').length;
      if(lengthFieldName > 0 || lengthFieldValue > 0){
        Swal.fire({
        icon: 'warning',
        text: this.translate.instant('dmColumnarCompontent.columnNameValueEmptyErrorMsgLbl'),
        showConfirmButton:true,
        confirmButtonText:this.translate.instant('designEditor.okBtn')
      });
       flag = false;
      }
      }else if(this.selectedColumnarTemplate == '-1'){
        Swal.fire({
          icon:'warning',
          text:this.translate.instant('dmColumnarCompontent.selectColumnarTemplateContinueAlertMsgLbl'),
          showConfirmButton:true,
          showCancelButton:false,
          confirmButtonText:this.translate.instant('designEditor.okBtn'),
        })
        flag = false;
      }
      return flag;
    }
    closeSaveAsTemplatePopup(){
      this.backropOffersEnable = false;
      this.isSaveAsTemplateEnable = false;
    }
    async callSaveAsTemplate(){
      let savedJSon = this.saveAsTemplate();
      if(savedJSon.template_name === undefined){
        Swal.fire({
          icon: 'warning',
          text: this.translate.instant('dmColumnarCompontent.templateNameCannotBeEmptyAlertMsgLbl')        
        })
      }else{
        const resultObj = await this.httpService.post(AppConstants.API_END_POINTS.GET_DM_COLUMNAR_SAVEASTEMPLATE,savedJSon).toPromise();
        if(resultObj.status == 'SUCCESS'){
          let addSaveAsTemplate = JSON.parse(resultObj.message);
          if(addSaveAsTemplate !== undefined){
            this.columnarTemplates.splice(this.columnarTemplates.length,0,addSaveAsTemplate);
          } 
          Swal.fire({
            icon: 'success',
            text: resultObj.response         
          });
          this.closeSaveAsTemplatePopup();
        }else{
          Swal.fire({
            icon: 'warning',
            text: resultObj.response         
          })
        }
      }
      
    }
    setActiveTab(currentObj:any): void {
      if(this.currentSplitId !== undefined){
        const setAct = this.channelObj.findIndex(x => x.promoSplitId === this.currentSplitId);
        this.shareService.setActiveChannelTab.next(setAct);
      }
    }
   
     // final save
  finalSaveMethod(){   
    let callSaveMethod = this.checkColumnValuesArePresent();
    if(!callSaveMethod){
      return;
    }else{
    //let resObj = this.checkColumnValuesArePresent();
    //if(resObj){ 
      let savedJSon = this.saveAsTemplate();
    let payloadJson = {
      channels: [{
        PromotionKey: this.promoKey,
        channelId: this.commChannelKey,
        failSafe: false,
        failsafeSelectedOffers: [],
        html: encodeURIComponent(savedJSon.template_json),
        json: savedJSon.template_json,
        promoCommunicationKey: this.dbKey,
        promoSplitKey: this.currentSplitId,
        selectedOffers: this.selectedOffersToSubmit,
        selectedRecoWidgets:this.selectedRecoOffersToSubmit,
        subjectObj: null,
        preHeader: "",
        senderConfigKey: this.senderId,
        senderId: this.senderDetails,
        senderName: this.senderDetails,
        subject: "",
        vendorDesc: this.venderDesc,
        vendorId: this.senderId,
        templateKey: this.selectedColumnarTemplate,
        thumbnailImage: "",
        title: "",
        uuid: "",
        //hasDMOfferEnable:this.hasDmOffersEnable
      }]
    }
    this.finalDmPayloadData = payloadJson.channels[0];

    if(!this.isDmColumnarEditModeEnable[this.currentSplitId]) {
      if(Array.isArray(this.channelsPayloadObj) && this.channelsPayloadObj.length !== 0) {
        this.channelsPayloadObj.push(this.finalDmPayloadData);
      } else {
        this.shareService.channelsPayloadObj.next(payloadJson.channels);
      }
    }

    const url = AppConstants.API_END_POINTS.SAVE_ADMIN_PEOMO_TEMPLATE_USAGE;
    this.httpService.post(url, payloadJson).subscribe((data) => {
      this.dataService.SwalSuccessMsg(data.message);
    });
    //}
  }

  }
  ngOnInit(): void {
  }
     //------- Offers Slider ------------
     onCloseOfferDrawer(){
      this.backropOffersEnable = false;
      this.offerDrawerSectionEnable = false;
    }
    finalOffersSelected(res){
      if(Object.keys(res).length > 0){
        Object.keys(res).map( key => {
          Object.values(res[key]).map((each:any) =>{
            if(each.type === 'RO'){
              each.attributes.map((attrList:any) => {
                const offertemp = "&nbsp;<span class='offerDynamic pointer' contenteditable='false' spellcheck='false' data-currentInputClassName='"+this.selectedPlaceHolderInput+"' data-dbkey='"+key+"' data-selectedRecoCount='"+each.offerSelected+"' data-name='"+attrList+"'>"+attrList+"</span>&nbsp;";
                this.insertHtmlAtCaret(offertemp);
              });            
            }else{
              const offertemp = "&nbsp;<span class='offerDynamic pointer' contenteditable='false' spellcheck='false' data-currentInputClassName='"+this.selectedPlaceHolderInput+"' data-dbkey='"+key+"' data-name='"+each.name+"'>"+each.value+"</span>&nbsp;";
               this.insertHtmlAtCaret(offertemp);
            //this.updateInappPreviewSection(this.currentInputFocused);
            }
            
          })
          
        });
        
      }
      //this.shareService.dmEditModeOffersSelected.next(this.showIngridData);
    } 
    insertHtmlAtCaret(html) {
      if(GlobalConstants.insertionPoint !== undefined){
        this.insertOfferAt = GlobalConstants.insertionPoint;
      }
      if(this.insertOfferAt === undefined){
        // Swal.fire({
        //   icon: 'warning',
        //   text: 'Please select the position where you want to insert the offers'           
        // })
      } else {
        let el = document.createElement("div");
        el.innerHTML = html;
        let frag = document.createDocumentFragment(), node, lastNode;
        while ( (node = el.firstChild) ) {
            lastNode = frag.appendChild(node);
        }
        let firstNode = frag.firstChild;
        //if(this.inserEmojiAt.startContainer.parentElement.id === this.selectedPlaceHolderInput){
          this.insertOfferAt.insertNode(frag); 
          if (lastNode) {
            this.insertOfferAt = this.insertOfferAt.cloneRange();
            this.insertOfferAt.setStartAfter(lastNode);
            //sel.removeAllRanges();
            //sel.addRange(range);
          }
        //}
        this.updateColumnValue(this.insertOfferAt.startContainer.id,this.insertOfferAt.startContainer.innerHTML);
      } 
    }
}
