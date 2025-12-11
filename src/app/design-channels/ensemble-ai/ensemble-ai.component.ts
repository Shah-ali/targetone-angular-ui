import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedataService } from '@app/core/services/sharedata.service';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { HttpService } from '@app/core/services/http.service';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '@app/core/services/data.service';
import { groupBy, keys, merge } from 'lodash';
import { AppConstants } from '@app/app.constants';
import { RandomNameService } from '@app/core/services/random-name.service';
import { GlobalConstants } from '../common/globalConstants';
import { environment } from '@env/environment';
import { AuthenticationService } from '@app/core/services/authentication.service';
@Component({
  selector: 'app-ensemble-ai',
  templateUrl: './ensemble-ai.component.html',
  styleUrls: ['./ensemble-ai.component.scss']
})
export class EnsembleAIComponent implements OnInit {
  @Output() onAdd = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  baseUrl: any = environment.BASE_URL;
  leftSideOptions:any = [];
  optionList:any =  {}
  activeTabId:any = 0;
  seedOptionDataArrayObj:any = [];
  viewMoreConfigFlagEnabled:boolean = false;
  selectedItemOfParts:any = 0;
  radioBtnActiveStatus:any = 0;
  noofRowsArray:any = [2,3,4,5,6,7,8,9,10];
  noofColumnsArray:any = [2,3,4,5,6,7,8,9,10];
  selectedNoofColumns:any = "2";
  selectedNoofRows:any = "3";
  layoutConfigSize: any = 6;
  tabsLayoutArray:any = [3,4,5,6];
  widthOflayoutOutterPanel: any = {width:"22%"};
  partImagePath = "url('../../../assets/images/layoutimages_ensembleAI/part";
  AiLayoutDataArrayObj: any = [];
  layoutTabActive: any = 0;
  currentActivePartSelected: any = 3;
  partDropdownEnabled: boolean = false;
  loadPartsInDropdown:any = [];
  layoutConfigArrayObj = {};
  clickToChangeEnabled: boolean = true;
  objectKey:any = Object.keys
  finalConfigLayoutJSon:any = {};
  eachPartBoxSize:any;
  widthHeightBorderObjJson: any = [];
  productDetailsObjJson:any = [];
  noofEnsembles:any = 1;
  ensembleAPIobjJson: any = {};
  addPramaAddtionalObjArray:any = [];
  isRowEditModeEnable: boolean = false;
  insertDynamicDataToActiveContent: any = {};
  rowNameValue: any;
  parameterValueObjSaved: any = {};
  noofSeedSelected: any = 1;
  layoutTabVisited: boolean = false;
  mandatoryValueObj: any = {};
  editModeEnabled:boolean = false;
  rowsColsSavedValuesObj: any;
  editModeEnsembleObjJson: any = {};
  isPublishActiveContentEnabled: boolean = false;
  hidePassword:boolean = false;
  addParamsDisabledMode: boolean = false;
  ensembleResponseLimit: number = AppConstants.CONSTANT_VALUES.ENSEMBLE_RESPONSE_LIMIT;
  fontOject: any = {};
  constructor(public bsModalRef: BsModalRef,private shareService:SharedataService,private httpService:HttpService,private translate: TranslateService,private dataService: DataService, private randomNameService: RandomNameService, private authService: AuthenticationService) {
    GlobalConstants.parentComponentName = 'EnsembleAIComponent';
    
    this.shareService.isPublishEnabledForPersonalization.subscribe(res => {
      this.isPublishActiveContentEnabled =res;
    });
    this.fontOject = {
      "fontFamily": [
        { "name": "Arial", "value": "Arial" },
        { "name": "Poppins", "value": "Poppins" },
        { "name": "Times New Roman", "value": "Times New Roman" }, 
        { "name": "Courier New", "value": "Courier New" },
        { "name": "Georgia", "value": "Georgia" }  
      ],
      "fontWeight": [
        { "name": "regular", "value": "regular" },
        { "name": "medium", "value": "medium" },
        { "name": "bold", "value": "bold" },
        { "name": "light", "value": "light" }      
      ],
      "fontSize":[
        { "name": "12", "value": "12" },  
        { "name": "14", "value": "14" },
        { "name": "16", "value": "16" },
        { "name": "18", "value": "18" },
        { "name": "20", "value": "20" },
        { "name": "22", "value": "22" },
        { "name": "24", "value": "24" }      
      ]
    }

    this.shareService.savedAddOnsJSON.subscribe((res: any) => {
      if(this.objectKey(res).length > 0){
        let editModeEnsembleObj = JSON.parse(res.selectedValue);
        this.editModeEnsembleObjJson = editModeEnsembleObj;
        this.rowsColsSavedValuesObj = {"rows":editModeEnsembleObj["rows"],"cols":editModeEnsembleObj['cols']};
        this.editModeEnabled = true;
        this.seedOptionDataArrayObj = this.createSeedOtionDataMethod(editModeEnsembleObj,false);
        this.layoutConfigArrayObj = editModeEnsembleObj.parts;
        this.selectedNoofRows = editModeEnsembleObj.rows;
        this.selectedNoofColumns = editModeEnsembleObj.cols;
        this.selectedItemOfParts = editModeEnsembleObj.selectedItemOfParts;
        this.tabsLayoutArray = editModeEnsembleObj.tabsLayoutArray;
        this.viewMoreConfigFlagEnabled = editModeEnsembleObj.viewMoreConfigFlagEnabled;
        if(this.selectedItemOfParts == 0){
          this.currentActivePartSelected = 3; // default load
        }else{
          this.currentActivePartSelected = editModeEnsembleObj.currentActivePartSelected; //selected load
        }        
        this.AiLayoutDataArrayObj = editModeEnsembleObj.aiLayoutDataArray;
        this.noofSeedSelected = editModeEnsembleObj.noofSeedSelected;
        this.addPramaAddtionalObjArray = editModeEnsembleObj.additionalInputParams;
        this.createwidthHeightBorderJsonMethod(editModeEnsembleObj.width,editModeEnsembleObj.height,editModeEnsembleObj.borderradius,editModeEnsembleObj.padding);
        this.noofEnsembles = editModeEnsembleObj.noofEnsemble;
        this.createProductObjJSonMethod(editModeEnsembleObj);
      }
    });
    this.createLeftmenuMethod();
   
   }
   getHelpContentMethod(id) { 
    this.authService.globalHelpOLH(id);
   }
  ngOnInit(): void {
    if(!this.editModeEnabled){
      this.ensembleSettingsAPImethod();
    }    
  }
  showPasswordMethod(indx){
    this.hidePassword = !this.hidePassword;
    if(this.hidePassword){
      this.seedOptionDataArrayObj[0].authentication[indx].visiblePassword = true;
    }else{
      this.seedOptionDataArrayObj[0].authentication[indx].visiblePassword = false;
    }    
  }
  addAdditionParamMethod(){
    let obj = {"id":"","value":"","visible":true,"placeholderId":this.translate.instant('ensembleAiComponentLables.enterParamNamelbl'),"placeholderValue":this.translate.instant('ensembleAiComponentLables.enterParanValuelbl')};
    // stop at addPramaAddtionalObjArray.length is 10
    if( this.addPramaAddtionalObjArray.length < AppConstants.CONSTANT_VALUES.ADDPARAMSLIMIT_ENSEMBLE_AI){
      this.addPramaAddtionalObjArray.splice(this.addPramaAddtionalObjArray.length,0,obj);
      this.addParamsDisabledMode = false;
    }else{
      this.addParamsDisabledMode = true;
    }
    
  } 

