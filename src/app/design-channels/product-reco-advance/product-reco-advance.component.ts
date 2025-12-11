import { Component, OnInit,Input,ViewChild,HostListener,Output,EventEmitter,ElementRef} from '@angular/core';
import { TreeviewItem,TreeviewConfig, TreeItem, TreeviewI18n} from 'ngx-treeview';
import { HttpService } from '@app/core/services/http.service';
import { AppConstants } from '@app/app.constants';
import { DataService } from '@app/core/services/data.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { GlobalConstants } from '../common/globalConstants';
import { AgGridAngular } from "ag-grid-angular";
import { ColDef, GetRowIdFunc, GetRowIdParams, ICellRendererParams,IDatasource, IGetRowsParams, GridOptions, GridApi } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import { AgGridCheckboxSelectComponent } from './ag-grid-checkbox-select.component';
import { Clipboard } from '@angular/cdk/clipboard';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { LoadModelApi } from './load-model-api';
import { DefaultTreeviewI18n } from '../default-treeview-i18n';

@Component({
  selector: 'app-product-reco-advance',
  templateUrl: './product-reco-advance.component.html',
  styleUrls: ['./product-reco-advance.component.scss'],
  providers: [
    { provide: TreeviewI18n, useClass: DefaultTreeviewI18n }
  ]
})
export class ProductRecoAdvanceComponent implements LoadModelApi {
  basicAdvanceEnabled:boolean = true;
  @Output() basicAdvanceVal = new EventEmitter<any>();
  @Output() backToTipicalFromAdvance = new EventEmitter<any>();
  @Output() modelDataCollection = new EventEmitter<any>();
  @ViewChild('myAgGrid') agGridElementRef = ElementRef;
  //@Input() basicTypeSelected: boolean = false;
  getData!: (params: IGetRowsParams) => Observable<{ data; totalRecords }>;
  getDataError?: (err) => void;
  gridApi!: GridApi;
  remoteGridBinding = this;
  advanceDetailsPage:boolean = false;  
  values!: number[];
  items!: TreeviewItem[];
  configuration = TreeviewConfig.create({
    hasAllCheckBox:false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500
  });
  customBootstrapStyle:any = ['btn btn-outline-primary buttonStyle shadow-none']
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular; 
  @ViewChild('mergeTagsListData', {static: false }) mergeTagsListData!: ElementRef;
  promotionKey: any;
  currentSplitId: any;
  commChannelKey: any;
  mergeTagDataItems: any;
  defaultViewDataModel:boolean = false;
  modelName:any='';
  colHeaderName:any="Brand";
  fieldNameInAgGrid:any = "";
  columnHeadersRuleReco: ColDef[] = [];
  selctedDataJsonObj: any;
  rowSelection:any = 'multiple';
  modelDataListsArry: any = [];
  brandModel:any = 'BRAND_MODEL';
  categoryModel:any = 'CATEGORY_MODEL';
  productModel:any = 'PROD_MODEL';
  brandModelDataObj: any;
  categoryModelDataObj: any;
  productModelDataObj: any;
  valueSelected: any;
  collectSelectedData: any = [];
  brandInputContent: any;
  selectedArrayListModel: any = [];
  categoryInputContent: any;
  productInputContent: any;
  selectedModelIs: any;
  showContentAgGrid: boolean = false;
  agGridParams: any;
  brandSelctedListArry: any;
  categorySelctedListArry: any;
  productSelctedListArry: any;
  includeBrand: boolean = true;
  excludeBrand: boolean = false;
  excludePrice: boolean = false;
  includePrice: boolean = true;
  excludeCategory: boolean = false;
  includeCategory: boolean = true;
  excludeProduct: boolean = false;
  includeProduct: boolean = true;
  minPriceVal:any;
  maxPriceVal:any;
  advanceChecked: boolean = false;
  basicChecked: boolean = true;
  copiedDivEnabled:boolean = false;
  copiedTextFormMergeTag: any;
  fieldCodeId: any;
  showLoader:boolean = false;
  keyValueArray: any[] = [{key: '', value: '', add: true}];
  isPersonalizeTagMode: boolean = false;
  tagKey: any;
  browseActiveStage: boolean = GlobalConstants.browseProdActiveEnable;
  pageIndex:any = 1;
  prodRecoSelectedModelObj: any;
  showLoaderAgGrid: boolean = false;
  // @HostListener('document:click', ['$event.target'])
  //     clickout(event) {
  //       if(event.className.includes('ag-icon ag-icon-last')){
  //         this.newDataLoadCallMethod();
  //         this.showLoader = false; 
  //       }
  //       // if(event.className.includes('ag-icon ag-icon-next')){
  //       //   if(this.gridApi.paginationGetCurrentPage()+1 === this.gridApi.paginationGetTotalPages()){
  //       //     this.newDataLoadCallMethod();
  //       //     this.showLoader = false; 
  //       //   }
  //       // }
  //     }
      
