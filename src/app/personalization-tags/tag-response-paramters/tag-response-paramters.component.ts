import { Component, OnInit,EventEmitter,Output,ViewChild,ElementRef} from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { DataService } from '@app/core/services/data.service';
import { HttpService } from '@app/core/services/http.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { GlobalConstants } from '@app/design-channels/common/globalConstants';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
HttpService

@Component({
  selector: 'app-tag-response-paramters',
  templateUrl: './tag-response-paramters.component.html',
  styleUrls: ['./tag-response-paramters.component.scss']
})
export class TagResponseParamtersComponent implements OnInit {
  @ViewChild('tagParametersDropdown') tagParametersDropdownElement!: ElementRef;  
  
  delimitersObj:any = {};
  parameterType = ["string","numeric","multiValue","dotLine","Customer.Mobile.No","Customer.EmailID","Customer.externalCustomerCode"];
  keyValueArray: any = [{id:1,key: '', value:"",options: this.parameterType, add: false,splitBy:"",isMultiValEnbale:false}];
  addAnotherDisable:boolean = false;
  selctedTypeParameter: any;
  tagKey:any;
  tagKeyParamsArry:any = [];
  editModeSavedObj: any = [];
  isTagParamsEditMode: boolean = false;
  multiValueStringEnable: boolean = false;
  selectedDelimiters: any;
  multiValStringRowId: any;
  licenseType: any;
  activeEditObjFromBeeEditor: any;
  disabledDoneBtnTagParams: boolean = false;
  pTagEditorType: any = 1;
  isSavedAsQA: boolean = false;
  