  deletePramaMethod(indx){    
    this.addPramaAddtionalObjArray.splice(indx,1);
    this.addParamsDisabledMode = false;
  }
  createLayoutJsonObj(){
    let JSONObj = {
     "3" : { "1" : [1,3], "2":[2,4],"3":[5,6] },
	  "4" : { "1" : [1], "2":[2,4],"3":[3,5],"4":[6] },
	  "5" : { "1" : [1,3], "2":[2],"3":[4],"4":[5],"5":[6] },
	  "6" : { "1" : [1], "2":[2],"3":[3],"4":[4],"5":[5],"6":[6] }
    }
    this.layoutConfigArrayObj = JSONObj;
  }
  resetEmptyLayoutJsonObj(){
    let JSONObj = {
     "3" : { undefined:[1,2,3,4,5,6] },
	  "4" : { undefined:[1,2,3,4,5,6] },
	  "5" : {undefined:[1,2,3,4,5,6] },
	  "6" : { undefined:[1,2,3,4,5,6] }
    }
    this.layoutConfigArrayObj = JSONObj;
  }
  collectAllParametersValueObjMethod(){
    let collectparams:any = {};
    Object.values(this.seedOptionDataArrayObj[0]).forEach(arrayObjs => {
      let resArry:any = arrayObjs;
      resArry.forEach(ele => {
        if(ele.arrayObj !== undefined){
          if(ele.activeStatus){
            ele.arrayObj.forEach(eleInner => {
              if(eleInner.value !== ""){
                collectparams[eleInner.id] = eleInner.value;
              }
            });
          }          
        }else
        if(ele.value !== "" && ele.value !== undefined){
          if(typeof(ele.value) === 'boolean'){
            if(ele.value){
              collectparams[ele.id] = ele.value;
            }
          }else{
            collectparams[ele.id] = ele.value;
          }
          
        }
      });
    });
    this.parameterValueObjSaved = collectparams;
    return this.parameterValueObjSaved;
  }
  
