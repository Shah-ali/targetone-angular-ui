import { Component, OnInit,EventEmitter,Output,ViewChild,ElementRef, Input} from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { HttpService } from '@app/core/services/http.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { TranslateService } from '@ngx-translate/core';
import lodash, { map } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
interface OperatorTranslations {
  equal: string;
  notEqual: string;
  like: string;
  startsWith: string;
  endsWith: string;
}


@Component({
  selector: 'app-journey-product-filters',
  templateUrl: './journey-product-filters.component.html',
  styleUrls: ['./journey-product-filters.component.scss']
})
export class JourneyProductFiltersComponent implements OnInit {
  uuidForSelect = uuidv4();
  operatorTranslations: OperatorTranslations = {
    equal: "",
    notEqual: "",
    like: "",
    startsWith: "",
    endsWith: ""
  };

  parameterStringType: { [key: string]: string }[] = [];
  parameterNumberType: { [key: string]: string }[] = [];
  parameterType: any;
  keyValueArray: any = [];
  addAnotherDisable: boolean = false;
  selectedDelimiters: any;
  selctedTypeParameter: any;
  multiValueStringEnable: boolean = false;
  delimitersObj: any;
 @Input() inputParamSelected:any = [];
  fieldsOptionDataObj: any;
  searchFieldDataArray: any;
  dataModelSelectedObj: any;
  selectedModelsArry:any = [];
  columnHeaderObjArry:any = {}
  selectedFieldValue:any = {};
  disabledInputCheckEnable = false;
  @ViewChild('productFilterContentArea') productFilterContentArea! : ElementRef<any>;
  @ViewChild('ngSelectEachElementRef') ngSelectEachElementRef! : ElementRef<any>;
  @Output() parameterValueArray = new EventEmitter<any>();
  @Output() fieldsOfDMEModelArray = new EventEmitter<any>();
  ngSelectedValues: any;
  noofParameterFiltersArry: any;
  editModeEnabled: boolean = false;
  minusIconHideFlag: boolean = true;
  opratorValueOntitle: string = "";
  fieldValueOnTitle: any = "";
  constructor(private httpService: HttpService, private shareService: SharedataService, private translate:TranslateService) { 
    this.operatorTranslations = {
      equal: this.translate.instant('customerNonCustomerDMEComponents.operators.equal'),
      notEqual: this.translate.instant('customerNonCustomerDMEComponents.operators.notEqual'),
      like: this.translate.instant('customerNonCustomerDMEComponents.operators.like'),
      startsWith: this.translate.instant('customerNonCustomerDMEComponents.operators.startsWith'),
      endsWith: this.translate.instant('customerNonCustomerDMEComponents.operators.endsWith')
    };
    
    this.parameterStringType = [{[this.operatorTranslations.equal]:'='},{[this.operatorTranslations.notEqual]:"!="},{[this.operatorTranslations.like]:"like"},{[this.operatorTranslations.startsWith]:"starts with"},{[this.operatorTranslations.endsWith]:"ends with"}];
    this.parameterNumberType = [
      { [this.operatorTranslations.equal]: '=' },
      { [this.operatorTranslations.notEqual]: '!=' }
    ];
    this.keyValueArray = [{id:this.uuidForSelect,key:'', value:'',options: this.parameterStringType, add: false,fieldVal:"-1",operatorVal:"-1",multiSelectVal:[]}];
    this.shareService.getDataModelIdForProductFilters.subscribe((res:any) => {
      if(res !== undefined){
        this.dataModelSelectedObj = res;        
        if(this.dataModelSelectedObj.isEdit){
          this.editModeEnabled = res.isEdit;
          this.noofParameterFiltersArry = res.savedObj.parameterValues;
          if(this.dataModelSelectedObj.id !== undefined){
           this.populateFieldsOptionMethod(); 
          }                   
        }else{
          this.editModeEnabled = res.isEdit;
          this.noofParameterFiltersArry = res.savedObj.parameterValues;
          this.populateFieldsOptionMethod(); 
        }       
               
      }      
    });
    
    
      // setTimeout(() => {        
      //   // if(this.noofParameterFiltersArry !== undefined){          
      //   //   if(this.editModeEnabled){
      //   //     this.populateFieldsOptionMethod(); 
      //   //   }                  
      //   // }
      //   this.populateFieldsOptionMethod();
      //   }, 700);     
           
  }
  clearAllFilters(dmeId){
    this.keyValueArray = [{id:this.uuidForSelect,key:dmeId, value:'',options: this.parameterType, add: false,fieldVal:"-1",operatorVal:"-1",multiSelectVal:[]}];
    this.selectedFieldValue = {};
    this.insertItToDMEMethod(this.keyValueArray);
  }
  createFilterObjArrayMrthod(){
    if(this.noofParameterFiltersArry !== undefined){
      if(this.noofParameterFiltersArry.length > 0){
        this.noofParameterFiltersArry.forEach((item,i) => {
          if(i > 0 && i < 5){
            this.addNewKeyValue('');
          }
          //else{              
            let selectType = this.fieldsOptionDataObj.find(x => x.name == item.columnName);
            if(selectType !== undefined){
              let typeSelected = selectType.type;
              this.parameterType = typeSelected === 'number'?this.parameterNumberType :this.parameterStringType;
              this.keyValueArray[i].options = this.parameterType;
            }            
          this.keyValueArray[i].key = this.dataModelSelectedObj.id;
          this.keyValueArray[i].fieldVal = item.columnName;
          this.keyValueArray[i].operatorVal = item.operator;
          this.keyValueArray[i].multiSelectVal = item.value.split(',');
          //let objSimplify ={}
          //objSimplify[this.uuidForSelect] = item.value.split(',');
          this.selectedFieldValue[this.uuidForSelect] = item.value.split(',');
          //let srcStr = this.keyValueArray[i].multiSelectVal[0].toString();
          //this.showSelectedValuesMethod(this.keyValueArray[i].id,this.selectedFieldValue[this.keyValueArray[i].id]);   
          setTimeout(() => {                
            let takeFrist4char = this.getSubstringMethod(this.keyValueArray[i].id);                            
            this.searchFieldsDataListMethod(takeFrist4char,item.columnName,this.keyValueArray[i].id);
          }, 500);
        //}
        });
      
      }
    }
  }
  addCustomUser = (term) => (term);
  showSelectedValuesMethod(uuid,selectedValesArry){
    this.uuidForSelect = uuid;
    this.ngSelectedValues = selectedValesArry;
    if(this.productFilterContentArea !== undefined){
      let parentElementRef = this.productFilterContentArea.nativeElement;    
      let ngSelectConfigOption:any = this.ngSelectEachElementRef;
      let currentNgSelect = parentElementRef.getElementsByClassName(uuid)[0];
      ngSelectConfigOption.element = currentNgSelect;
      let obj:any = [];
      let filterObj = lodash.xor(selectedValesArry);
      lodash.map(filterObj,function(x,i) {
        ngSelectConfigOption.selectedItems.splice(i,0,{index:0,label:x,value:x,disabled:undefined,htmId:x+'_'+i});
      });
    }    
  }
  loadNgSelectEventMethod(eventNgSelect){
    let obj:any = [];
    obj.push(eventNgSelect);
    console.log(obj);
  }
  getSubstringMethod(uuid){
    let data = this.selectedFieldValue[uuid];
    let takeFrist4char;
    if(data !== undefined){
      if(data.length > 0){
        let srcStr = data[0].toString();
        takeFrist4char = srcStr.substring(0,4);
      }      
    }
    return takeFrist4char;
  }
  populateFieldsOptionMethod() {
		let endpoint  = AppConstants.API_END_POINTS.GET_FIELDS_OPTION_FILTER+this.dataModelSelectedObj.id;
    this.httpService
      .get(endpoint).subscribe((data) => {
        if(data.status === 200){
          if(!this.editModeEnabled){
            this.clearAllFilters(this.dataModelSelectedObj.id);
          }          
          this.fieldsOptionDataObj = data.body.fields;
          this.fieldsOfDMEModelArray.emit({"fields":this.fieldsOptionDataObj,"isSortable":data.body.sortedableColumn});
          this.createFilterObjArrayMrthod();
        }else{
          
        }
      });
	}
  getSelectedMultiValueMethod(arrySelected,itemObj){
    let inputUuid = itemObj.id;
    // if(evt.target.checked){ // if true add items 
    //   if(this.selectedFieldValue[inputUuid] === undefined){this.selectedFieldValue[inputUuid] = []};
    //   this.selectedFieldValue[inputUuid].push(itemObj);    
    // }else{ // else false remove item
    //   if(this.selectedFieldValue[inputUuid] === undefined){this.selectedFieldValue[inputUuid] = []};
    //   let index = this.selectedFieldValue[inputUuid].findIndex(x => x == itemObj);
    //   if(index !== undefined && index !== -1){
    //     this.selectedFieldValue[inputUuid].splice(index,1);
    //   }      
    // }
    let filtetXor = lodash.xor(arrySelected);
    if(this.selectedFieldValue[inputUuid] === undefined){this.selectedFieldValue[inputUuid] = []};
      this.selectedFieldValue[inputUuid].splice(0,this.selectedFieldValue[inputUuid].length); // delete all items
      this.selectedFieldValue[inputUuid].splice(0,0,filtetXor.join(','));  // add all items

    let filterCurrent = this.keyValueArray.findIndex(x => x.id == inputUuid);
    if(filterCurrent !== undefined){
      //this.keyValueArray[filterCurrent].multiSelectVal = this.selectedFieldValue[inputUuid];
      let itemLength = this.keyValueArray[filterCurrent].multiSelectVal.length;
      this.keyValueArray[filterCurrent].multiSelectVal.splice(0,itemLength);
      this.keyValueArray[filterCurrent].multiSelectVal.splice(0,0,filtetXor.join(','));
    }
    let checkHowManyFieldSelected= lodash.filter(this.keyValueArray);
    this.insertItToDMEMethod(checkHowManyFieldSelected);
    
    
  }
  itemIsDisabled(evt,items){
    // if(itemObj.operatorVal == 'between' || itemObj.operatorVal == '>' || itemObj.operatorVal == '>=' || itemObj.operatorVal == '<' || itemObj.operatorVal == '<=' ){
    //   if(this.selectedFieldValue[inputUuid].length > 0){
    //     this.disabledInputCheckEnable = itemObj.id;
    //   }      
    // }
  }
  insertItToDMEMethod(checkHowManyFieldSelected){
    let makeArrayOFSelectedFilters:any = [];
    if(checkHowManyFieldSelected.length > 0){
      checkHowManyFieldSelected.forEach((each,i) => {
        let objP:any = {
          "columnName": each.fieldVal,
          "operator": each.operatorVal,
          "value": each.multiSelectVal.join(',')
        }
        makeArrayOFSelectedFilters.push(objP);
        //{columnName": "product_id","operator": "like",  "value": "128"},{"columnName": "name", "operator": "between", "value": "Cla,222" }]
      });
      this.parameterValueArray.emit(makeArrayOFSelectedFilters);
    }
  }
  filterDataMethod(evt,fieldName){
    let uuidFetch = evt.currentTarget.getAttribute('data-uuid');
    let inputStr = this.getSubstringMethod(uuidFetch);
    // //this.ngSelectEachElementRef['itemsList'].filteredItems = [];
    // //evt.target.value = inputStr;
    // if(inputStr !== undefined){
    //   this.searchFieldsDataListMethod(inputStr,fieldName,uuidFetch);
    // }    
      this.uuidForSelect = uuidFetch;
  }
  searchFieldsDataListMethod(evt,fieldName,uuid){
    let inputStr;
    if(evt.target === undefined){
      inputStr = evt;
    }else{
      inputStr = evt.target.value;
    }
    
    if(inputStr !== '' && inputStr.length >= 3){

    let endpoint = AppConstants.API_END_POINTS.GET_PRODUCT_FILTER_FIELD_DATA_API;
    let payload = 
    {
      "index": this.dataModelSelectedObj.savedObj.modelName, // dme name
      "field":fieldName, 
      "searchString":inputStr
    }
  
    this.httpService
      .post(endpoint,payload).subscribe((data) => {
        if(data.status === 'SUCCESS'){
         // let colobj = {}; colobj[this.uuidForSelect][this.uuidForSelect] = data.response;         
          this.columnHeaderObjArry[uuid] = data.response;                 
          if(this.selectedFieldValue[uuid] === undefined){this.selectedFieldValue[uuid] = []};
            if(this.selectedFieldValue[uuid].length > 0){
              this.selectedFieldValue[uuid].forEach((val,i) => {
                let itemIndx = this.columnHeaderObjArry[uuid].findIndex(x => x == val);
                if(itemIndx != -1){
                  this.columnHeaderObjArry[uuid].splice(itemIndx,1);
                  this.columnHeaderObjArry[uuid].splice(i,0,val);
                }                
              });
            }            
                        
        }else{
          // Swal.fire({
          //   title: data.message,
          //   allowEscapeKey: false,
          //   allowOutsideClick: false,
          //   showConfirmButton: true,
          //   confirmButtonText: this.translate.instant('designEditor.okBtn'),
          // });
          // return;
        }
      });
    }

  }