  constructor(private httpService: HttpService,private translate: TranslateService, public bsModalRef: BsModalRef,private shareService: SharedataService,private dataService:DataService) { 
    this.getTagKeyMethod();  
    // setTimeout(() => {
    //   this.onEditGetParameters();
    // }, 500);  
    this.shareService.onSavedTypePersonalization.subscribe((res) => {
      if(res == 'QA'){
        this.isSavedAsQA = true; 
      }
    });
  }
  async getPtagSplitChars(){
    let endpoint = AppConstants.API_END_POINTS.GET_PTAG_SPLITCHAR_API;
    const result = await this.httpService.get(endpoint).toPromise();
    if (result.body.status == 'SUCCESS') {
      let delimsObj = result.body.response;
      this.delimitersObj = delimsObj;
      //console.log(this.delimitersObj);
    }
  }
  ngOnInit(): void {
    
  }
  async loadLicencingTypeMethod() {
    let endpoint = AppConstants.API_END_POINTS.GET_LICENCE_TYPE_API;
    const result = await this.httpService.post(endpoint).toPromise();
    if (result.status == 'SUCCESS') {  
      this.licenseType = result.response.licenseType;
      if(this.licenseType === 'PTAG Only Pack'){
        this.parameterType = ["string","numeric","multiValue"];
      }else{
        this.parameterType = ["string","numeric","multiValue","dotLine","Customer.Mobile.No","Customer.EmailID","Customer.externalCustomerCode"];
      }      
      this.saveOrGetTagParametersMethod();
    }
  }
  getTagKeyMethod(){
    this.tagKey = this.dataService.activeContentTagKey;//localStorage.getItem("tagKeyPersonalization");    
    this.loadLicencingTypeMethod();    
  }
  onClose(): void {
    if(this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }  
  // Key Value Pair
  addNewKeyValue() {
    const currentLength = this.keyValueArray.length;
    const minKeys = AppConstants.TAG_PARAMETER_FIELDS.MIN;
    const maxKeys = AppConstants.TAG_PARAMETER_FIELDS.MAX;

    if (currentLength >= minKeys && currentLength < maxKeys) {
      this.keyValueArray.push({id:this.keyValueArray.length+1,key: '', value:"", options:this.parameterType, add: false,splitBy:"",isMultiValEnbale:false});
    }
    this.addAnotherDisable = currentLength + 1 >= maxKeys;
  }
  addSavedParameters(savedObj)
  {
    this.keyValueArray = [];
    let tagParamsDropdownElemt = this.tagParametersDropdownElement.nativeElement;
    if(savedObj.params.length > 0){
      savedObj.params.forEach((element,i)=> {
        if(savedObj.params.length <= AppConstants.TAG_PARAMETER_FIELDS.MAX){ 
          let index,selectType,multiValEnable;       
          // if(element.type !== ""){
          //   index = this.parameterType.findIndex(x => x == element.type);
          //   selectType = this.parameterType[index];
          //   this.keyValueArray.push({id:i+1,key: element.name, value: selectType,options:this.parameterType, add: false});
          //   tagParamsDropdownElemt.getElementByClass('index_'+i+1)[0].value = selectType;
          //   this.addAnotherDisable = false;
          // }else{
          //   // if(element.relationType !== ""){
          //   //   index = this.parameterType.findIndex(x => x == element.relationType);
          //   //   selectType = this.parameterType[index];
          //   //   this.keyValueArray.push({id:i+1,key: element.name, value: selectType,options:this.parameterType, add: false});
          //   //   this.addAnotherDisable = false;
          //   // }else{
              if(element.splitBy !== "" && element.splitBy !== undefined){
                multiValEnable = true;
              }else{
                multiValEnable = false;
              }
              index = this.parameterType.findIndex(x => x == element.type);
              selectType = this.parameterType[index];
              this.keyValueArray.push({id:i+1,key: element.name, value: selectType,options:this.parameterType, add: false,splitBy:element.splitBy,isMultiValEnbale:multiValEnable});              
              this.addAnotherDisable = false;              
            //}          
          //}      
          
        }
      });
      setTimeout(() => {
        this.keyValueArray.forEach((ele:any,i) => {
          tagParamsDropdownElemt.getElementsByClassName('typeSelectList')[i].value = ele.value;
          if(ele.isMultiValEnbale){
            tagParamsDropdownElemt.getElementsByClassName('delimSelectList_'+ele.id)[0].value = ele.splitBy;
          }
        });        
      }, 300);
      this.shareService.tagParametersObjArry.next(this.keyValueArray);
    }        
  }
  setTypeOfParameter(evt,idx){
    this.selctedTypeParameter = evt.target.value;
    let rowId = evt.target.id;
    let currtObjarry = this.keyValueArray.find(x => x.id == idx);
    if(this.selctedTypeParameter === 'multiValue'){
      this.multiValueStringEnable = true;     
      currtObjarry.splitBy = this.delimitersObj.Comma; // frist obj value as default
    }else{
      this.multiValueStringEnable = false;
      currtObjarry.splitBy =""; 
    }
    //this.multiValStringRowId = rowId;
    if(currtObjarry !== undefined){
      currtObjarry.value = this.selctedTypeParameter;
      currtObjarry.isMultiValEnbale = this.multiValueStringEnable;     
    }     
  }
  onChangeMultiValueString(evt,id){
    this.selectedDelimiters = evt.target.value;
    let currtObjarry = this.keyValueArray.find(x => x.id == id);
    if(currtObjarry !== undefined){
      currtObjarry.splitBy = this.selectedDelimiters;
    }
  }
  removeKeyValue(item:any): void {
    if(this.keyValueArray.length <= AppConstants.TAG_PARAMETER_FIELDS.MAX) {
      let index = this.keyValueArray.indexOf(item);
      if(this.keyValueArray.length === AppConstants.TAG_PARAMETER_FIELDS.MIN){
        //this.keyValueArray.splice(index, 1);
        this.keyValueArray.filter(x => x.key = "");
        this.keyValueArray.filter(x => x.value = this.translate.instant('beeEditorGlobalComponent.selectDataTypeDropdownLbl'));
        const divEl = this.tagParametersDropdownElement.nativeElement as HTMLDivElement;
        const selectEl = divEl.querySelector('select.typeSelectList') as HTMLSelectElement;

        if (selectEl && selectEl.options.length > 0) {
          selectEl.selectedIndex = 0;

          // Optional: dispatch change event if needed
          selectEl.dispatchEvent(new Event('change'));
        }
        //this.keyValueArray[this.keyValueArray.length - 1].add = false;
      }else{
        this.keyValueArray.splice(index, 1);
        this.keyValueArray[this.keyValueArray.length - 1].add = false;
      }
      this.addAnotherDisable = this.keyValueArray.length - 1 >= AppConstants.TAG_PARAMETER_FIELDS.MAX;
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
  callTagParaNameValidationMethod(evt){
    let strVal:any;
    if(evt.target !== undefined){
      strVal = evt.target.value;
    }else{
      strVal = evt;
    }
    let errorRes:any = this.checkUnderscorseHyphenMethod(strVal);
    if(!errorRes){
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('beeEditorGlobalComponent.canallowOnlyunderscoreandhyphenerrorMsgLbl'),'warning');
    }
  }

  checkUnderscorseHyphenMethod(strVal){
    let valid:any;
    let error:any = false;    
    if(strVal !== ""){
      valid =  /^[a-zA-Z0-9_-]+$/.test(strVal); // validation for allowing underscore and hyphen ,alphanumeric
      error = valid;
    }    
    return error;
  }
   async saveParametersObjVal(){
    this.shareService.grapesJsEnabled.subscribe((res) => {
      if (res !== undefined) {
        this.pTagEditorType = res;
      }
    });   
    //this.shareService.getPersonalizationParameterTagObj.next(this.keyValueArray);
    //this.shareService.getTagParamsToSimulate.next(this.keyValueArray);
    let checkAllValidation:boolean = false;
    this.tagKeyParamsArry = [];
    for( let i=0; i < this.keyValueArray.length; i++){
      let ele = this.keyValueArray[i];
      let typeVal,relationTypeVal;
      if(ele.value === "Type" || ele.value == ""){
        typeVal = "";
      }else
      {
        typeVal = ele.value;
      }      
      if(typeVal === undefined){
        typeVal = "";
      }
      if(relationTypeVal === undefined){
        relationTypeVal = "";
      }
      if(ele.key !== "" && typeVal !== ""){
       let error:any =  this.checkUnderscorseHyphenMethod(ele.key);
       if(!error){
        checkAllValidation = error;
        this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('beeEditorGlobalComponent.canallowOnlyunderscoreandhyphenerrorMsgLbl'),'warning');
        return;
        break;
       }else{
        checkAllValidation = error;
        this.tagKeyParamsArry.push({name:ele.key,type:typeVal,relationType:relationTypeVal,splitBy:ele.splitBy});
        let tagKeyFromRename = this.dataService.activeContentTagKey; //localStorage.getItem("tagKeyPersonalization");
      if(tagKeyFromRename !== undefined){
        this.tagKey = tagKeyFromRename;
      }     
    
       }        
      }else{
        if(this.keyValueArray.length === 1 && ele.key === "" && typeVal === ""){ // when deleted all tag params
          checkAllValidation = true; 
          this.tagKeyParamsArry = [];
          let tagKeyFromRename = this.dataService.activeContentTagKey; //localStorage.getItem("tagKeyPersonalization");
          if(tagKeyFromRename !== undefined){
            this.tagKey = tagKeyFromRename;
          }           
        }else{  
          checkAllValidation = false; // when datatype is not selected or key is blank
          Swal.fire({
            title: this.translate.instant('beeEditorGlobalComponent.pleaseDefineTypeAndNameValidationLbl'),
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: this.translate.instant('designEditor.okBtn'),
          });
          return;
          break;
        }
        
      }
    }
    if(checkAllValidation){
    let payload = {
      "tagKey" : this.tagKey,
      "params" :this.tagKeyParamsArry,
      "editorType" : GlobalConstants.editorType
      }
     this.shareService.tagParametersObjArry.next(this.tagKeyParamsArry);
      // let payload = {tagKey:tagkey}
    let endpoint = AppConstants.API_END_POINTS.GET_SAVE_TAG_PARAMETERS_API;
    const result = await this.httpService.post(endpoint,payload).toPromise();
    if (result.status == 'SUCCESS') {
      this.dataService.setSharedActiveContentTagKey = result.response.tagKey;
      this.shareService.tagParameterDefinedStatus.next(true);
      // localStorage.setItem("tagKeyPersonalization",JSON.stringify(result.response.tagKey)); old approach
      if(this.translate.instant('beeEditorGlobalComponent.deleteTagParameterSuccessfullyLbl') === result.message && this.keyValueArray.length === 1 && this.keyValueArray[0].key === "" && this.keyValueArray[0].value === ""){
        // igrore delete message from backend, need to remove the message later.
      }else{
        Swal.fire({
          title: result.message,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        });        
      }
      this.onClose();
    } else if (result.status == 'FAIL') {
      this.dataService.SwalAlertSuccesOrFailMgs(result.message,'warning');
    }
    }
  }
  saveOrGetTagParametersMethod(){
    if(this.tagKey == -1){ // Create Tag Params
      this.keyValueArray[0].options = this.parameterType;
      this.getPtagSplitChars();
    }else{ // Edit tag params
      this.onEditGetParameters();
      
    }
  }
  async onEditGetParameters(){   
    let endpoint = AppConstants.API_END_POINTS.GET_TAG_PARAMETERS_API+"?tagKey="+this.tagKey;
    const result = await this.httpService.post(endpoint).toPromise();
    if (result.status == 'SUCCESS') {
      if (result.response.tagParams) {
        let savedObj = JSON.parse(result.response.tagParams);   
        this.editModeSavedObj = savedObj;
        if(savedObj == null){      
          this.isTagParamsEditMode = false;
          this.disabledDoneBtnTagParams = false;
          //this.saveParametersObjVal();
        }else{ // Edit mode retain values
          this.shareService.activeEditShareObj.subscribe(res => {
            if(res !== undefined){
              this.activeEditObjFromBeeEditor = res;
              if(this.activeEditObjFromBeeEditor.activeEdit == 1 && !this.isSavedAsQA){
                this.disabledDoneBtnTagParams = true;
              }
            }      
          });
          this.isTagParamsEditMode = true;
          this.addSavedParameters(savedObj);
        }
      } else {
        this.shareService.activeEditShareObj.subscribe(res => {
          if(res !== undefined){
            this.activeEditObjFromBeeEditor = res;
            if(this.activeEditObjFromBeeEditor.activeEdit == 1 && !this.isSavedAsQA){
              this.disabledDoneBtnTagParams = true;
            }
          }      
        });
      }
    this.getPtagSplitChars();
  }
}

}