  checkForMandatoryFieldsMethod(){
    let collectparams:any = {};
    this.mandatoryValueObj = [];
    Object.values(this.seedOptionDataArrayObj[0]).forEach(arrayObjs => {
      let resArry:any = arrayObjs;
      resArry.forEach(ele => {
        if(ele.arrayObj !== undefined){
          if(ele.activeStatus){
            ele.arrayObj.forEach(eleInner => {
              if(eleInner.mandatory){
                if(eleInner.value === ""){
                  collectparams[eleInner.name] = eleInner.value;
                }
              }
            });
          }          
        }else
        if(ele.mandatory){
          if(ele.value === ""){
            collectparams[ele.name] = ele.value; 
          }         
        }
      });
    });
    Object.values(this.widthHeightBorderObjJson).forEach((each:any) => {
      if(each.value == ''){
        collectparams[each.displayName] = each.value;
      }
    });
    this.mandatoryValueObj = collectparams;   
    let errorObj:any = [];
    if(this.objectKey(this.mandatoryValueObj).length > 0){      
      this.objectKey(this.mandatoryValueObj).forEach(errorFor => {
        let obj = {};
        obj["errorId"] = errorFor;
        errorObj.push(obj);
      });     
      
    }
    return errorObj;
  }
 
  createProductObjJSonMethod(productObj){
    let prodObj = [
      productObj['productBrand'],
      productObj['productName'],
      productObj["productPrice"]
    ];
    prodObj[0].displayName = this.translate.instant('ensembleAiComponentLables.brandNameLbl');
    prodObj[1].displayName = this.translate.instant('ensembleAiComponentLables.productNameLbl')
    prodObj[2].displayName = this.translate.instant('ensembleAiComponentLables.productpriceLbl');
    //prodObj[2].value = "";
    prodObj[0].fontObject = this.fontOject;
    prodObj[1].fontObject = this.fontOject;
    prodObj[2].fontObject = this.fontOject;
    this.productDetailsObjJson = prodObj;
  }
  createwidthHeightBorderJsonMethod(width,height,borderradius,padding){
    let obj:any = [
      {"value" : width,"displayName":this.translate.instant('ensembleAiComponentLables.widthlbl')},
      {"value" : height,"displayName":this.translate.instant('ensembleAiComponentLables.heightLbl')},      
      {"value" : borderradius,"displayName":this.translate.instant('ensembleAiComponentLables.borderradiusLbl')},
      {"value" : padding,"displayName":this.translate.instant('ensembleAiComponentLables.paddingLbl')},
    ]
    this.widthHeightBorderObjJson = obj;
  }
  clearPartValueMethod(){
    let currentPart = this.AiLayoutDataArrayObj.find(x => x.partNo == this.currentActivePartSelected);
    currentPart['partArray'].map(x => x.clickTextEnabled = true);
  }
  switchLayoutTab(inx,part){ // part tabs
    this.layoutTabActive = inx;
    this.currentActivePartSelected = part;
    this.clickToChangeEnabled = true;
    this.loadPartsInDropdown = this.convertNumberToArrayMethod(part);
    this.clearPartValueMethod();
    // if(this.AiLayoutDataArrayObj.length > 0){
    //   if(this.AiLayoutDataArrayObj[this.layoutTabActive] === undefined){
    //     this.AiLayoutDataArrayObj.splice(this.AiLayoutDataArrayObj.length,0,...this.calculateLayoutSize(false));
    //   }else if(this.AiLayoutDataArrayObj[this.layoutTabActive][this.currentActivePartSelected] === undefined){
    //     this.AiLayoutDataArrayObj.splice(this.AiLayoutDataArrayObj.length,0,...this.calculateLayoutSize(false));
    //   }
    // }
      
  }
  getLayoutSize(){
    let size:any;
    size = this.selectedNoofRows * this.selectedNoofColumns;
    this.widthOflayoutOutterPanel = {width:12 * this.selectedNoofColumns+'%'};
    this.eachPartBoxSize = 100 / this.selectedNoofColumns + '%';
    return size;
  }
  convertNumberToArrayMethod(num){
    let result = Array.from({ length: num }, (_, i) => (i + 1));
    return result;
  }
  getDropdownListMethod(partNo,inx){
    let num = this.currentActivePartSelected;
    let partListArray = this.convertNumberToArrayMethod(num);
    this.loadPartsInDropdown = [];
    let currentObj = this.AiLayoutDataArrayObj.find(x => x.partNo == this.currentActivePartSelected);
    this.partDropdownEnabled = partNo;
    this.loadPartsInDropdown = partListArray;
    currentObj['partArray'].map(x => x.clickTextEnabled = true); // enable all 
    currentObj['partArray'][inx].clickTextEnabled = false; // disable one
  }
  calculateLayoutSize(resetImages){
    let num = this.getLayoutSize();
    let rangeArray = Array.from({ length: num }, (_, i) => i + 1);
    let finalArray:any = []; 
    let tempPartArry:any = []; 
    let partNewobj = {};
    // if(resetImages){
    //   this.resetEmptyLayoutJsonObj();
    // }
    this.objectKey(this.layoutConfigArrayObj).forEach(parts => {
      let newObj = {};
      
      this.objectKey(this.layoutConfigArrayObj[parts]).forEach(childParts => {
        this.layoutConfigArrayObj[parts][childParts].map(x => {newObj[x] = childParts});
      });
      partNewobj[parts] = newObj;
    });
    this.finalConfigLayoutJSon = partNewobj;
    this.objectKey(this.finalConfigLayoutJSon).forEach(partNo => {
      let partObj = {};
      tempPartArry = [];
      let partmapNo:any;
      rangeArray.forEach(x => {             
        let url:any;     
        if(resetImages){
          url = "";
          partmapNo = undefined;
        }else{
          if(this.finalConfigLayoutJSon[partNo][x] === undefined){
            url = "";
            partmapNo = undefined;
          }else{
            url = "assets/images/layoutimages_ensembleAI/part"+this.finalConfigLayoutJSon[partNo][x]+".svg";
            partmapNo = this.finalConfigLayoutJSon[partNo][x];
          }
        }
        
        let pathimg = url;
        let combineArray = {};
        combineArray["partPosition"] = x;
        combineArray["imagePath"] = pathimg;
        combineArray["partNumMap"] = partmapNo || undefined;   
        combineArray['clickTextEnabled'] = true;   
        tempPartArry.push(combineArray);      
      });
      partObj['partNo'] = partNo;
      partObj['partArray'] = tempPartArry;
      finalArray.push(partObj);
    });    
    return finalArray;
  }
  changePartToLayoutMethod(evt,inx){
    let partVal = this.eventOrValueInputMethod(evt,'select');
    let pathimg = "assets/images/layoutimages_ensembleAI/part"+partVal+".svg";
    let currentObj = this.AiLayoutDataArrayObj.find(x => x.partNo == this.currentActivePartSelected);
    currentObj['partArray'][inx].imagePath = pathimg;
    currentObj['partArray'][inx].partNumMap = partVal;
    currentObj['partArray'][inx].clickTextEnabled = true;
  }
  ensembleSettingsAPImethod(){
    let url = AppConstants.API_END_POINTS.GET_ENSEMBLE_SETTINGS_API;
    this.httpService.post(url).subscribe((data) => {
      if(data.status === 'SUCCESS') {
        this.ensembleAPIobjJson = JSON.parse(data.response);
        let ensembleSettingobj = this.ensembeledSettingsMethod(this.ensembleAPIobjJson);
        let loadJsonObj = this.saveEnsembleAIDataMethod(ensembleSettingobj,{},this.addPramaAddtionalObjArray,1);
        this.seedOptionDataArrayObj = this.createSeedOtionDataMethod(loadJsonObj,true);
        this.layoutConfigArrayObj = this.ensembleAPIobjJson.parts;
        this.rowsColsSavedValuesObj = {"rows":this.ensembleAPIobjJson["rows"],"cols":this.ensembleAPIobjJson['cols']};
        this.createwidthHeightBorderJsonMethod(this.ensembleAPIobjJson.width,this.ensembleAPIobjJson.height,this.ensembleAPIobjJson.borderradius,this.ensembleAPIobjJson.padding);
        this.createProductObjJSonMethod(this.ensembleAPIobjJson);
        this.createLayoutJsonObj();
        this.AiLayoutDataArrayObj.splice(this.AiLayoutDataArrayObj.length,0,...this.calculateLayoutSize(false));
      }
    });
  }
  finalResultLayoutPositioningMethod(){
    let resultObj:any = {};
    if(this.selectedItemOfParts != 0){
      this.AiLayoutDataArrayObj = this.AiLayoutDataArrayObj.filter(x => x.partNo == this.selectedItemOfParts);
    }    
      this.AiLayoutDataArrayObj.forEach(ele => {
        let groupbyObj = groupBy(ele.partArray,'partNumMap');
        this.objectKey(groupbyObj).forEach(innerele => {
         let resPos =  groupbyObj[innerele].map(x => x.partPosition);
         groupbyObj[innerele] = resPos;
        });
        resultObj[ele.partNo] = groupbyObj;
        
      });     
      return resultObj;
  }
   // common confirmation msg to call
   confirmationSwalMsgCallMethod(evt,type) {    
    let msg = this.translate.instant('ensembleAiComponentLables.validationOnChnageofLayoutDimensuionLblMsg');   
    let prevsVal:any; 
    if(type == 'row'){
      prevsVal = this.rowsColsSavedValuesObj['rows'];
    }else{
      prevsVal = this.rowsColsSavedValuesObj['cols'];
    }
    Swal.fire({
      text: msg,
      width: '40%',
      icon: 'warning',
      showCloseButton: false,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('designEditor.okBtn'),
      cancelButtonText: this.translate.instant('designEditor.cancelBtn'),
      cancelButtonColor: '',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        cancelButton: 'buttonCssStyle',
        confirmButton: 'buttonCssStyle',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.layoutTabActive = 0;
        this.onChangeOfLayoutMethod(evt,type,false);
      }else{
        let countUpdate = evt.target.value;
        if(type == 'row'){          
          countUpdate = prevsVal;
          this.selectedNoofRows = prevsVal;
        }else{
          countUpdate = prevsVal;
          this.selectedNoofColumns = prevsVal;
        }
      }
    });
  }  
  onChangeOfLayoutMethod(evt,type,islayoutChanged){    
    let countUpdate = evt.target.value;
    if(type == 'row'){
      this.selectedNoofRows = countUpdate;
    }else{
      this.selectedNoofColumns = countUpdate;
    }    
    this.AiLayoutDataArrayObj = [];
    this.AiLayoutDataArrayObj.splice(this.AiLayoutDataArrayObj.length,0,...this.calculateLayoutSize(islayoutChanged));
  }
  
  selectLeftTabs(activetab){
    this.activeTabId = activetab;   
    //this.currentActivePartSelected = activetab; 
    let prevSelectedLayout = this.finalResultLayoutPositioningMethod();
    this.createLayoutJsonObj();
    if(!this.layoutTabVisited){
      //if(!this.editModeEnabled){
          this.AiLayoutDataArrayObj = [];
      if(this.AiLayoutDataArrayObj.length > 0){
        this.mergePreviousPartsToNewMethod(prevSelectedLayout);
        if(this.AiLayoutDataArrayObj[this.layoutTabActive] === undefined){
          this.AiLayoutDataArrayObj.splice(this.AiLayoutDataArrayObj.length,0,...this.calculateLayoutSize(false));
        }else if(this.AiLayoutDataArrayObj[this.layoutTabActive][this.currentActivePartSelected] === undefined){
          this.AiLayoutDataArrayObj.splice(this.AiLayoutDataArrayObj.length,0,...this.calculateLayoutSize(false));
        }
      }else{
        this.mergePreviousPartsToNewMethod(prevSelectedLayout);
        this.AiLayoutDataArrayObj.splice(this.AiLayoutDataArrayObj.length,0,...this.calculateLayoutSize(false));
      }
      //}
    }    
    if(activetab === 1){
      this.layoutTabVisited = true;           
      this.mergePreviousPartsToNewMethod(prevSelectedLayout);
      this.AiLayoutDataArrayObj = [];
      this.AiLayoutDataArrayObj.splice(this.AiLayoutDataArrayObj.length,0,...this.calculateLayoutSize(false));
    }
  }
  mergePreviousPartsToNewMethod(previousDataObj){
    this.objectKey(this.layoutConfigArrayObj).map((x,i) => {
      if(previousDataObj[x] !== undefined){
        this.layoutConfigArrayObj[x] = previousDataObj[x];
      }
    });
  }
  eventOrValueInputMethod(evt,type){
    let res:any;
    if(evt.target !== undefined){
      if(type == 'checkbox'){
        res = evt.target.checked;
      }else{
        res = evt.target.value;
      }
      
    }else{
      res = evt;
    }
    return res;
  }
  enableViewMoreOptionMethod(evt){
    let trueFalseVal = this.eventOrValueInputMethod(evt,'checkbox');
    if(trueFalseVal){
      this.viewMoreConfigFlagEnabled = true;
    }else{
      this.viewMoreConfigFlagEnabled = false;
    }
  }
  noofSeedsSelectionMethod(obj,newVal){
    obj.value = newVal;
    this.noofSeedSelected = newVal;
  }  
  ensemblesDefineMethod(evt){
    let entVal = evt.target.value;
    if(entVal >= 1 && entVal <= this.ensembleResponseLimit){
      //
    }else{
      this.dataService.SwalAlertSuccesOrFailMgs(this.translate.instant('ensembleAiComponentLables.noofensembleSettingsLbl'),'warning');
      this.noofEnsembles = 1; // set as default.
    }
  }
  getnumberoFPartsSelectedMethod(value){
    let objSaved:any = this.seedOptionDataArrayObj[0]["viewmoreConfigOption"].find(x => x.id == 'numParts');
    let periviousSelectedVal = this.selectedItemOfParts;
    let msg = this.translate.instant('ensembleAiComponentLables.confirmationMsgForChangingPartsLbl');
    Swal.fire({
      text: msg,
      width: '40%',
      icon: 'warning',
      showCloseButton: false,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('yes'),
      cancelButtonText: this.translate.instant('designEditor.cancelBtn'),
      cancelButtonColor: '',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        cancelButton: 'buttonCssStyle',
        confirmButton: 'buttonCssStyle',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.selectedItemOfParts = value;
    this.currentActivePartSelected = value;
    this.layoutTabActive = 0; // set active tab to first.
    if(value > 0){
      this.tabsLayoutArray = [this.selectedItemOfParts];
        // All parts loadings
        this.createLayoutJsonObj();
        this.AiLayoutDataArrayObj = [];
        this.AiLayoutDataArrayObj.splice(this.AiLayoutDataArrayObj.length,0,...this.calculateLayoutSize(false));   
    }else{// All parts selected
      this.currentActivePartSelected = 3;
      this.selectedItemOfParts = 0;
      this.tabsLayoutArray = [3,4,5,6]; //  default value when it is All parts -> 0
      if(this.editModeEnabled){
        //this.resetEmptyLayoutJsonObj();
        let editModeLayoutConfig = this.finalResultLayoutPositioningMethod();
        this.createLayoutJsonObj();
        this.mergePreviousPartsToNewMethod(editModeLayoutConfig);
        this.AiLayoutDataArrayObj = [];
        this.AiLayoutDataArrayObj.splice(this.AiLayoutDataArrayObj.length,0,...this.calculateLayoutSize(false));
      }else{
        this.createLayoutJsonObj();
      }
      
    }
      }else{
        objSaved.value = periviousSelectedVal;

      }
    });


    
  }
 
