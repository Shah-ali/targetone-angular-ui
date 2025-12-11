import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppConstants } from '@app/app.constants';
import { HttpService } from '@app/core/services/http.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { ConvertJsonToGridViewComponent } from '../convert-json-to-grid-view/convert-json-to-grid-view.component';
import lodash from "lodash";
import { NgModel } from '@angular/forms';
import { DataService } from '@app/core/services/data.service';
@Component({
  selector: 'app-create-api-integration',
  templateUrl: './create-api-integration.component.html',
  styleUrls: ['./create-api-integration.component.scss']
})
export class CreateApiIntegrationComponent implements OnInit {
  @ViewChild('jsonToGridViewContent') convertJsonToGridComponent!: ConvertJsonToGridViewComponent;
  @ViewChild('nameFieldControl') nameFieldControl!: NgModel;
  @ViewChild('urlFieldControl') urlFieldControl!: NgModel;
  @ViewChild('descFieldControl') descFieldControl!: NgModel;  
  apiBasedUrl:any = "";
  multiArrayPath:boolean = false;
  apiName:any = "";
  URLParamsObj: any = {};  
  editModeSavedObj:any = {};
  editModeEnabled: boolean = false;
  apiKey: any;
  inputParams: any;
  outputFields: any;
  tableArrayObj: any = [];
  collectParams: any = [];
  APITestingUrl: any;
  previousParamsVal: any = {};
  getOutputFieldsArryVal: any=[];
  isEditMode: boolean = false;
  showLoader:boolean = false;
  previousCollectParams: any;
  restAPINJsAPIObj:any = [];
  singleMultiCheckEnable:any = [];
  singleOrMultiVal: any = 0;
  multiObjectOutputBaseUrl: any = "";
  multiObjectOutput: any;
  showFieldErrors: boolean = false;
  includeHeaders: boolean = false;
  keyValueArray: any = [{key: '', value: '', add: false}];
  includeHeadersCheckEnable:boolean = false;
  filterHeaderInfoObj: any = {};
  extraPramasLmitExceeded:boolean = false;
  successMgsEnabled: boolean = false;
  apiDescription: any = "";
  isRestApiEnable: boolean = true;
  scriptDropdownArryList: any = [];
  selectedScriptObj: any;
  collectParamsFusionJs: any = [];
  isAPIType: any = "1";
  selectedScriptVal: any = '-1';
  showScriptDropdown: boolean = false;
  filteredScriptOptions: any;
  selectedScriptName: any;
  isAssignedPriviledgeObj: any;
  tenentPriviledgeEditDisabled: any;
  constructor(public bsModalRef: BsModalRef,private shareService:SharedataService,private httpService:HttpService,private router: Router,private translate: TranslateService,private ngZone: NgZone, private dataService:DataService) {
    
    this.restAPINJsAPIObj = [{id:0,name:this.translate.instant('fusionJSComponent.restAPILbl'),saveVal:1,checked:true},{id:1,name:this.translate.instant('fusionJSComponent.fusionJSAPILbl'),saveVal:2,checked:false}];
    this.singleMultiCheckEnable = [{id:0,name:this.translate.instant('apiPersonalization.singleObjectLbl'),singleVal:0,checked:true},{id:1,name:this.translate.instant('apiPersonalization.multiObjectLbl'),singleVal:1,checked:false},];
    this.shareService.savedApiBasedIntegrationDataObj.subscribe((res:any) => {
      if(res !== undefined){
        if(res.isEditmode){ // edit mode
          this.editModeSavedObj = res;
          this.editModeEnabled = true;    
          this.checkAssignedPriviledgeMethod(res.assignedPriviledge);
        }else{ // create mode
          this.apiKey = -1;
          this.checkAssignedPriviledgeMethod(res.assignedPriviledge);
        }        
      }else{
        this.apiKey = -1;
      }
    });

    if(this.editModeEnabled){
      this.editMethodToRetreiveData(this.editModeSavedObj)
    }
      
  }

