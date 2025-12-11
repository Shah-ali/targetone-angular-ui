import { Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpService } from '@app/core/services/http.service';
import { DataService } from '@app/core/services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedataService } from '@app/core/services/sharedata.service';
import 'codemirror/mode/javascript/javascript'; // Import JavaScript mode
import { Clipboard } from '@angular/cdk/clipboard';
@Component({
  selector: 'app-fusion-js-api',
  templateUrl: './fusion-js-api.component.html',
  styleUrls: ['./fusion-js-api.component.scss']
})
export class FusionJsAPIComponent implements OnInit {
  @ViewChild('getEachInputData') getEachInputData!: ElementRef;
  @ViewChild('codemirrorElementReference') codemirrorElementReference!: ElementRef; 
  @ViewChild('confirmationErrorMsg') confirmationErrorMsg!: TemplateRef<any>;
  modalRef?: BsModalRef;
  jsScriptWrittenContent:any = "";
  codeMirrorOptions: any = {
    theme: 'default',
    mode: 'javascript',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true,
    //tabMode:'indent'
  };
  
  scriptName:any = "";
  scriptDesc:any = "";
  popupScriptName:any = "";
  popupScriptDesc:any = "";
  getListOfFusionJsArryObj: any = [];
  activeJsTab: any = "0";
  jsKey: any;
  showEditDeleteIcon: boolean = false;
  confirmationTitle: string = "";
  confirmationContentText: string = "";
  isDeleteCallEnabled: boolean = false;
  confirmationPopupFlag: boolean = false;
  returnValue: boolean = false;
  isDescExpandedEnabled: boolean = false;
  testConsoleExpandArea: boolean = false;
  testConsoleResponseContent: any;
  functionNameNargumentsCollectData: any = [];
  isTestConsoleSuccesMsg: boolean = false;
  executingMethodName: any = undefined;
  consoleLogErrorViewContent: any = [];
  isConsoleviewEnabled: boolean = false;
  collapseConsoleError: boolean = false;
  selectedRightArrow: boolean = false;
  collectPreviousQuery: any = [];
  jsFileStatus: any;
  outputCollapseIndex: any;
  showConsoleLogTab: boolean = false;
  tabIndex: any;
  extendOutputAreaSectionHeight:any = false;
  isLeftSideExpandedEnabled: boolean = true;
  initialSizeCodeMirrior: any;
  leftSideInitialSize: any;
  halfTestConsoleExpandConsole: boolean = false;
  halfHeightForTestConsole: any;
  filterListJsScript: any;
  scriptToolTipText: any = "";
  descriptionToolTipText: any = "";
  testConsoleToolTipText: any = "";
  discardChangesEnabled: boolean = false;
  showUnpublishedMsgEnabled: boolean = false;
  constructor(private modalService: BsModalService, private dataService:DataService,
    private translate: TranslateService,private httpService: HttpService,private shareService: SharedataService,private clipboard: Clipboard) { 
      this.shareService.fusionAPIJsModule.next(true);
    this.getListOfFusionJsMethod(0,this.discardChangesEnabled,false);
    
    

  }
  
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    //console.log('Window resized');
    let descWid = window.innerWidth / 6;
    let calcWidth = window.innerWidth - descWid; // 80- is Margin and padding space
    this.initialSizeCodeMirrior = calcWidth;
    this.leftSideInitialSize = descWid;
    this.isDescExpandedEnabled = false;
    this.halfHeightForTestConsole = 'unset';
    this.halfTestConsoleExpandConsole = false;
    setTimeout(() => {
      this.updateWidthOfCodeMirror(this.initialSizeCodeMirrior,80);
    }, 500);
  }
  updateWidthOfCodeMirror(calcWidth,extra){
    let eleref = this.codemirrorElementReference.nativeElement;
    let getCodeMirrorClass = eleref.getElementsByClassName('CodeMirror');
    if(getCodeMirrorClass !== undefined){
      getCodeMirrorClass.item(0).setAttribute("style","width:"+(calcWidth - extra)+"px");
    }    
  }
  updateHeightOfCodeMirror(extra){
    let eleref = this.codemirrorElementReference.nativeElement;
    let getCodeMirrorClass = eleref.getElementsByClassName('CodeMirror');
    if(getCodeMirrorClass !== undefined){
      let calcHeight = getCodeMirrorClass.item(0).clientHeight;      
      if(extra === undefined){
        this.halfTestConsoleExpandConsole = false;
        getCodeMirrorClass.item(0).style.height = calcHeight*2 +"px";
        getCodeMirrorClass.item(0).style.width = this.initialSizeCodeMirrior + 80;
        this.halfHeightForTestConsole = 'unset';
      }else{
        this.halfTestConsoleExpandConsole = true;
        getCodeMirrorClass.item(0).style.height = calcHeight / 2+"px";
        getCodeMirrorClass.item(0).style.width = (this.initialSizeCodeMirrior - 80)+'px';
        this.halfHeightForTestConsole = (calcHeight + 130) / 2;
      }      
    }    
  }
  ngOnInit(): void {
    setTimeout(() => {
      let descWid = window.innerWidth / 6;
      let calcWidth = window.innerWidth - descWid;  //80- is Margin and padding space      
      this.initialSizeCodeMirrior = calcWidth;
      this.leftSideInitialSize = descWid;
      this.halfHeightForTestConsole = 'unset';
      this.halfTestConsoleExpandConsole = false;
      this.scriptToolTipText= this.translate.instant('fusionJSComponent.hideLbl');
      this.descriptionToolTipText = this.translate.instant('fusionJSComponent.showLbl');
      this.testConsoleToolTipText = this.translate.instant('fusionJSComponent.showLbl');
      setTimeout(() => {
        this.updateWidthOfCodeMirror(this.initialSizeCodeMirrior,80);
      }, 500);
    }, 0);
  }
  setOutPutHeightMethod(evt,index){
    if(!this.collectPreviousQuery[index].extendActiveArea){
      this.extendOutputAreaSectionHeight = true;
      this.collectPreviousQuery[index].extendActiveArea =  true;
    }else{
      this.extendOutputAreaSectionHeight = false;
      this.collectPreviousQuery[index].extendActiveArea =  false;
    }    
  }
  getUpdatedScriptDescMethod(evt){
    let descVal = evt.target.value;
    this.scriptDesc = descVal;
  }
  showIcon(key){
    this.showEditDeleteIcon = true;
    //this.selectedRightArrow = false;
    this.activeJsTab = key;
  }
  hideIcon(key){
    this.showEditDeleteIcon = false;
    //this.selectedRightArrow = false;
    this.activeJsTab = key;
  }
  editCallMethod(key,discardFlag,isSavedCall){
    // status: 1-draft,2-published,3-unpublished
    let JsObj = this.getListOfFusionJsArryObj.find(x => x.jsKey == key);
    this.jsKey = JsObj.jsKey;
    this.scriptName = JsObj.scriptName;
    this.scriptDesc = JsObj.scriptDesc;
    this.jsScriptWrittenContent = "";
    this.activeJsTab = JsObj.jsKey;
    this.showEditDeleteIcon = false;
    this.selectedRightArrow = JsObj.jsKey;
    this.functionNameNargumentsCollectData = [];
    this.collapseConsoleError = false;
    this.collectPreviousQuery = [];
    this.consoleLogErrorViewContent = [];
    this.jsFileStatus = JsObj.status;
    this.testConsoleExpandArea = false;
    this.halfHeightForTestConsole = 'unset';
    this.halfTestConsoleExpandConsole = false;    
    setTimeout(() => {
      if(this.isDescExpandedEnabled){
        this.updateWidthOfCodeMirror(this.initialSizeCodeMirrior,this.initialSizeCodeMirrior / 4 + 80);
      }else{
        this.updateWidthOfCodeMirror(this.initialSizeCodeMirrior,80);
      }
    },0); 
    setTimeout(() => {
      if(JsObj.status == 2 || JsObj.status == 3){
        let objPublish = JsObj.publishedScript === undefined ? "":  JsObj.draftScript; // for Publish also we are using draft script.
        this.jsScriptWrittenContent = decodeURIComponent(objPublish);    
        if(isSavedCall){
          this.discardChangesEnabled = discardFlag;
          this.showUnpublishedMsgEnabled = isSavedCall; 
        } else{
          if(JsObj.status == 3){ // unpublished
            this.discardChangesEnabled = true; // for unpublished enable discard button
            //this.showUnpublishedMsgEnabled = true; // show unpublished message every onload.
          }else{
            this.discardChangesEnabled = false;  
            this.showUnpublishedMsgEnabled = false;
          }          
        }    
      }else{
        let objDraft = JsObj.draftScript === undefined ? "":  JsObj.draftScript;
        this.jsScriptWrittenContent = decodeURIComponent(objDraft);
        if(isSavedCall){
          this.discardChangesEnabled = discardFlag;
          this.showUnpublishedMsgEnabled = isSavedCall; 
        } else{
          this.discardChangesEnabled = false; 
          this.showUnpublishedMsgEnabled = false;
        }              
      }
      if(!this.returnValue){
        this.confirmationPopupFlag = true;
      }      

    }, 100);    
    
   }
   confirmationResultMethod(status,key,mode){
    this.returnValue = true;
    if(status){
      if(mode == "delete"){ //  delete call
        this.confirmationPopupFlag = false;
        this.closeModel();
        this.deleteJsCallMethod(key);
      }else if(mode === 'discard'){ // discard call
        this.confirmationPopupFlag = false;
        this.closeModel();
        this.discardChangesMethod();
      }else{ // edit call
        this.confirmationPopupFlag = false;
        this.jsFileStatus = '1'; // draft script
        this.closeModel();
        this.finalSaveNPublicJsFilehMethod(1,true); // saved as draft when Edit Published
      }
    }else{ // if cancel
      this.confirmationPopupFlag = false;
      this.closeModel();
      // if(!this.discardChangesEnabled){
      //   this.editCallMethod(key,false,false);
      // }   
    }
      
   }
   searchScriptListByName(evt){
    let searchStr = "";
    if(evt === undefined){
      searchStr = "";
    }else{
      searchStr = evt.target.value;   
    }
     
    this.filterListJsScript = this.getListOfFusionJsArryObj.filter((item) => {
      return item.scriptName.toLowerCase().indexOf(searchStr.toLowerCase().trim()) > -1;
    });
   }
  
   updateDescMethod(){
    this.scriptDesc = this.scriptDesc;
    this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('fusionJSComponent.savedSuccessfullyLbl'),'success');
   }
   expandCollaoseLeftSideAreaMethod(evt){
    let elem = evt.currentTarget;    
    if(elem.className.includes("sidebar__collapse-handle")){
      // if expanded then collapsed it
      this.isLeftSideExpandedEnabled = true;
      this.scriptToolTipText = this.translate.instant('fusionJSComponent.hideLbl');
    }else{ 
      // if collpsed then exapanded it
      this.isLeftSideExpandedEnabled = false;
      this.scriptToolTipText = this.translate.instant('fusionJSComponent.showLbl');;      
    }
    this.isDescExpandedEnabled = false;
    if(!this.testConsoleExpandArea){
      setTimeout(() => {
        if(this.leftSideInitialSize !== undefined && !this.isLeftSideExpandedEnabled){
          this.updateWidthOfCodeMirror(this.initialSizeCodeMirrior+this.leftSideInitialSize,100);
        }else{
          this.updateWidthOfCodeMirror(this.initialSizeCodeMirrior,80);
        }
        
      },0);
    }     
    this.searchScriptListByName(undefined);
   }
   expandCollapseDescMethod(evt){
    let elem = evt.currentTarget;
    if(elem.className.includes("sidebar__collapse-handle")){
      // if expanded then collapsed it
      this.isDescExpandedEnabled = true;
      this.descriptionToolTipText = this.translate.instant('fusionJSComponent.hideLbl');
      if(this.leftSideInitialSize !== undefined && !this.isLeftSideExpandedEnabled){
        this.updateWidthOfCodeMirror(this.initialSizeCodeMirrior,this.initialSizeCodeMirrior/7);
      }else{
        this.updateWidthOfCodeMirror(this.initialSizeCodeMirrior,45 + this.initialSizeCodeMirrior/5 + 80);
      }
        
    }else{ 
      // if collpsed then exapanded it
      this.isDescExpandedEnabled = false;
      this.descriptionToolTipText = this.translate.instant('fusionJSComponent.showLbl');
      if(this.leftSideInitialSize !== undefined && !this.isLeftSideExpandedEnabled){
        this.updateWidthOfCodeMirror(this.initialSizeCodeMirrior+this.initialSizeCodeMirrior/5,80);
      }else{
        this.updateWidthOfCodeMirror(this.initialSizeCodeMirrior,80);
      }
    }    
   }
   testConsoleExpandCollapseMethod(evt,halfExpand){
    let getElem = evt.currentTarget;
    if(getElem.className.includes("sidebar__collapse-handle")){         
      this.halfTestConsoleExpandConsole = false;  
      this.halfHeightForTestConsole = 'unset';
      this.testConsoleExpandArea = true;   
      this.testConsoleToolTipText = this.translate.instant('fusionJSComponent.hideLbl');
    }else{      
        this.testConsoleExpandArea = false;
        this.isDescExpandedEnabled = false; 
        this.testConsoleToolTipText = this.translate.instant('fusionJSComponent.showLbl');
        setTimeout(() => {
          if(this.leftSideInitialSize !== undefined && !this.isLeftSideExpandedEnabled){
            this.updateWidthOfCodeMirror(this.initialSizeCodeMirrior+this.leftSideInitialSize,100);
          }else{
            this.updateWidthOfCodeMirror(this.initialSizeCodeMirrior,80);
          }
        },0);    
      
    }       
   }
   setHalfHeightForTestConsoleMethod(evt){
    let eleRef = evt.currentTarget;
    if(eleRef.className.includes('expandHalf')){
      this.testConsoleExpandArea = false;
      this.isDescExpandedEnabled = false;        
      setTimeout(() => {
        this.halfTestConsoleExpandConsole = false;
        this.updateHeightOfCodeMirror(undefined);
      }, 0);      
    }else{
      this.testConsoleExpandArea = false;
      this.isDescExpandedEnabled = false; 
      this.halfTestConsoleExpandConsole = true;
      setTimeout(() => {
        this.updateHeightOfCodeMirror(296);
      }, 0);      
    }
  }
    
   extractAllFunctionDetails(functionString) {
    // Define a regex pattern to capture all function names and their arguments
    //const pattern = /(\w+)\s*\((.*?)\)/g; 
    const functionPattern = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)/g;
    const matches = [...functionString.matchAll(functionPattern)];

    const functions = matches.map(match => {
      let functionName:any;
      let argumentsString:any;
      let argumentList:any;

      if(match[1].includes('_main')){
        functionName = match[1]; // The function name
        argumentsString = match[2]; // The arguments as a string
        
        // Split arguments by comma and trim any whitespace
        argumentList = argumentsString
            ? argumentsString.split(',').map(arg => arg.trim())
            : [];
        
      }
      return { functionName, argumentList };
    });

    return functions;
}
    async executeQueryJsMethod(funName){
      let getInputArgrumentsData = this.getEachInputData.nativeElement;      
      let getObj = [...getInputArgrumentsData.getElementsByClassName("functionName_"+funName)];
      
      let obbj:any = [];
      getObj.map(x => {
        obbj.push(x.value);
      });
      let strConbine = funName+"("+obbj.join(',')+")";
        let endpoint = AppConstants.API_END_POINTS_OTHERS.TEST_CONSOLE_FUSIONJS_API;
      let scriptObj = {
        "scriptName":this.scriptName,
        "testScriptFunc":strConbine,
        "script" : encodeURIComponent(this.jsScriptWrittenContent)
      }  
      
      
      const result = await this.httpService.post(endpoint,scriptObj).toPromise();
      if (result.status == 'SUCCESS') {
        this.isTestConsoleSuccesMsg = true;        
        let resObj:any = result.response; 
        let consoleLogContentArry = result.response.consoleLog;
        let consoleInfoContentArry = result.response.consoleInfo;
        let typeofVal = typeof(result.response.response);
        let rawJSONobj:any;
        let resultResponse:any;
        if(typeofVal === "string"){
            rawJSONobj = result.response.response;
            resultResponse =  rawJSONobj;
          }else{
            rawJSONobj = JSON.parse(result.response.response);
            resultResponse = JSON.stringify(rawJSONobj,null,2);
          }
        let queryPrevText = {'methodName':strConbine,'response':resultResponse,"status":true,open:true,index:this.collectPreviousQuery.length,consoleLogError:consoleLogContentArry,consoleInfoError:consoleInfoContentArry,activetab:1,extendActiveArea:false,responseStatus:true};
        this.collectPreviousQuery.splice(this.collectPreviousQuery.length,0,queryPrevText);
        //let elemCreate = document.createElement('p');
        //elemCreate.innerHTML = consoleLogContent;        
        this.testConsoleResponseContent = JSON.stringify(rawJSONobj, null, 2);   
        //this.consoleLogErrorViewContent = consoleLogContentArry;        
        this.isConsoleviewEnabled = true;
        this.collapseConsoleError = true;
      }else{
        this.isTestConsoleSuccesMsg = false;
        this.isConsoleviewEnabled = false;
        if(result.response.response == undefined){
          let typeofVal = typeof(result.response);
          let rawJSONobj:any;
          let resultResponse:any;
          if(typeofVal === "string"){
            rawJSONobj = result.response;
            resultResponse =  rawJSONobj;
          }else{
            rawJSONobj = JSON.parse(result.response);
            resultResponse = JSON.stringify(rawJSONobj,null,2);
          }
           
          let queryPrevText = {'methodName':strConbine,'response':resultResponse,"status":true,open:true,index:this.collectPreviousQuery.length,consoleLogError:[this.translate.instant('fusionJSComponent.consoleLogNotFountLbl')],consoleInfoError:[this.translate.instant('fusionJSComponent.consoleLogNotFountLbl')],activetab:1,extendActiveArea:false,responseStatus:false};
          this.collectPreviousQuery.splice(this.collectPreviousQuery.length,0,queryPrevText);
          this.tabIndex = this.collectPreviousQuery.length;
          this.testConsoleResponseContent = JSON.stringify(rawJSONobj, null, 2);
        }else{
          let typeofVal = typeof(result.response.response);
          let rawJSONobj:any;
          let resultResponse:any;
          if(typeofVal === "string"){
            rawJSONobj = result.response.response;
            resultResponse =  rawJSONobj;
          }else{
            rawJSONobj = JSON.parse(result.response.response);
            resultResponse = JSON.stringify(rawJSONobj,null,2);
          }
          let queryPrevText = {'methodName':strConbine,'response':resultResponse,"status":false,open:true,index:this.collectPreviousQuery.length,consoleLogError:result.response.consoleLog,consoleInfoError:result.response.consoleInfo,activetab:1,extendActiveArea:false,responseStatus:false};
          this.collectPreviousQuery.splice(this.collectPreviousQuery.length,0,queryPrevText);          
          this.testConsoleResponseContent = JSON.stringify(rawJSONobj, null, 2);
        }
        this.collapseConsoleError = true;
      }
      getObj.map(x =>x.value = "");
      this.executingMethodName = funName;
    }
    copyToClipboardMethod(obj,tooltip){
      let copyText:any;
      if(obj.activetab === 1){
        copyText = obj.response;
      }else if(obj.activetab === 2){
        copyText = obj.consoleLogError;
      }else{
        copyText = obj.consoleInfoError;
      }
        tooltip.open(copyText);
        this.clipboard.copy(copyText);
        setTimeout(() => tooltip.close(), 1000);
    }
   async testConsoleAPICallMethod(){
    let scriptStr = this.jsScriptWrittenContent;
    let collectArryobj = this.extractAllFunctionDetails(scriptStr);
    this.functionNameNargumentsCollectData = collectArryobj;
   }
   showActiveTabResponseOutputNConsoleMethod(type,indx){
    // this.tabIndex = type+'_'+indx;
    if(type == 1){
      //this.showConsoleLogTab = false; 
      this.collectPreviousQuery[indx].activetab = 1;  
    }else if(type == 2){ 
      //this.showConsoleLogTab = true;
      this.collectPreviousQuery[indx].activetab = 2;
    }else{
      this.collectPreviousQuery[indx].activetab = 3;
    }
   }
   toggleConsoleAreaMethod(evt,currtObj){
    let eleEvt = evt.target;
    //this.outputCollapseIndex = hideId;
    if(eleEvt.className.includes('fa-chevron-down')){
      currtObj.open = false;
      this.collapseConsoleError = false;
    }else{
      currtObj.open = true;
      this.collapseConsoleError = true;
    }
   }
  async saveScriptNameMethod(){
    let getInputValObj = {};
    getInputValObj["jsKey"] = "-1";
    getInputValObj["scriptName"] = this.popupScriptName;
    getInputValObj["scriptDesc"] = this.popupScriptDesc;
    const pattern = /^[A-Za-z][A-Za-z0-9_]*$/.test(this.popupScriptName);
    if(this.popupScriptName.trim() === ''){
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('fusionJSComponent.nameDescCannotBeemptyLblErrorMsg'),'warning');
      return;
    }else if(this.popupScriptDesc.trim() === ''){
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('fusionJSComponent.descriptionCannotBeemptyLblErrorMsg'),'warning');
      return;
    }
    if(!pattern){
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('apiPersonalization.apiNameFiledValidationMsg1'),'warning');
      return;
    }

    // default format of Script.
    let defaultTemplateContent = `
    function `+this.popupScriptName+`_main (/** arg1,arg2 **/){
    var output = {
    };
    /**
     *
     * write your business logic here
     */
    return output;
    }`
    getInputValObj["script"] = encodeURIComponent(defaultTemplateContent);

    let endpoint = AppConstants.API_END_POINTS_OTHERS.CREATE_FUSION_JS_API;  
    const result = await this.httpService.post(endpoint,getInputValObj).toPromise();
    if (result.status == 'SUCCESS') {
      let resObj:any = result.response; 
      this.getListOfFusionJsMethod(resObj.jsKey,this.discardChangesEnabled,false);
      this.dataService.SwalSuccessMsg(this.translate.instant('fusionJSComponent.savedSuccessfullyLbl'));
      this.closeModel();
    }else{
      this.dataService.SwalAlertSuccesOrFailMgs(result.message,"warning");
    }
  }
  async getListOfFusionJsMethod(key,discardFlag,showPublishMsg){
    let endpoint = AppConstants.API_END_POINTS_OTHERS.GET_LIST_FUSION_JS_API;  
    const result = await this.httpService.post(endpoint).toPromise();
    if (result.status == 'SUCCESS') {
      let resObj = result.response; 
      this.getListOfFusionJsArryObj = resObj;
      this.filterListJsScript = resObj;
      if(key === 0){ // first entry
        this.editCallMethod(this.getListOfFusionJsArryObj[0].jsKey,discardFlag,showPublishMsg); 
      }else{ // selected entry
        let filterObj = this.getListOfFusionJsArryObj.find(x => x.jsKey == key);
        this.editCallMethod(filterObj.jsKey,discardFlag,showPublishMsg); 
      }          
      //console.log(resObj);     
    }else{
      this.dataService.SwalAlertMgs(result.message);
    }
  }
  async discardChangesToPublishScriptMethod(){
    this.confirmationTitle = this.translate.instant('fusionJSComponent.confrimDiscardChangesLbl');
    this.confirmationContentText = this.translate.instant('fusionJSComponent.discardChangesConfirmationMsgLbl');
    this.confirmationContentText = this.confirmationContentText.replace('#script_name#', '"'+this.scriptName+'"');
    
      this.confirmationPopupFlag = true;
      this.modalRef = this.modalService.show(this.confirmationErrorMsg, {
      class: 'modal-dialog-centered confrimErrorFusionJs',
      backdrop: 'static',
      keyboard: false,
    });
      this.returnValue = false;
  }
  openScriptPopup(modalContent: TemplateRef<any>){
    this.popupScriptName = "";
    this.popupScriptDesc = "";
    this.modalRef = this.modalService.show(modalContent, {
      class: 'modal-dialog-centered fusionJsAPIModel',
      backdrop: 'static',
      keyboard: false,
    });
  }
  openConsoleLogPopup(modalContent: TemplateRef<any>){
    this.popupScriptName = "";
    this.popupScriptDesc = "";
    this.modalRef = this.modalService.show(modalContent, {
      class: 'modal-dialog-centered pTagModel',
      backdrop: 'static',
      keyboard: false,
    });
  }
  openConfirmationPopup(modalContent: TemplateRef<any>,method,jsKey){
    this.jsKey = jsKey;
    if(method === "1"){ // edit method
      this.confirmationTitle = this.translate.instant('fusionJSComponent.confrimEditLbl');
      this.confirmationContentText = this.translate.instant('fusionJSComponent.areYouSureYouWanteditThePublishedScriptLbl');
      this.confirmationContentText = this.confirmationContentText.replace('#script_name#', '"'+this.scriptName+'"');
      this.isDeleteCallEnabled = false;
      this.jsFileStatus = '1';
    }else{ // delete method
      this.confirmationTitle = this.translate.instant('fusionJSComponent.confrimDeleteLbl');
      this.confirmationContentText = this.translate.instant('fusionJSComponent.deleteDraftOrPublishConfirmationMsgLbl');
      this.confirmationContentText = this.confirmationContentText.replace('#script_name#', '"'+this.scriptName+'"');
      this.isDeleteCallEnabled = true;
    }
    this.modalRef = this.modalService.show(modalContent, {
      class: 'modal-dialog-centered confrimErrorFusionJs',
      backdrop: 'static',
      keyboard: false,
    });
    this.returnValue = false;
  }
  
  closeModel(): void {
    if (this.modalRef !== undefined) {
      this.modalRef.hide();
    }
  }
  setEditorContent(editedScript) {
    // console.log(event, typeof event);
    let scriptObj = this.getListOfFusionJsArryObj.find(x => x.jsKey == this.jsKey);
    let publichScript = decodeURIComponent(scriptObj.publishedScript);
    let changeScript = editedScript;
    // if(scriptObj.status == "2"){
    //   if(publichScript !== undefined){
    //     if(publichScript != changeScript){
    //       this.discardChangesEnabled = true;
    //     }else{
    //       this.discardChangesEnabled = false;
    //     }
    //   }
    // }else{
    if(scriptObj.status == "3"){ // unpublished
      this.discardChangesEnabled = true;
    }else{
      this.discardChangesEnabled = false;
    }
    //}
    
  }
  async discardChangesMethod(){
    //this.getListOfFusionJsMethod(this.jsKey,this.discardChangesEnabled,false); 
    //setTimeout(() => {   
      let endpoint = AppConstants.API_END_POINTS_OTHERS.DISCARD_SCRIPT_FUSION_JS_API+this.jsKey;
      const result = await this.httpService.post(endpoint).toPromise();
      if (result.status == 'SUCCESS') {        
        this.getListOfFusionJsArryObj.find(x => x.jsKey == this.jsKey).draftScript = result.response.draftScript;
        let JsObj = this.getListOfFusionJsArryObj.find(x => x.jsKey == this.jsKey);
        this.jsScriptWrittenContent = decodeURIComponent(JsObj.publishedScript);
        if(JsObj.status == 3){ // unpublished
          this.discardChangesEnabled = true; // for unpublished enable discard button
        }else{
          this.discardChangesEnabled = false;  
        }
        this.showUnpublishedMsgEnabled = false;
      }      
    //}, 200);    
  }
   async finalSaveNPublicJsFilehMethod(type,publishToEditState){
    let mode:any;
    if(type === 1){ // 1 == save
      mode = type;
    }else{ // 2 == publish
      mode = type;
    }
    let createSaveObj = {};
    createSaveObj["jsKey"] = this.jsKey;
    createSaveObj["scriptName"] = this.scriptName;
    createSaveObj["scriptDesc"] = this.scriptDesc;
    createSaveObj["script"] = encodeURIComponent(this.jsScriptWrittenContent);
    createSaveObj["status"] = mode;

    // API Call for Save and publish starts
    let endpoint = AppConstants.API_END_POINTS_OTHERS.SAVE_N_PUBLISH_FUSION_JS_API;  
    const result = await this.httpService.post(endpoint,createSaveObj).toPromise();
    if (result.status == 'SUCCESS') {
      let resObj = result.response;    
      let flag:boolean = false;
      let saveCall:boolean = false;
      if(publishToEditState){
        let textReplace = this.translate.instant('fusionJSComponent.succesFullyEditLbl');
        let msgReplaced = textReplace.replace('#script_name#','"'+this.scriptName+'"');
        this.showUnpublishedMsgEnabled = false;
        this.discardChangesEnabled = true;
        this.dataService.SwalAlertSuccesOrFailMgs(msgReplaced,"success");        
        flag = false; // disabled buttons
        saveCall = false;
      }else{ // save button call
        this.dataService.SwalSuccessMsg(result.message);
        flag = true; // un-disabled buttons        
        if(this.jsFileStatus == '2'){ // 
          saveCall = true;
        }else{
          if(this.jsFileStatus == '3'){
            saveCall = true; // show unpublished message when edit published script saved.
          }else{
            saveCall = false;
          }          
        }
        if(this.jsFileStatus == '1'){
          flag = false;
        }
      }      
      this.getListOfFusionJsMethod(resObj.jsKey,flag,saveCall); 
    }else{
      this.showUnpublishedMsgEnabled = false;
      this.discardChangesEnabled = false;
      this.dataService.SwalAlertSuccesOrFailMgs(result.message,"warning");
    }
  }

  modifyJsCallMethod(key){
    // API Call for eidt js starts
    // let endpoint = AppConstants.API_END_POINTS_OTHERS.SAVE_N_PUBLISH_FUSION_JS_API;  
    // const result = await this.httpService.post(endpoint,createSaveObj).toPromise();
    // if (result.status == 'SUCCESS') {
    //   let resObj = result.response;           
    //   console.log(resObj);     
    // }else{
    //   this.dataService.SwalAlertMgs(result.message);
    // }
  }
  async deleteJsCallMethod(key){
    // API Call for delete js starts
    this.confirmationPopupFlag = false;
    let endpoint = AppConstants.API_END_POINTS_OTHERS.DELETE_FUSION_JS_API+key;  
    const result = await this.httpService.post(endpoint).toPromise();
    if (result.status == 'SUCCESS') {
      console.log(result);
      //this.getListOfFusionJsArryObj.splice()
      this.getListOfFusionJsMethod(0,this.discardChangesEnabled,false);  
      let textReplace = this.translate.instant('fusionJSComponent.successfullyDeletedMsgLbl');
      let msgReplaced = textReplace.replace('#script_name#','"'+this.scriptName+'"');
      this.dataService.SwalSuccessMsg(msgReplaced);
    }else{
      this.dataService.SwalAlertMgs(result.message);
    }
  }
}