createSeedOtionDataMethod(loadDataObj,createmode){
  let sampleJsonObj = [    
  {
    "authentication":[
        {
          "id":"apiKey",
          "name":this.translate.instant('ensembleAiComponentLables.APIkeyLbl'),
          "value":loadDataObj['apiKey'],
          "optional":false,
          "mandatory":true,
          "infoIconEnable":false,
          "infoText":"",
          "visiblePassword":false

        },
        {
          "id":"apiClientKey",
          "name":this.translate.instant('ensembleAiComponentLables.APIClientKeyLbl'),
          "value":loadDataObj['apiClientKey'],
          "optional":false,
          "mandatory":true,
          "infoIconEnable":false,
          "infoText":"",
          "visiblePassword":false
          
        }
      ],
    "seedOptions":[
      {
        "name":this.translate.instant('ensembleAiComponentLables.seedProductLbl'),
        "id":"seedProductId",
        "activeStatus":loadDataObj['seedProductId'] || createmode,
        "value":loadDataObj['seedProductId'] || createmode
      },
      {
        "name":this.translate.instant("ensembleAiComponentLables.viewhistoryLbl"),
        "id":"useViewsAsSeed",
        "activeStatus":loadDataObj['useViewsAsSeed'],
        "value":loadDataObj['useViewsAsSeed']
      },
      {
        "name":this.translate.instant('ensembleAiComponentLables.purchaseHistoryLbl'),
        "id":"usePurchasesAsSeed",
        "activeStatus":loadDataObj['usePurchasesAsSeed'],
        "value":loadDataObj['usePurchasesAsSeed']
      }
  ],

    "seedOptionObjArray":
     [
      {
        "id":"seedProductIdSection",
        "arrayObj":[
                  {
                  "name":this.translate.instant('ensembleAiComponentLables.seedProductIDlbl'),
                  "id":"seed",
                  "value":loadDataObj['seedProductIdSection']['seed'],                  
                  "type":"input",
                  "optional":false,
                  "mandatory":true,
                  },
                {
                  "name":this.translate.instant('ensembleAiComponentLables.userIDLbl'),
                  "id":"userId",
                  "value":loadDataObj['seedProductIdSection']['userId'],
                  "labelInfo":"This enables user view history as seed",
                  "type":"input",
                  "optional":false,
                  "mandatory":false,
                }
            ],
            "activeStatus":loadDataObj['seedProductId'] || createmode,
            "labelInfo":this.translate.instant("ensembleAiComponentLables.enablesUserSeedProductIdLbl"),
     },     {
      "id":"viewProductIdSection",
      "arrayObj":[
            {
              "name":this.translate.instant('ensembleAiComponentLables.userIDLbl'),
              "id":"userId",
              "value":loadDataObj['viewProductIdSection']['userId'],              
              "type":"input",
              "optional":false,
              "mandatory":true,
            },
            {
              "name":this.translate.instant('ensembleAiComponentLables.chooseNumberOfSeedsLbl'),
              "value":loadDataObj['viewProductIdSection']['numOfSeeds'],
              "id":"numOfSeeds",
              "noofSeeds":[1,2,3],
              "type":"select",
              "optional":false,
              "mandatory":false,
            }
          ],
          "activeStatus":loadDataObj['useViewsAsSeed'],
          "labelInfo":this.translate.instant('ensembleAiComponentLables.enablesUserViewHistoryLbl'),
     },
     {
      "id":"purchaseHistoryIdSection",
      "arrayObj":[
        {
          "name":this.translate.instant('ensembleAiComponentLables.userIDLbl'),
          "value":loadDataObj['purchaseHistoryIdSection']['userId'],
          "id":"userId",          
          "type":"input",
          "optional":false,
          "mandatory":true,
        },
        {
          "name":this.translate.instant('ensembleAiComponentLables.chooseNumberOfSeedsLbl'),
          "value":loadDataObj['purchaseHistoryIdSection']['numOfSeeds'],
          "id":"numOfSeeds",
          "noofSeeds":[1,2,3],
          "type":"select",
          "optional":false,
          "mandatory":false,
        }
      ],
      "activeStatus":loadDataObj['usePurchasesAsSeed'],
      "labelInfo":this.translate.instant('ensembleAiComponentLables.enableUserPurchaseHistoryLbl'),
     }
      
    
  ],
  
  "viewmoreConfigOption":[
    {
      "name":this.translate.instant('ensembleAiComponentLables.styleIDlbl'),
      "id":"styleId",
      "value":loadDataObj['viewmoreConfigOption']['styleId'],
      "optional":true,
      "type":"input",
      "mandatory":false
    },
    {
      "name":this.translate.instant('ensembleAiComponentLables.chooseNumberOfPartsLbl'),
      "value":loadDataObj['viewmoreConfigOption']['numParts'] || 0,
      "id":"numParts",
      "defaultOption":[
        {"name":this.translate.instant('ensembleAiComponentLables.allPartsLbl'),"value":0},
        {"name":this.translate.instant('ensembleAiComponentLables.only3partsLbl'),"value":3},
        {"name":this.translate.instant('ensembleAiComponentLables.only4partsLbl'),"value":4},
        {"name":this.translate.instant('ensembleAiComponentLables.only5partsLbl'),"value":5}
        ,{"name":this.translate.instant('ensembleAiComponentLables.only6partsLbl'),"value":6}
      ],
      "optional":true,
      "type":"dropdown",
      "mandatory":false
    },
    {
      "name":this.translate.instant('ensembleAiComponentLables.xcludePartialEnsemblesLbl'),
      "id":"excludePartialOutfits",
      "value":loadDataObj['viewmoreConfigOption']['excludePartialOutfits'],
      "type":"checkbox",
      "mandatory":false,    
    }
  ],
"regionOption":[
  {
    "name":this.translate.instant('ensembleAiComponentLables.regionLbl'),
    "id":"region",
    "value":loadDataObj['regionOption']['region'],
    "optional":true,
    "type":"input",
    "mandatory":false,
    "infoIconEnable":false,
    "infoText":""
  },
  {
    "name":this.translate.instant('ensembleAiComponentLables.defaultEnsemblelbl'),
    "id":"defaultOutfit",
    "value":loadDataObj['regionOption']['defaultOutfit'],
    "optional":true,
    "type":"input",
    "mandatory":false,
    "infoIconEnable":true,
    "infoText":this.translate.instant('ensembleAiComponentLables.defaultEnsembleDetailsLbl')
  }
],
"additionalInputParams":loadDataObj['additionalInputParams'] // format [{"id":"","value":"","visible":true}];
  }
]



return sampleJsonObj;
}
  createLeftmenuMethod(){
    this.optionList =  [{
      tabActive:0,menuName:this.translate.instant('ensembleAiComponentLables.inputParameterslbl'),
    },
    {
      tabActive:1,menuName:this.translate.instant('ensembleAiComponentLables.layoutConfigurationLbl'),
    },
    {
      tabActive:2,menuName:this.translate.instant('ensembleAiComponentLables.blockConfigurationLbl'),
    }
  ];
    this.leftSideOptions = this.optionList;
  }

  insertDynamicContentMethod(){
  let isValid = this.checkForMandatoryFieldsMethod();
  if(isValid.length > 0){
    this.dataService.SwalAlertSuccesOrFailMgs(isValid[0].errorId+" "+this.translate.instant('ensembleAiComponentLables.valueCannotbeEmptyErrorMsgLbl') + " "+ this.translate.instant('ensembleAiComponentLables.pleaseEnterValidErrorInputNameLbl') + isValid[0].errorId,'warning');
    return;
  }else{
    let uuid = uuidv4();
    this.rowNameValue = this.randomNameService.generateRandomName("rowName-");  
    let ensemblesettings = {
      "productBrand": this.productDetailsObjJson[0],
      "productName": this.productDetailsObjJson[1],
      "productPrice": this.productDetailsObjJson[2],
      "width": this.widthHeightBorderObjJson[0].value,
      "height": this.widthHeightBorderObjJson[1].value,
      "borderradius": this.widthHeightBorderObjJson[2].value,
      "padding":this.widthHeightBorderObjJson[3].value,
      "rows": this.selectedNoofRows,
      "cols": this.selectedNoofColumns,
      "parts":this.finalResultLayoutPositioningMethod()
    }
    let paramsValObj = this.collectAllParametersValueObjMethod();
    let jsonString = this.saveEnsembleAIDataMethod(ensemblesettings,paramsValObj,this.addPramaAddtionalObjArray,this.noofEnsembles);
    
  let dynamicTemplateInsert = "<dynamic-content id='"+uuid+"' rowName='"+this.rowNameValue+"' type='eapi' layout='layout1' apiName='ensembled_api' freeStyle='false' maxCount='"+this.noofEnsembles+"' parameterValues='"+JSON.stringify(paramsValObj)+"' rowStyle='' ensembledSetting='"+JSON.stringify(ensemblesettings)+"' >";
   let imageSrc = this.baseUrl + '/resources/img/inApp/PreviewImage.png';
    
    let rowData = {
      0: {
        type: 'rowAddon',
        value: {
          name: 'Empty row',
          'background-color': '#ffffff',
          'display-condition': {
            type: 'api',
            label: 'API',
            description: '',
            before:
            dynamicTemplateInsert,
            after: '</dynamic-content>',
          },
          metadata: { selectedValue: JSON.stringify(jsonString),id:uuid },
          columns: [
            {
              weight: 12,
              modules: [
                {
                  type: 'image',
                  src: this.baseUrl + '/resources/img/inApp/PreviewImage.png',
                  dynamicSrc: '',
                }
              ],
            },
          ],
        },
      },
    };
    this.insertDynamicDataToActiveContent = rowData[0];
    this.onClose();
     if(this.isRowEditModeEnable) {
       this.onEdit.emit(this.insertDynamicDataToActiveContent);
     } else {
       this.onAdd.emit(this.insertDynamicDataToActiveContent);
     }
  }
    
  }
  onChangeOfProductIdMethod(evt,indx){
    let checkValid = this.eventOrValueInputMethod(evt,'checkbox');
    this.seedOptionDataArrayObj[0].seedOptions.forEach(q => q.activeStatus = false);
    this.seedOptionDataArrayObj[0].seedOptions.forEach(q => q.value = false);
    this.seedOptionDataArrayObj[0].seedOptionObjArray.forEach(p => p.activeStatus = false);
    this.seedOptionDataArrayObj[0].seedOptionObjArray.forEach(p => p.value = false);
    if(checkValid){      
      this.radioBtnActiveStatus = indx;
      this.seedOptionDataArrayObj[0].seedOptions[indx].activeStatus = true;
      this.seedOptionDataArrayObj[0].seedOptions[indx].value = true;
      this.seedOptionDataArrayObj[0].seedOptionObjArray[indx].activeStatus = true;
      this.noofSeedSelected = 1; // set default value when ever clicked.
    }else{
      this.radioBtnActiveStatus = indx;
      this.seedOptionDataArrayObj[0].seedOptions[indx].activeStatus = false;
      this.seedOptionDataArrayObj[0].seedOptions[indx].value = false;
      this.seedOptionDataArrayObj[0].seedOptionObjArray[indx].activeStatus = false;
    }
  }