  ngOnInit(): void {
  }
  checkAssignedPriviledgeMethod(assignedPriviledgeFlag){
    this.isAssignedPriviledgeObj = assignedPriviledgeFlag; 
        if(this.isAssignedPriviledgeObj !== undefined){
          if(!this.isAssignedPriviledgeObj.apiintegration){
            this.tenentPriviledgeEditDisabled = !this.isAssignedPriviledgeObj.apiintegration; // when edit is false, disabled true
          // }else if((this.isAssignedPriviledgeObj.ptagview &&  !this.isAssignedPriviledgeObj.ptagedit)|| (!this.isAssignedPriviledgeObj.ptagview && !this.isAssignedPriviledgeObj.ptagedit)){
          //   this.tenentPriviledgeEditDisabled = true; // when view is true/ false, disabled true
          // }
          }else{
            this.tenentPriviledgeEditDisabled = !this.isAssignedPriviledgeObj.apiintegration; // when edit is true, disabled false
          }
        }     
  }
  switchBtRestNJsAPIMethod(evtVal){
    let inpVal = evtVal.target;
    let val;
    if(inpVal === undefined){
      val = evtVal;
    }else{
      val = inpVal.value;
    }
    //this.isAPIType = val;
    if(val == 1){ // REST API CALL        
      if(this.editModeEnabled && this.isAPIType == val){        
        this.isRestApiEnable = true;
          this.restAPINJsAPIObj[0].checked = true;
          this.restAPINJsAPIObj[1].checked = false;
      }else if(this.editModeEnabled && this.isAPIType != val){
        this.actionBeforeConfirmationMethod(this.translate.instant('fusionJSComponent.validationSelectionGetVanishedErrorLbl'),false,true);       
      }else{
        this.isRestApiEnable = true;
        this.isAPIType = val;
        this.restAPINJsAPIObj[0].checked = true;
        this.restAPINJsAPIObj[1].checked = false;
        this.resetToFreshMethod();
      }
    }else{ //2 JS API CALL
      if(this.editModeEnabled && this.isAPIType == val){              
          this.isRestApiEnable = false;
          this.restAPINJsAPIObj[0].checked = false;
          this.restAPINJsAPIObj[1].checked = true;
          this.getPublishScriptObjMethod(true);
      }else if(this.editModeEnabled && this.isAPIType != val){
        this.actionBeforeConfirmationMethod(this.translate.instant('fusionJSComponent.validationSelectionGetVanishedErrorLbl'),true,false); 
      }
      else{
        this.isRestApiEnable = false;
        this.isAPIType = val;
          this.restAPINJsAPIObj[0].checked = false;
          this.restAPINJsAPIObj[1].checked = true;
          this.getPublishScriptObjMethod(false);
          this.resetToFreshMethod();
      }
      
    }
     
  }
  enableCheckedRadioMethod(flag,offBtn){
    this.isRestApiEnable = offBtn;
          this.restAPINJsAPIObj[0].checked = offBtn;
          this.restAPINJsAPIObj[1].checked = flag;
          if(!offBtn){
            this.isAPIType = '2';
            this.getPublishScriptObjMethod(false);
          }else{
            this.isAPIType = '1';
          } 
  }
  actionBeforeConfirmationMethod(messageLbl,type,offBtn){
    let flag = false;
    Swal.fire({
      title: messageLbl,
      icon: 'warning',
      showCloseButton: false,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('designEditor.okBtn'),
      //confirmButtonColor: '#3366FF',
      cancelButtonText: this.translate.instant('designEditor.cancelBtn'),
      cancelButtonColor: '',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        cancelButton: 'buttonCssStyle',
        confirmButton: 'buttonCssStyle',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        flag = true;
        this.enableCheckedRadioMethod(type,offBtn);
        this.resetToFreshMethod();
      }else{
       
            //this.restAPINJsAPIObj.map(x => x.checked = null);
            if(offBtn){
              this.restAPINJsAPIObj[0].checked = true; // change true to false
                setTimeout(() => {
                  this.restAPINJsAPIObj[0].checked = flag;
                }, 0);
                
             }else{
              this.restAPINJsAPIObj[1].checked = true; // change true to false
              setTimeout(() => {
                this.restAPINJsAPIObj[1].checked = flag;
              }, 0);
             }
                   
      }
  });
 // return flag;
}
  resetToFreshMethod(){
    this.apiName = "";
    this.apiDescription = "";
    this.apiBasedUrl = "";
    this.APITestingUrl = undefined;
    this.clearKeyValueData();
    this.includeHeadersMethod(false);
    this.selectedScriptObj = undefined;
    this.selectedScriptVal = '-1';
    this.collectParams = [];
    this.selectedScriptName = undefined;
    this.collectParamsFusionJs = [];
   this.successMgsEnabled = false;
   //this.convertJsonToGridComponent.generatedSampleJson = undefined;
   if(this.editModeEnabled && this.isAPIType === '1'){
    if(this.editModeSavedObj.apiType == 2){
      this.editModeSavedObj.apiType = '1';
      this.editModeSavedObj.jsApiKey = '0';
      this.selectedScriptName = undefined;
      this.selectedScriptVal = '-1';
      this.collectParamsFusionJs = [];
    }
   }
   this.singleMultiCheckMethod(0,null); // reset to default
  }
  
  async getPublishScriptObjMethod(isEditCase?){
    let endpoint = AppConstants.API_END_POINTS_OTHERS.GET_PUBLISH_SCRIPT_FUSION_JS_API;  
    const result = await this.httpService.post(endpoint).toPromise();
    if (result.status == 'SUCCESS') {
      let resObj:any = result.response; 
      this.scriptDropdownArryList = resObj;
      this.filteredScriptOptions = resObj;
      if(isEditCase){
        this.singleMultiCheckMethod(this.editModeSavedObj.multiObjectOutput,JSON.parse(this.editModeSavedObj.headers));
      }
      
    }else{
      this.dataService.SwalAlertMgs(result.message);
    }
  }
  selectScriptMethod(evt,editStatus){
    let inpVal = evt.target;
    let val;
    if(inpVal === undefined){
      val = evt;
    }else{
      val = inpVal.value;
    }
    this.selectedScriptVal = val;
    if(editStatus){
      if(this.editModeEnabled){
        let filterScript = this.scriptDropdownArryList.find(x => x.jsKey == val);
        this.selectedScriptObj = this.editModeSavedObj;
        this.selectedScriptObj['jsKey'] = this.editModeSavedObj.jsApiKey;
        if(filterScript !== undefined){
          this.selectedScriptName = filterScript.scriptName;
        }        
        let objX = JSON.parse(this.editModeSavedObj.inputParams);
        let objParnms:any = []
        Object.keys(objX).map(x => {
          objParnms.push({key:x,value:this.URLParamsObj[x]});
        });
        this.collectParamsFusionJs = objParnms;
      }
    }else{
      let filterScript = this.scriptDropdownArryList.find(x => x.jsKey == val);
      this.selectedScriptObj = filterScript;
      if(this.selectedScriptObj !== undefined){
        this.selectedScriptName = this.selectedScriptObj.scriptName;
        let parmasObj = this.selectedScriptObj.inputParams.split(",");
          if(parmasObj.length > 0){
            let arrobj = parmasObj.map(item => ({ key: item ,value:""}));      
            if(arrobj.length > 0){
            let filterx = arrobj.map(x => x.value == "").join(',');
            if(filterx.includes('true')){
              this.collectParamsFusionJs = arrobj;
            }
          }else{
            this.collectParamsFusionJs = arrobj;
          }
          
        }   
        }
                                    
    }
    this.showScriptDropdown = false;
  }
  validateJSAPiArgumentsMethod(arrayObj){
    let flag = false;
    if(arrayObj.length > 0){
      arrayObj.map(x => {      
        if(x.value === "" || x.value === undefined){
          flag = true;
        }else{
          flag = false;
        }      
      });
    }    
    return flag;
  }
  async executeJsScriptMethod(){
    this.showLoader = true;
    let endpoint = AppConstants.API_END_POINTS_OTHERS.GET_EXECUTE_FUSION_JS_SCRIPT_API;  
    let paramsCollect:any = this.collectParamsFusionJs.map(x => x.value);
    //let flag = this.validateJSAPiArgumentsMethod(this.collectParamsFusionJs);    
    if(this.selectedScriptObj === undefined){
      this.showLoader = false;
      this.dataService.SwalAlertMgs(this.translate.instant('fusionJSComponent.plaseSelectScriptJsToExecuteErrorMsgLbl'));
      return;
    }
    // else if(flag){
    //   this.showLoader = false;
    //   this.dataService.SwalAlertMgs(this.translate.instant('fusionJSComponent.inputParamametersCannotBeEmptyLbl'));
    //   return;
    // }
    
    let payload = {
      "scriptName":this.selectedScriptName,
      "inputParams":paramsCollect.join(',')
    }
    const result = await this.httpService.post(endpoint,payload).toPromise();
    if (result.status == 'SUCCESS') {
      let resObj:any = JSON.parse(result.response); 
      this.showLoader = false;
      this.convertJsonToGridComponent.fusionJSGenerateSampleJSONForMethod(resObj,paramsCollect);
    }else{
      this.showLoader = false;
      this.dataService.SwalAlertMgs(result.response);
    }
  }
  includeHeadersMethod(evt){
    let checkInpt;
    if(evt.target !== undefined){
      checkInpt = evt.target.checked;
    }else{
      checkInpt = evt;
    }
    this.filterHeaderInfoObj = {};
    if(checkInpt){
      this.includeHeadersCheckEnable = true;
    }else{
      this.includeHeadersCheckEnable = false;
    }
  }
  singleMultiCheckMethod(evtVal,keyvalobj){
    let inpVal = evtVal.target;
    let val;
    if(inpVal === undefined){
      val = evtVal;
    }else{
      val = inpVal.value;
    }
    if(val == 0){ // single object
      this.singleMultiCheckEnable[0].checked = true;
      this.singleMultiCheckEnable[1].checked = false; 
      this.multiArrayPath = false;
      this.singleOrMultiVal = 0;
      this.convertJsonToGridComponent.rowDataArry = [];
      this.convertJsonToGridComponent.usedArrayPathSelected = ''; 
      this.convertJsonToGridComponent.useThisArraySelectedName = "";
      this.convertJsonToGridComponent.parentPathofMainObjectSelected = [];  
      this.convertJsonToGridComponent.pathofExpandedItemJson = [];
      this.convertJsonToGridComponent.usedArraySelected = false;
      this.convertJsonToGridComponent.clearGeneratedJSONDataMethod();

    }else{ // multi object
      this.singleMultiCheckEnable[1].checked = true;
      this.singleMultiCheckEnable[0].checked = false;
      this.multiArrayPath = true;
      this.singleOrMultiVal = 1;
      this.convertJsonToGridComponent.rowDataArry = [];
      this.convertJsonToGridComponent.usedArrayPathSelected = ''; 
      this.convertJsonToGridComponent.useThisArraySelectedName = "";
      this.convertJsonToGridComponent.parentPathofMainObjectSelected = [];
      this.convertJsonToGridComponent.pathofExpandedItemJson = [];  
      this.convertJsonToGridComponent.usedArraySelected = false;
      this.convertJsonToGridComponent.clearGeneratedJSONDataMethod();
      //this.generateSmapleJSonMethod(this.APITestingUrl,keyvalobj);     
    }
    this.convertJsonToGridComponent.showfieldsSectionMethod();
    if(this.isRestApiEnable){
      if(this.editModeEnabled){    
        if(this.APITestingUrl !== undefined){
          this.generateSmapleJSonMethod(this.APITestingUrl,keyvalobj); 
        }else{
          this.convertJsonToGridComponent.clearGeneratedJSONDataMethod();
        }         
      }else{
        if(this.APITestingUrl !== undefined){
          this.generateSmapleJSonMethod(this.APITestingUrl,keyvalobj); 
        }else{
          this.convertJsonToGridComponent.clearGeneratedJSONDataMethod();
        } 
        //this.generateSmapleJSonMethod(this.APITestingUrl,keyvalobj);  
      }
    }else{
      
      if(this.editModeEnabled){
        if(this.editModeSavedObj.jsApiKey !== '0'){
          setTimeout(() => {            
            this.selectScriptMethod(this.editModeSavedObj.jsApiKey,true);              
              this.executeJsScriptMethod();
              if(this.isEditMode && this.editModeSavedObj.multiObjectOutput == this.singleOrMultiVal){
                this.convertJsonToGridComponent.rowDataArry = this.tableArrayObj; 
                this.convertJsonToGridComponent.isEditMode = this.isEditMode; 
                this.convertJsonToGridComponent.usedArraySelected = this.isEditMode; 
                this.convertJsonToGridComponent.usedArrayPathSelected = this.editModeSavedObj.multiObjectOutputBaseUrl;
              }              
              }, 1000);
        }else if(this.selectedScriptObj !== undefined){
            //this.selectScriptMethod(this.selectedScriptObj.jsKey,false);
            this.executeJsScriptMethod();
            // let parmasObj = this.selectedScriptObj.inputParams.split(",");
            // if(parmasObj.length > 0){
            //   let arrobj = parmasObj.map(item => ({ key: item ,value:""}));
            //   this.collectParamsFusionJs = arrobj;
            // }              
        }else{
          this.selectScriptMethod('-1',false);
          this.convertJsonToGridComponent.clearGeneratedJSONDataMethod();
        }    
      }else{
        // load freshly
      }
          
       
    }
    
  }
  getKeyValueArray(savedObj){
    if(savedObj !== undefined){
      let objKV = JSON.parse(savedObj);
      let keyVobj:any = [];
      if(!lodash.isEmpty(objKV)){
        lodash.mapKeys(objKV, function(value, key) {
          keyVobj.push({'key':key,'value':value,add:false});
        });
        this.keyValueArray = keyVobj;
      }
      
    }
  }
  editMethodToRetreiveData(savedObj){
    this.apiKey = savedObj.apiKey;
    this.apiName = savedObj.apiName;
    this.apiBasedUrl = savedObj.requestUrl;
    this.apiDescription = savedObj.apiDescription;
    this.isAPIType = savedObj.apiType;
    //this.URLParamsObj = JSON.parse(savedObj.inputParams);
    this.outputFields = JSON.parse(savedObj.outputFields);
    this.multiObjectOutputBaseUrl = savedObj.multiObjectOutputBaseUrl || "";
    this.multiObjectOutput = savedObj.multiObjectOutput;    
    this.includeHeadersCheckEnable = savedObj.includeHeaders;
    if(savedObj.includeHeaders == 1) {
      this.includeHeadersCheckEnable = true;
    }else{
      this.includeHeadersCheckEnable = false;
    }
    if(savedObj.apiType == 1){
      this.URLParamsObj = JSON.parse(savedObj.inputParams);
      this.getKeyValueArray(savedObj.headers);
    }else{
      this.URLParamsObj = JSON.parse(savedObj.inputParams);
    }
    
    //this.getOutputFieldsArryVal = this.outputFields.outputFields;
    this.isEditMode = true;
    if(this.outputFields.outputFields.length > 0){      
      this.outputFields.outputFields.forEach((ele,i) => {        
        let obj = {
        id:i+1,
        selectedName:ele.fieldName,
        path:ele.fieldPath,
        fieldId:ele.fieldId,
        type:ele.fieldType,
        fromPath:ele.fromPath,
        fieldVal : ele.fieldVal,
        fieldIndexParent:ele.fieldIndexParent,
        fieldKey:ele.fieldKey,
        fieldPathModified:ele.fieldPathModified,
        deleteRow:true
        }
        if(ele.fieldId === undefined){
          obj.fieldId = ele.fieldName;
        }
        if(ele.fieldPathModified === undefined){
          obj.fieldPathModified = ele.fieldPath;
        }
        this.tableArrayObj.push(obj);
      });   
    }
    setTimeout(() => {
      if(savedObj.apiType == 1 || savedObj.apiType == 0){
        this.generateParams();
        //Object.keys(this.URLParamsObj).forEach((key,i) => {
        if(Object.values(this.URLParamsObj)[0] !== undefined){
          this.getParamsValues(Object.values(this.URLParamsObj)[0],Object.keys(this.URLParamsObj)[0],0);
        }        
       // });
        this.singleMultiCheckMethod(this.multiObjectOutput,JSON.parse(savedObj.headers));
      }else{
        this.switchBtRestNJsAPIMethod(2);
      }      
      //this.generateSmapleJSonMethod(this.APITestingUrl,JSON.parse(savedObj.headers));
      this.convertJsonToGridComponent.isEditMode = this.isEditMode;      
      this.convertJsonToGridComponent.usedArrayPathSelected = this.multiObjectOutputBaseUrl || "";
      this.convertJsonToGridComponent.usedArraySelected = this.isEditMode;    
      this.convertJsonToGridComponent.rowDataArry = this.tableArrayObj; 
    }, 500);
  
  }
  convertArrayToObject(array){
    let finalObj = {};
    // loop elements of the array 
    for(let i = 0; i < array.length; i++ ) {
      Object.assign(finalObj, array[i]);
    }
    return finalObj;
  }
  getDuplicateItemMethod(arry:any,findName){
    var arryFill:any = [],counter = {};
    lodash.map(arry, function(obj, i) {      
      arryFill.push(obj[findName]);    
    });
    const duplicatesArry = arryFill.filter(n => (counter[n] = counter[n] + 1 || 1) === 2)
    return duplicatesArry;
  }
  checkValidationForInputParamsMethod(){
    let errorflag = false;
    if(this.collectParams !== undefined){
      if(this.collectParams.length > 0){
        lodash.map(this.collectParams, function(obj,i){
          lodash.mapKeys(obj, function(value, key){
            if(value == ""){
              errorflag = true;
            }
          });          
        });
      }
    }
    return errorflag;
  }
 async saveAPIIntegration() {
    if(this.nameFieldControl.invalid && this.apiName == "") {
      this.showFieldErrors = true;
      this.nameFieldControl.control.markAsTouched();
      return;
    }
    if(this.descFieldControl.invalid && (this.apiDescription == "" || this.apiDescription === null)) {
      this.showFieldErrors = true;
      this.descFieldControl.control.markAsTouched();
      return;
    }
    if(this.isAPIType == 1){
      if(this.urlFieldControl.invalid && this.apiBasedUrl == "") {
        this.showFieldErrors = true;
        this.urlFieldControl.control.markAsTouched();
        return;
      }
  
      /* if(this.apiName == ""){
        Swal.fire({
          title: this.translate.instant('apiPersonalization.APInameCannotbeEmptyLbl'),
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        });
        return;
      }
      if(this.apiBasedUrl == ""){
        Swal.fire({
          title: this.translate.instant('apiPersonalization.thridPartyUrlCannotbeEmptyLbl'),
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        });
        return;
      } */
      let errorflag = this.checkValidationForInputParamsMethod();
      if(errorflag){
        //this.showloader.emit({'showloaderEnabled':false,'successEnabled':false});
          Swal.fire({
            title: this.translate.instant("apiPersonalization.pleaseDefineTheAPInputParametersToContinueLbl"),
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: this.translate.instant('designEditor.okBtn'),
          });
          return;
      }
    }else{
      // let flag = this.validateJSAPiArgumentsMethod(this.collectParamsFusionJs);
      // if(flag){
      //   this.dataService.SwalAlertMgs(this.translate.instant('fusionJSComponent.inputParamametersCannotBeEmptyLbl'));
      //   return;
      // }else 
      if(this.selectedScriptVal == '-1'){
        this.dataService.SwalAlertMgs(this.translate.instant('fusionJSComponent.pleaseSelectScriptToContinueLbl'));
        return;
      }
    }
    if(this.convertJsonToGridComponent !== undefined){
      if(this.convertJsonToGridComponent.rowDataArry.length == 0){
        Swal.fire({
          title: this.translate.instant('apiPersonalization.pleaseSelectOneParameterToContinueValidationLbl'),
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        });
        return;
      }
      if(this.convertJsonToGridComponent.generatedSampleJson === undefined){
        Swal.fire({
          title: this.translate.instant('apiPersonalization.sampleJsonNotGeneratedErrorLbl'),
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        });
        return;
      }

      //if(!this.isEditMode){
        this.getOutputFieldsArryVal = this.convertJsonToGridComponent.collectDataApiListMethod();
     // }      
     let filterDuplicateArry = this.getDuplicateItemMethod(this.getOutputFieldsArryVal,"fieldName");
     let filterDuplicatePathArry = this.getDuplicateItemMethod(this.getOutputFieldsArryVal,"fieldPath");
      let filterIfFieldNameIsEmpty = lodash.filter(this.getOutputFieldsArryVal,{"fieldName":""});
      if(filterIfFieldNameIsEmpty.length > 0){
        Swal.fire({
          title: this.translate.instant('apiPersonalization.fieldNameCannotBeEmptyValidationLbl'),
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        });
        return;
      }
     if(filterDuplicateArry.length > 0){ // Attribute name duplication validation
      Swal.fire({
        title: this.translate.instant('apiPersonalization.duplicateNameExistValidationLbl'),
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      });
      return;
     }
     if(filterDuplicatePathArry.length > 0){ // Attribute Path duplication validation
      Swal.fire({
        title: this.translate.instant('apiPersonalization.attributePathAlreadyExistErrorLbl'),
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      });
      return;
     }
     if(this.includeHeadersCheckEnable && this.isAPIType == 1){
      this.filterHeaderInfoObj = this.getKeyValueObjToSaveMethod(this.keyValueArray);
      let checkIfEmptyKeyValueObj = this.filterKeyValueObjMethod(this.keyValueArray);
      if(checkIfEmptyKeyValueObj){
        Swal.fire({
          title: this.translate.instant('apiPersonalization.pleaseEnterAtLeastoneNameNvalueToContinueLbl'),
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        });
        return;
      }
     }
     
      let outputFieldsObj = {outputFields:this.getOutputFieldsArryVal};
      let inputParams:any;
      if(this.isAPIType == 1){
        inputParams = this.convertArrayToObject(this.collectParams);
      }else{
        let objParams = {};
        this.collectParamsFusionJs.map(x => {
          objParams[x.key] = x.value;
        })
        inputParams = objParams;
        this.apiBasedUrl = "";
        this.filterHeaderInfoObj = {};
      }
    let saveObj:any = {
      "apiKey": this.apiKey,
      "apiName": this.apiName,
      "inputParams": JSON.stringify(inputParams),
      "requestUrl": this.apiBasedUrl,
      "apiDescription":this.apiDescription,
      "outputFields": outputFieldsObj,
      "multiObjectOutputBaseUrl":this.convertJsonToGridComponent.usedArrayPathSelected,
      "multiObjectOutput": this.singleOrMultiVal,
      "includeHeaders":this.includeHeadersCheckEnable,
      "headers":JSON.stringify(this.filterHeaderInfoObj),
      "apiType":this.isAPIType // 1 rest api , 2 js api      
      }
      if(this.selectedScriptObj !== undefined && this.isAPIType == 2){
        saveObj['jsApiKey'] = this.selectedScriptObj.jsKey;
      }else{
        saveObj['jsApiKey'] = '0';
      }
      if(lodash.isEmpty(this.filterHeaderInfoObj)){
        delete saveObj.headers;
      }
    let endpoint = AppConstants.API_END_POINTS.GET_API_BASED_SAVE_INTEGRATION;
    // this.httpService.post(endpoint,saveObj).subscribe(res => {
    //   if (res.status == 'SUCCESS') {
    //       console.log(res.response);      
    //     }
    // });
    const result = await this.httpService.post(endpoint,saveObj).toPromise();
    if (result.status == 'SUCCESS') {
      Swal.fire({
        title: result.message,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      });
      
      this.onClose();
      //this.ngZone.run(() => {
        this.router.navigateByUrl('/',{skipLocationChange:true}).then(() =>{
          this.router.navigate(['/show-api-integration']); 
        });
        
     // });      
      //console.log(result.response);      
    }else{
      Swal.fire({
        title: result.message,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      });
    }
  }
   
 }
 filterKeyValueObjMethod(kvObj){
  let flag = false;
  for(let i=0; i<kvObj.length; i++){
    if(kvObj[i].key.trim() == ""){
      flag = true;
      break;
    }else if(kvObj[i].value.trim() == ""){
      flag = true;
      break;
    }else{
      flag = false;
      //break;
    }
  }  
  return flag;
 }
 // Key Value Pair
 addNewKeyValue(): void {
  if(this.keyValueArray.length >= AppConstants.MOBILE_PUSH_RANGE.MIN && this.keyValueArray.length <= AppConstants.MOBILE_PUSH_RANGE.MAX) {
   // item.add = false;
    if(this.keyValueArray.length === 5) {
      this.extraPramasLmitExceeded == true;
    } else {
      this.keyValueArray.push({key: '', value: '', add: false});
      this.extraPramasLmitExceeded == false;
    }
  }
}
removeKeyValue(item:any): void {
  if(this.keyValueArray.length <= AppConstants.MOBILE_PUSH_RANGE.MAX) {
    let index = this.keyValueArray.indexOf(item);
    this.keyValueArray.splice(index, 1);
    this.keyValueArray[this.keyValueArray.length - 1].add = false;
  }
  // if(item.key !== '' || item.value !== '') {
  //   Swal.fire({
  //     title: this.translate.instant('designEditor.mobilePushComponent.dataValidation'),
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: this.translate.instant('yes'),
  //     cancelButtonText: this.translate.instant('cancel')
  //   }).then((result) => {
  //     if (result.value) {
  //       if(this.keyValueArray.length <= AppConstants.MOBILE_PUSH_RANGE.MAX) {
  //         let index = this.keyValueArray.indexOf(item);
  //         this.keyValueArray.splice(index, 1);
  //         this.keyValueArray[this.keyValueArray.length - 1].add = true;
  //       }
  //     }
  //   });
  // } else {
  //   if(this.keyValueArray.length <= AppConstants.MOBILE_PUSH_RANGE.MAX) {
  //     let index = this.keyValueArray.indexOf(item);
  //     this.keyValueArray.splice(index, 1);
  //     this.keyValueArray[this.keyValueArray.length - 1].add = true;
  //   }
  // }
}
clearKeyValueData(){
  this.keyValueArray.filter(x => x.key = "");
  this.keyValueArray.filter(x => x.value = "");
}
 generateParams(){
  this.collectParams = [];
  this.apiBasedUrl = this.apiBasedUrl.replaceAll('|','%7C');
  this.APITestingUrl = this.apiBasedUrl;  
  let findBrackets = this.apiBasedUrl.split("?")[1].split("&");
  //var searchParams = splitUrl[1];
  //if(findBrackets.lenght > 0){
    let obj = {};
    findBrackets.sort().map(item => {
      let eachItem = item.split("=");
      let key = eachItem[0];
      //obj[key] = eachItem[1] || "";
      if(eachItem[1] !== undefined){
        let startInx = eachItem[1].trim().indexOf('{');
        let endInx = eachItem[1].trim().lastIndexOf('}');
        if(startInx !== -1 && endInx !== -1){
          let nameWithoutBrackets:any = eachItem[1].trim().substring(startInx+1,endInx);
          nameWithoutBrackets = nameWithoutBrackets.trim();        
          obj[nameWithoutBrackets] = this.URLParamsObj[nameWithoutBrackets] || "";  
        }       
      }
     
    });
    //console.log(findBrackets);
    // findBrackets.forEach((ele,i) => {
    //   if(ele.startsWith('{') && ele.endsWith('}')){
    //     let nameWithoutBrackets:any = ele.replaceAll('{','').replaceAll('}','');        
    //     //obj[nameWithoutBrackets] = "";
        

    //   }else{

    //   }
    // });
    // how to avoid alphabetical sorting of key value pair in object
    //let ordered: any = {};
    //Object.keys(obj).sort().forEach(function(key) {
      //ordered[key] = obj[key];
    //});
    //obj = ordered;

    this.collectParams.push(obj);
    this.URLParamsObj =  obj;          
    //this.previousParamsVal = obj;
    //this.collectParams = {...this.collectParams};
    // let paramsObj = JSON.parse('{"' + searchParams.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:"" });
    // this.URLParamsObj = paramsObj;
  //}  
  //console.log(paramsObj);
  if(Object.values(this.URLParamsObj)[0] !== undefined){
    this.getParamsValues(Object.values(this.URLParamsObj)[0],Object.keys(this.URLParamsObj)[0],0);
  }  
 } 
 getParamsValues(evt?,key?,inx?){
  let strVal;
  if(evt.target === undefined){
    strVal = evt;
  }else{
    strVal = evt.target.value;
  }
  
  this.collectParams[0][key] = strVal; 
  this.apiBasedUrl = this.apiBasedUrl.replaceAll('|','%7C');
  this.APITestingUrl = this.apiBasedUrl; 
  if(this.collectParams.length > 0){
    this.collectParams.forEach((item,i) => {
      Object.keys(item).forEach((key,j) => {
        //if(item[key] != ""){
          let escapeValue = escape(item[key].replaceAll('%7C','|'))
          key = key.trim();
          if(key !== '' || key !== undefined){
            this.APITestingUrl = this.APITestingUrl.replace("{"+key+"}",escapeValue);
          }        
          this.previousParamsVal[key] = escapeValue;
        //}
          // if(Object.keys(this.previousParamsVal).length == 0){
          //   if(item[key] != ""){
          //     let escapeValue = escape(item[key]);
          //     this.APITestingUrl = this.APITestingUrl.replace("{"+key+"}",escapeValue);
          //     this.previousParamsVal[key] = escapeValue; 
          //   }            
          // }else{
          //   if(this.previousParamsVal[key] !== undefined){
          //     let escapeValue = escape(item[key]);
          //     if(this.previousParamsVal[key] != escapeValue){
          //       if(item[key] != ""){
          //         this.APITestingUrl = this.APITestingUrl.replace(this.previousParamsVal[key],escapeValue);
          //       this.previousParamsVal[key] = escapeValue; 
          //       }                
          //     }
          //   }else{
          //     if(item[key] != ""){
          //       let escapeValue =escape(item[key]);
          //       this.APITestingUrl = this.APITestingUrl.replace("{"+key+"}",escapeValue);
          //       this.previousParamsVal[key] = escapeValue;
          //     }
              
          //   }           
          // }
          
      });      
    });  
  }  
 }


 async generateSmapleJSonMethod(url,keyvalueArry){
  if(this.convertJsonToGridComponent !== undefined){
    if(url !== undefined){
      this.showLoader = true;
      this.filterHeaderInfoObj = {};
      this.convertJsonToGridComponent.collectParams = this.collectParams;
      this.filterHeaderInfoObj = this.getKeyValueObjToSaveMethod(keyvalueArry);
      if(this.includeHeadersCheckEnable){
        let checkIfEmptyKeyValueObj = this.filterKeyValueObjMethod(this.keyValueArray);
        if(checkIfEmptyKeyValueObj){
          this.showLoader = false;
          Swal.fire({
            title: this.translate.instant('apiPersonalization.pleaseEnterAtLeastoneNameNvalueToContinueLbl'),
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: this.translate.instant('designEditor.okBtn'),
          });
          return;
        }
       }else{
        this.filterHeaderInfoObj = {};
       }
      this.convertJsonToGridComponent.keyValuePairSavedObj = this.filterHeaderInfoObj;
      this.convertJsonToGridComponent.generateSmapleJSonMethod(url,this.filterHeaderInfoObj);      
    }else{
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('apiPersonalization.thridPartyUrlCannotbeEmptyLbl'),'warning');
      return;
    }
  }
 }
 getKeyValueObjToSaveMethod(keyValueArry){
  if(this.editModeEnabled){ // edit mode
    if(this.includeHeadersCheckEnable){
      if(keyValueArry === null){
        this.filterHeaderInfoObj = {};
      }else{
        if(Array.isArray(keyValueArry)){
          if(keyValueArry !== undefined){
            if(keyValueArry.length > 0 ){        
              keyValueArry.forEach(itemObj => {
                delete itemObj.add;
                if(itemObj.key.trim() != "" || itemObj.value.trim() != ""){
                  this.filterHeaderInfoObj[itemObj.key.trim()] = itemObj.value.trim();
                }
                
              });
            }
          }  
        }else{
          this.filterHeaderInfoObj = keyValueArry;
        }
        
      } 
    }else{
      this.filterHeaderInfoObj = {};
    }
  }else{ // create mode
    if(this.includeHeadersCheckEnable){
      if(keyValueArry !== undefined){
        if(keyValueArry.length > 0 ){        
          keyValueArry.forEach(itemObj => {
            delete itemObj.add;
            if(itemObj.key.trim() != "" || itemObj.value.trim() != ""){
              this.filterHeaderInfoObj[itemObj.key.trim()] = itemObj.value.trim();
            }
          });
        }
      }   
    }else{
      this.filterHeaderInfoObj = {};
    }
      
  }
  return this.filterHeaderInfoObj;
 }
 showloaderMethod(enbaledObj){  
  this.showLoader = enbaledObj.showloaderEnabled;
  this.successMgsEnabled = enbaledObj.successEnabled;
  // setTimeout(() => {
  //   this.successMgsEnabled = false;
  // }, 2000);

 }
  onClose(): void {
    if(this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }
  openScriptDropdown() {
    this.showScriptDropdown = !this.showScriptDropdown;
  }

  searchScriptJsMethod(event: any) {
    const searchText = event.target.value;
    this.filteredScriptOptions = this.scriptDropdownArryList.filter((option) =>
      option.scriptName.toLowerCase().includes(searchText.toLowerCase())
    );
    this.showScriptDropdown = this.filteredScriptOptions.length > 0;
  }

  selectScriptOptionMethod(jsKey: string) {
    //this.onChangeExtValue(option, '');
    this.selectedScriptVal = jsKey;    
    this.showScriptDropdown = false;
  }
}