   // Key Value Pair
   addNewKeyValue(evt) {
    let newUuid = uuidv4();
    if(this.keyValueArray.length >= AppConstants.MOBILE_PUSH_RANGE.MIN && this.keyValueArray.length < AppConstants.MOBILE_PUSH_RANGE.MAX) {
     // item.add = false;
      this.minusIconHideFlag = false;

      if(this.keyValueArray.length < 5) {
        this.keyValueArray.push({id:newUuid,key: '', value:'',options: this.parameterType, add: false,fieldVal:"-1",operatorVal:"-1",multiSelectVal:[]});
       // let obj = {}; obj[newUuid] = [];
        this.selectedFieldValue[newUuid] = [];
        this.columnHeaderObjArry[newUuid] = [];
        this.uuidForSelect = newUuid;
        if(this.keyValueArray.length === 5){
          this.addAnotherDisable = true;
        }else{
          this.addAnotherDisable = false;
        }
      }
    }else{
      this.addAnotherDisable = true;
    }
  }
  onChangeMultiValueString(evt,id,type){
    let selectedVal ='-1';
    if(evt.target === undefined){
      selectedVal = evt;
    }else{
      selectedVal = evt.target.value;
    }
    
    let currtObjarry = this.keyValueArray.find(x => x.id == id);
    if(currtObjarry !== undefined){
      if(type === 'field'){
        currtObjarry.fieldVal = selectedVal;
      }else if(type === 'operator'){
        currtObjarry.operatorVal = selectedVal;
      }      
    }
    this.opratorValueOntitle = evt.target.selectedOptions[0].text;
    this.insertItToDMEMethod(this.keyValueArray);
  }
  removeKeyValue(item:any,uuid): void {
    if(this.keyValueArray.length <= AppConstants.MOBILE_PUSH_RANGE.MAX) {
      let index = this.keyValueArray.findIndex(x => x.id == item.id);
      if(this.keyValueArray.length === 1){
        //this.keyValueArray.splice(index, 1);
        this.keyValueArray.filter(x => x.key = "");        
        //this.keyValueArray[this.keyValueArray.length - 1].add = false;
      }else{
        this.keyValueArray.splice(index, 1);
        delete this.selectedFieldValue[uuid];
        this.keyValueArray[this.keyValueArray.length - 1].add = false;
        //if(this.keyValueArray.length <  5){
          this.addAnotherDisable = false;
       // }
       if(this.keyValueArray.length === 1){
        this.minusIconHideFlag = true;
       }else{
        this.minusIconHideFlag = false;
       }
      }
      
    }
    this.insertItToDMEMethod(this.keyValueArray);    
  }
  clearKeyValueData(){
    this.keyValueArray.filter(x => x.key = "");
    this.keyValueArray.filter(x => x.value = "");
  }
  
  selectFieldsMethod(evt,id,type){
     let selectVal = evt.target.value;
     let selectType = this.fieldsOptionDataObj[evt.target.selectedIndex-1].type;
     this.parameterType = selectType === 'number'?this.parameterNumberType :this.parameterStringType;
     let currtKeyvalueArray = this.keyValueArray.find(x => x.id == id);
     currtKeyvalueArray.options = this.parameterType;
     //this.keyValueArray = [{id:this.uuidForSelect,key:'', value:'',options: this.parameterType, add: false,fieldVal:"-1",operatorVal:"-1",multiSelectVal:[]}];
     this.fieldValueOnTitle = selectVal;
     this.onChangeMultiValueString(evt,id,type);
  }
  ngOnInit(): void {
  }

}