  constructor(private httpService: HttpService,
    private dataService: DataService,
    private shareService: SharedataService,
    private translate: TranslateService,
    private clipboard: Clipboard
   ) {
    this.agGridLocaleLabels = {
      "to": this.translate.instant('agGridLocaleLabels.to'),
      "of": this.translate.instant('agGridLocaleLabels.of'),
      "page": this.translate.instant('agGridLocaleLabels.page'),    
    };
    this.tagKey = this.dataService.activeContentTagKey;//localStorage.getItem('tagKeyPersonalization');
    this.dataService.$sharedPromoKey.subscribe((result) => {
      this.promotionKey = result;
    });
    this.shareService.currentSelectedChannelObj.subscribe((res: any) => {
      this.currentSplitId = res.currentSplitId;
      this.commChannelKey=res.commChannelKey;
    });
    this.shareService.sendParamsForDataModelProdReco.subscribe((res:any) => {
      this.shareService.personalizeTagService.subscribe((result) => {
        this.isPersonalizeTagMode = result;
      });

      if(this.browseActiveStage){
        this.basicAdvanceEnabled = false;
      }
      
      
      if(Object.values(res).length > 0){
        if(res.selected){
          this.selectedArrayListModel.push(res.data);
         //this.selectedArrayListModel.splice(res.rowIndex,0,res.data);
        }else{
          this.selectedArrayListModel.splice(res.rowIndex,1);
        } 
        if(this.selectedModelIs === 'BRAND_MODEL'){
          this.brandSelctedListArry = this.selectedArrayListModel;
          if(!res.selected){
            this.addSelectedModelToInputMethod();
          }
        }else if(this.selectedModelIs === 'CATEGORY_MODEL'){
          this.categorySelctedListArry = this.selectedArrayListModel;
          if(!res.selected){
            this.addSelectedModelToInputMethod();
          }
        }else if(this.selectedModelIs === 'PROD_MODEL'){
          this.productSelctedListArry = this.selectedArrayListModel;
          if(!res.selected){
            this.addSelectedModelToInputMethod();
          }
        }
          
        this.selctedDataJsonObj = this.selectedArrayListModel;
      }
     });
     this.dataService.prodRecoSelectedModelObj.subscribe(res => {
      if(res !== undefined){
        this.prodRecoSelectedModelObj = res.modelData;  
        this.selectedProdModels(res.modelData);      
      }
     });
     this.shareService.paramsForAgGrid.subscribe((res:any) => {
      if(res !== undefined){
        this.agGridParams = res;
      }
     })
     
     setTimeout(() => {
      if(this.browseActiveStage){        
       this.selectProductRecoType(2); 
       this.basicAdvanceEnabled = false;
       //this.loadData();
       this.getMergeTagData();
      }else{
        if(this.advanceChecked){
          // edit mode backward move
          this.selectProductRecoType(2); 
        }else{
          this.selectProductRecoType(1); 
        }
       
      }
     }, 500);
    //this.getMergeTagData();
   // this.getModelTypeData('BRAND_MODEL');
   }
//    @HostListener('document:click', ['$event.target'])
//    clickout(event) {        
//      if(event.className.includes('checkboxGridSelected')){
//       var rowId = event.name;      
      
//      }
// }
agGridLocaleLabels:any = {
  "to": "",
  "of": "",
  "page": "",
};

public localeText: {
  [key: string]: any;
} = this.agGridLocaleLabels;
public defaultColDef: ColDef  = {
 flex: 1,
 minWidth: 100,
 sortable: true,
 cellStyle:{"outline":"none","text-align":"left"},
};
public getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.id;
  ngOnInit(): void {
    
    
  }
  selectedProdModels(selModels:any){
    if(selModels !== undefined){
      Object.keys(selModels).forEach((key,value:any) => {
        if(key == 'brand'){
          // let objVal:any = value;
           this.brandInputContent = selModels[key].selectedValues;
           if(selModels[key].includes){
            this.includeBrandMethod(1);
           }else{
            this.includeBrandMethod(0);
           }       
         }else if(key == 'product'){
           this.productInputContent = selModels[key].selectedValues;
           if(selModels[key].includes){
            this.includeProductMethod(1);
           }else{
            this.includeProductMethod(0);
           }
         }else if(key == 'category'){
           this.categoryInputContent = selModels[key].selectedValues;
           if(selModels[key].includes){
            this.includeCategoryMethod(1);
           }else{
            this.includeCategoryMethod(0);
           }
         }else if(key == 'price'){;''
           this.minPriceVal = selModels[key].priceMax;
           this.maxPriceVal = selModels[key].priceMin;
         }else if(key == 'extraParameters'){
           this.keyValueArray = selModels[key];
         }
      });
    }   
      // console.log(`${key}: ${value}`);
      
    
  }
  // Key Value Pair
  addNewKeyValue(item:any): void {
    if(this.keyValueArray.length >= AppConstants.MOBILE_PUSH_RANGE.MIN && this.keyValueArray.length < AppConstants.MOBILE_PUSH_RANGE.MAX) {
      item.add = false;
      if(this.keyValueArray.length === 4) {
        this.keyValueArray.push({key: '', value: '', add: false});
      } else {
        this.keyValueArray.push({key: '', value: '', add: true});
      }
    }
  }
  removeKeyValue(item:any): void {
    if(this.keyValueArray.length <= AppConstants.MOBILE_PUSH_RANGE.MAX) {
      let index = this.keyValueArray.indexOf(item);
      this.keyValueArray.splice(index, 1);
      this.keyValueArray[this.keyValueArray.length - 1].add = true;
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
  
  getMergeTagData(){
    let url: string;
    const commonParams = '&prod=true&dme=false';
    const baseUrl = AppConstants.API_END_POINTS.GET_DME_MERGE_TAG_OBJ;

    if (this.isPersonalizeTagMode) {
      url = `${baseUrl}?tagKey=${this.tagKey}&wa=true${commonParams}`;
    } else {
      url = `${baseUrl}?promoKey=${this.promotionKey}&splitKey=${this.currentSplitId}&wa=false${commonParams}`;
    }

    this.httpService
      .post(url).subscribe((data) => {
        if(data.status === 'SUCCESS'){
          this.mergeTagDataItems = JSON.parse(data.response).root;
          this.loadData();
          console.log(this.mergeTagDataItems);
        }
      });
  }
  getModelTypeData(model){ 
    this.showLoader = true;   
    let url = AppConstants.API_END_POINTS.GET_DIM_MODEL_DATA_OBJ+"modelname="+model+"&pageIndex=1";
    this.httpService
      .post(url).subscribe((data) => {
        if(data.status === 'SUCCESS'){
          this.showLoader = false;
          if(model === 'BRAND_MODEL'){
            this.selectedModelIs = model;
            this.defaultViewDataModel = false;
            this.showContentAgGrid =true;
            this.selectedArrayListModel = [];
            this.fieldNameInAgGrid = "PROD_SKU_BRAND_DESC";
            this.fieldCodeId = "PROD_SKU_BRAND_CODE";
            this.columnHeadersRuleReco = [
              { field: "checkbox",headerName:'',maxWidth:50,cellStyle:{"text-align":"center"},
              cellRenderer: AgGridCheckboxSelectComponent,
              cellRendererParams: { context: this }
             },              
              { field: this.fieldNameInAgGrid,headerName:this.colHeaderName,maxWidth:400,tooltipField:this.fieldNameInAgGrid},
              { field: this.fieldCodeId,headerName:"Code",maxWidth:400,tooltipField:this.fieldCodeId},
            ];
            if(this.agGridParams.api !== undefined){
              this.agGridParams.api.deselectAll()
            }  
            this.colHeaderName = "Brand";
            this.brandModelDataObj = data.response.data;
            this.modelDataListsArry = data.response.data;            
            this.pageTypeMethod();
           // this.shareService.selectedCheckedModelRecoProduct.next({arryObj:undefined,blockName:model,editMode:false});
            //this.fetchSelectedModelMethod(this.brandSelctedListArry,model);
          }else if(model === 'CATEGORY_MODEL'){
            this.selectedModelIs = model;
            this.defaultViewDataModel = false;
            this.showContentAgGrid =true;
            this.selectedArrayListModel = [];
            this.colHeaderName = "Category";
            this.fieldNameInAgGrid = "PROD_SKU_LEVEL1_DESC";
            this.fieldCodeId = "PROD_SKU_LEVEL1_CODE";
            this.columnHeadersRuleReco = [
              { field: "checkbox",headerName:'',maxWidth:50,cellStyle:{"text-align":"center"},
              cellRenderer: AgGridCheckboxSelectComponent,
              cellRendererParams: { context: this }
             },              
              { field: this.fieldNameInAgGrid,headerName:this.colHeaderName,maxWidth:400,tooltipField:this.fieldNameInAgGrid},
              { field: this.fieldCodeId,headerName:"Code",maxWidth:400,tooltipField:this.fieldCodeId},
            ];
            if(this.agGridParams.api !== undefined){
             this.agGridParams.api.deselectAll()              
            }           
            this.categoryModelDataObj = data.response.data;
            this.modelDataListsArry = data.response.data;
            this.pageTypeMethod();
            //this.shareService.selectedCheckedModelRecoProduct.next({arryObj:undefined,blockName:model,editMode:false});
            //this.fetchSelectedModelMethod(this.categorySelctedListArry,model);
          }else if(model === 'PROD_MODEL'){
            this.selectedModelIs = model;
            this.defaultViewDataModel = false;
            this.showContentAgGrid =true;
            this.selectedArrayListModel = [];
            this.colHeaderName = "Product";
            this.fieldNameInAgGrid = "PRODUCT_NAME";
            this.fieldCodeId = "PRODUCT_CODE";
            this.columnHeadersRuleReco = [
              { field: "checkbox",headerName:'',maxWidth:50,cellStyle:{"text-align":"center"},
              cellRenderer: AgGridCheckboxSelectComponent,
              cellRendererParams: { context: this }
             },              
              { field: this.fieldNameInAgGrid,headerName:this.colHeaderName,maxWidth:400,tooltipField:this.fieldNameInAgGrid},
              { field: this.fieldCodeId,headerName:"Code",maxWidth:400,tooltipField:this.fieldCodeId},
            ];
            if(this.agGridParams.api !== undefined){
              this.agGridParams.api.deselectAll()
            }  
            this.productModelDataObj = data.response.data;
            this.modelDataListsArry = data.response.data;
           this.pageTypeMethod();
          //  this.shareService.selectedCheckedModelRecoProduct.next({arryObj:undefined,blockName:model,editMode:false});
          //  this.fetchSelectedModelMethod(this.productSelctedListArry,model);
          }          
          
          console.log(data.response);
        }else{
          this.showLoader = false;
        }
        
      });
  }
  
  swapSelectedModelTopMethod(editModel){
    let initialModel = this.modelDataListsArry[0];
    let swapModel = this.modelDataListsArry.filter(x => x.modelName == editModel.modelName);
    let indxModel = this.modelDataListsArry.findIndex(x => x.modelName == editModel.modelName);
    this.modelDataListsArry[0] = swapModel[0];
    this.modelDataListsArry[indxModel] = initialModel;
  }
  pageTypeMethod(){
           //this.agGridParams.api.deselectAll();
           if(this.modelDataListsArry.length > 0){
             this.modelDataListsArry.forEach((element:any,i) => {
               element['id']= i+1;
             });
           }
   }
   //{
  //   //         value: 91,
  //   //         children: [
  //   //           {
  //   //             text: "Frontend",
  //   //             value: 911,
  //   //             children: [
  //   //               { text: "Angular 1", value: 9111 },
  //   //               { text: "Angular 2", value: 9112 },
  //   //               { text: "ReactJS", value: 9113 },
  //   //             ],
  //   //           },
//}
  
 
  getHierarchcategories(): TreeviewItem[] {
    const companydata = new TreeviewItem({...this.mergeTagDataItems});
    return [companydata];
}
loadData(){
  this.items = this.getItems(this.mergeTagDataItems);
  this.basicAdvanceEnabled =false;
  this.advanceDetailsPage = true;
  this.defaultViewDataModel = true;
  setTimeout(() => {
    this.resetCheckedFalseInMergeTag();    
  }, 500);
}
resetCheckedFalseInMergeTag(){
  let dropdownEMl:any = this.mergeTagsListData;   
  dropdownEMl.buttonLabel = this.translate.instant('recommendationComponent.CopyFromMergeTags');    
    dropdownEMl.items.forEach(item => {
      item.checked = false;
      item.internalCollapsed = true;
      if(item["internalChildren"] !== undefined){
        item["internalChildren"].forEach(item => { 
          item.checked = false; 
          item.internalCollapsed = true;
          if(item["internalChildren"] !== undefined){
            item["internalChildren"].forEach(item => {
              item.checked = false; 
              item.internalCollapsed = true;
            });
          }
        })
      }      
    });
}
getItems(parentChildObj: any[]) {
  let itemsArray: TreeviewItem[] = [];
  parentChildObj.forEach((set: TreeItem) => {
    if(set.children != undefined) {
      itemsArray.push(new TreeviewItem(set,true))
    }
  });
  return itemsArray;
}
  // onSelectedChange(evt){
  //   this.valueSelected = evt.value;
  //   console.log(evt);
  // }
  onSelectedChange(item): void {
    if(item.length == 1 && item.length != 0 && item[0] !== ""){
      this.copyText("{"+item+"}");      
      this.copiedDivEnabled = true;
      setTimeout(() => {
        this.copiedDivEnabled = false;
      }, 1500);
      this.resetCheckedFalseInMergeTag();
    }else{      
      this.resetCheckedFalseInMergeTag();
    }
  }
  copyText(textToCopy: string) {
    this.clipboard.copy(textToCopy);
  }
  // copyText(val: string){
  //   this.copiedTextFormMergeTag = val;
  //   let selBox = document.createElement('textarea');
  //     selBox.style.position = 'fixed';
  //     selBox.style.left = '0';
  //     selBox.style.top = '0';
  //     selBox.style.opacity = '0';
  //     selBox.value = val;
  //     document.body.appendChild(selBox);
  //     selBox.focus();
  //     selBox.select();
  //     document.execCommand('copy');
  //     document.body.removeChild(selBox);
  //   }
  selectProductRecoType(type){
    if(type == 1){ // basic Type
      this.basicAdvanceEnabled = true;
      this.advanceDetailsPage = false;
      this.basicChecked =true;
      this.advanceChecked =false; 
      this.basicAdvanceVal.emit({basic:true,advance:false});
    }else{ // Advance Type
      this.defaultViewDataModel = false;
      this.basicAdvanceEnabled = true;  
      this.advanceChecked =true; 
      this.basicChecked =false;

      this.basicAdvanceVal.emit({basic:false,advance:true});       
    }
  }
  goToAdvancePage(){
    this.backToTipicalFromAdvance.emit(this.basicChecked);
  }
  addSelectedModelToInputMethod(){
    let modelName:any;
    if(this.selectedModelIs === 'BRAND_MODEL'){
      modelName = 'PROD_SKU_BRAND_CODE';
      this.collectSelectedData = [];
      this.displaySelectedItems(this.brandSelctedListArry,modelName);
    }else if(this.selectedModelIs === 'PROD_MODEL'){
      modelName = "PRODUCT_CODE" ;
      this.collectSelectedData = [];
      this.displaySelectedItems(this.productSelctedListArry,modelName);
    }else if(this.selectedModelIs === 'CATEGORY_MODEL'){
      modelName = "PROD_SKU_LEVEL1_CODE" ;
      this.collectSelectedData = [];
      this.displaySelectedItems(this.categorySelctedListArry,modelName);
    } 
    

  }
  includeBrandMethod(type){
    if(type === 1){
      this.includeBrand = true;
      this.excludeBrand = false;
    }else{
      this.includeBrand = false;
      this.excludeBrand = true;
    }
  }
  includeProductMethod(type){
    if(type === 1){
      this.includeProduct = true;
      this.excludeProduct = false;
    }else{
      this.includeProduct = false;
      this.excludeProduct = true;
    }
  }
  includeCategoryMethod(type){
    if(type === 1){
      this.includeCategory = true;
      this.excludeCategory = false;
    }else{
      this.includeCategory = false;
      this.excludeCategory = true;
    }
  }
  includePriceMethod(type){
    if(type === 1){
      this.includePrice = true;
      this.excludePrice = false;
    }else{
      this.includePrice = false;
      this.excludePrice = true;
    }
  }
  
  displaySelectedItems(selObj,modelName){
    if(selObj !== undefined){
      selObj.forEach((element:any,i) =>{
        let insertItem = "{"+element[modelName]+"}";
        this.collectSelectedData.push(insertItem);
        let toStr = this.collectSelectedData.toString();
        if(this.selectedModelIs === 'BRAND_MODEL'){
          this.brandInputContent = toStr;
        }else if(this.selectedModelIs === 'PROD_MODEL'){
          this.productInputContent = toStr;
        }else if(this.selectedModelIs === 'CATEGORY_MODEL'){
          this.categoryInputContent = toStr;
        }
        
      });
      this.collectDataForAdvance();
    
  }
}
collectDataForAdvance(){
  let dataObj = {
    brand:{
      includes:this.includeBrand,
      selectedValues:this.brandInputContent || ""     
    },
    product:{
      includes:this.includeProduct,
      selectedValues:this.productInputContent || ""
    },
    category:{
      includes:this.includeCategory,
      selectedValues:this.categoryInputContent || ""
    },
    price:{
      includes:this.includePrice,
      priceMin:this.minPriceVal,
      priceMax:this.maxPriceVal
    },
    extraParameters:this.keyValueArray
    
  }
  this.modelDataCollection.emit(dataObj);
  //console.log(dataObj);
}
clearModelDataSelected(modelType){
    if(modelType === 'BRAND_MODEL'){
      this.brandInputContent = "";
      this.brandSelctedListArry = [];
    }else if(modelType === 'PROD_MODEL'){
      this.productInputContent = "";
      this.productSelctedListArry = [];
    }else if(modelType === 'CATEGORY_MODEL'){
      this.categoryInputContent = "";
      this.categorySelctedListArry = [];
    }
    this.collectSelectedData = [];  
    this.agGridParams.api.deselectAll();
  }
  paginationChangeMethod(evtObj){
    this.fetchSelectedModelMethod(evtObj);
    if(evtObj.newPage){
      if(this.modelDataListsArry.length > 0 && evtObj.api.paginationProxy.bottomDisplayedRowIndex != -1){
        if(this.modelDataListsArry.length == evtObj.api.paginationProxy.bottomDisplayedRowIndex+1){
          if(this.pageIndex >= 1){
            this.newDataLoadCallMethod();
          }        
          }
      }  
    }      
  }
  fetchSelectedModelMethod(params){    
    params.api.deselectAllFiltered(); // before selection clear the old selected.
    if(this.selectedModelIs === 'PROD_MODEL'){
      //this.shareService.selectedCheckedModelRecoProduct.next({arryObj:dataModelObj,blockName:model,editMode:true});
      this.showSelectedInputChecked(this.productSelctedListArry,params,"PRODUCT_CODE");
    }else if(this.selectedModelIs === 'CATEGORY_MODEL'){
      //this.shareService.selectedCheckedModelRecoProduct.next({arryObj:dataModelObj,blockName:model,editMode:true});
      this.showSelectedInputChecked(this.categorySelctedListArry,params,"PROD_SKU_LEVEL1_CODE");
    }else if(this.selectedModelIs === 'BRAND_MODEL'){
      // setTimeout(() => {
      //   this.shareService.selectedCheckedModelRecoProduct.next({arryObj:dataModelObj,blockName:model,editMode:true});
      // }, 500);         
      this.showSelectedInputChecked(this.brandSelctedListArry,params,"PROD_SKU_BRAND_CODE");
    }        

}
  
  showSelectedInputChecked(arryObjSelected,params,columnName){
    if(arryObjSelected !== undefined){
      if(arryObjSelected.length > 0){
        arryObjSelected.forEach((item,i) => {
          if(item[columnName] == params.api.getRenderedNodes()[i].data.PROD_SKU_BRAND_CODE){
            params.api.getRenderedNodes()[i].setSelected(true);
          }
        });
      }else{
        params.api.deselectAllFiltered();
      }
    }    
  }
  
  OnchangeGridData(param,isEdit,node){
    if(isEdit){
      if(param.selected){
        this.selectedArrayListModel.push(param.data);
       //this.selectedArrayListModel.splice(res.rowIndex,0,res.data);
      }else{
        let inxOfDel = this.selectedArrayListModel.findIndex(x => x.id == param.rowIndex);
        this.selectedArrayListModel.splice(inxOfDel,1);
      } 
    }else{
      if(param.selected){
        this.selectedArrayListModel.push(param.data);
       //this.selectedArrayListModel.splice(res.rowIndex,0,res.data);
      }else{
        let inxOfDel = this.selectedArrayListModel.findIndex(x => x.id == param.rowIndex);
        this.selectedArrayListModel.splice(inxOfDel,1);
      } 
    }    
    if(this.selectedModelIs === 'BRAND_MODEL'){
      this.brandSelctedListArry = this.selectedArrayListModel;
      // if(!res.selected){
      //   this.addSelectedModelToInputMethod();
      // }
    }else if(this.selectedModelIs === 'CATEGORY_MODEL'){
      this.categorySelctedListArry = this.selectedArrayListModel;
      // if(!res.selected){
      //   this.addSelectedModelToInputMethod();
      // }
    }else if(this.selectedModelIs === 'PROD_MODEL'){
      this.productSelctedListArry = this.selectedArrayListModel;
      // if(!res.selected){
      //   this.addSelectedModelToInputMethod();
      // }
    }
      
    this.selctedDataJsonObj = this.selectedArrayListModel;
  }
  newDataLoadCallMethod() {
    this.showLoaderAgGrid = true; 
    let pageIndx = this.pageIndex + 1;
    this.pageIndex = pageIndx;
    let endpoint = AppConstants.API_END_POINTS.GET_DIM_MODEL_DATA_OBJ+"modelname="+this.selectedModelIs+"&pageIndex="+this.pageIndex;
    this.httpService.post(endpoint).subscribe(data => {
      if(data !== undefined){
        let addNewData = data.response.data;
        if(addNewData !== undefined){          
          //this.modelDataListsArry = this.modelDataListsArry.concat(addNewData);
          let newArray = this.modelDataListsArry;
           newArray = [...newArray, ...addNewData];
          this.modelDataListsArry = [];
          setTimeout(() => {
            this.showLoaderAgGrid = false; 
            this.modelDataListsArry = newArray;
          }, 100);
        }        
      }else{
        this.showLoaderAgGrid = false; 
      }
    });
  }
  onGridReady(params) {
    this.gridApi = params.api;
  }
}