ensembeledSettingsMethod(JSONObj){
  let obj = {
    "apiKey":JSONObj['keys']['apiKey'],
    "apiClientKey":JSONObj['keys']['apiClientKey'],
    "productBrand": JSONObj['productBrand'],
    "productName": JSONObj['productName'],
    "productPrice": JSONObj['productPrice'],
    "width": JSONObj['width'],
    "height": JSONObj['height'],
    "borderradius": JSONObj['borderradius'],
    "rows": JSONObj['rows'],
    "cols": JSONObj['cols'],
    "parts":JSONObj['parts']
  }
  return obj;
}
  saveEnsembleAIDataMethod(ensembleSettingsObj,paramsValueObj,additionInputparams,noofEnsembles){
    let seedProductIdEnabled:any;
    let viewedProductsEnabled:any;
    let purchasedProductsEnabled:any;
    if(paramsValueObj["seedProductId"]){
      seedProductIdEnabled = {"seed":paramsValueObj["seed"] || "","userId":paramsValueObj["userId"] }      
    }else{
      seedProductIdEnabled = {"seed":"","userId":"" }
    }
   if(paramsValueObj["useViewsAsSeed"]){
      viewedProductsEnabled = {"userId":paramsValueObj["userId"] || "","numOfSeeds":paramsValueObj["numOfSeeds"]};
      this.noofSeedSelected = paramsValueObj["numOfSeeds"];
    }else{
      viewedProductsEnabled = {"userId": "","numOfSeeds":"1"}
    }
     if(paramsValueObj["usePurchasesAsSeed"]){
      purchasedProductsEnabled = {"userId":paramsValueObj["userId"] || "","numOfSeeds":paramsValueObj["numOfSeeds"]};
      this.noofSeedSelected = paramsValueObj["numOfSeeds"];
    }else{
      purchasedProductsEnabled = {"userId":"","numOfSeeds":"1"}
    }
    let obj:any = {
      "apiKey":paramsValueObj["apiKey"] || ensembleSettingsObj['apiKey'],
      "apiClientKey":paramsValueObj["apiClientKey"] || ensembleSettingsObj['apiClientKey'],
      "seedProductId":paramsValueObj["seedProductId"],
      "useViewsAsSeed":paramsValueObj["useViewsAsSeed"],
      "usePurchasesAsSeed":paramsValueObj["usePurchasesAsSeed"],
      "seedProductIdSection":seedProductIdEnabled,
      "viewProductIdSection":viewedProductsEnabled,
      "purchaseHistoryIdSection":purchasedProductsEnabled,
      "viewMoreConfigFlagEnabled":this.viewMoreConfigFlagEnabled,
      "viewmoreConfigOption":{"styleId":paramsValueObj["styleId"] || "","numParts":paramsValueObj["numParts"] || 0,"excludePartialOutfits":paramsValueObj["excludePartialOutfits"] || ""},
      "regionOption":{"region":paramsValueObj["region"] || "","defaultOutfit":paramsValueObj["defaultOutfit"] || ""},
      "additionalInputParams":additionInputparams,
      "noofEnsemble":noofEnsembles || 1,
      "radioBtnActiveStatus":this.radioBtnActiveStatus,
      "noofSeedSelected": this.noofSeedSelected,
      "selectedItemOfParts":this.selectedItemOfParts,
      "tabsLayoutArray":this.tabsLayoutArray,
      "aiLayoutDataArray":this.AiLayoutDataArrayObj,
      "currentActivePartSelected":this.currentActivePartSelected
      }
      let finalObj = {
        ...obj,...ensembleSettingsObj
      }
    return finalObj;
  }
  onClose() {
    if(this.bsModalRef !== undefined) {
      this.bsModalRef.hide();
    }
  }
  blockEntering(evt){
    evt.preventDefault();
  }
  
}
