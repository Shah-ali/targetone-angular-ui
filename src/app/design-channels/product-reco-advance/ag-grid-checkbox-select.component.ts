import { Component, OnInit } from '@angular/core';
import { SharedataService } from '@app/core/services/sharedata.service';
import {ICellRendererAngularComp} from "ag-grid-angular";
@Component({
  selector: 'app-ag-grid-checkbox-select',
  template: `
  <div class="radio-container">
  <input type="checkbox" name="radio_{{params.node.id}}" [(checked)]="params.node.selected" class="checkboxGridSelected"  (click)="handleChange(params.node)">
</div>
  `,
  styles: [
  ]
})
export class AgGridCheckboxSelectComponent implements OnInit {
  selectedArrayListModel: any = [];
  selectionOccured: boolean = false;
  blockName: any;
  selectedArryObj: any;
  showEdit: any;
  constructor(private shareService:SharedataService) { 
    // this.shareService.selectedCheckedModelRecoProduct.subscribe((res:any) => {
    //   if(res !== undefined){
    //     this.blockName = res.blockName;
    //     this.selectedArryObj = res.arryObj;
    //     this.showEdit = res.editMode;
    //   }
    // });
  }
  public params: any;

  agInit(params: any): void {
      this.params = params;
      //   if(this.showEdit){ 
      //     //this.params.api.deselectAllFiltered();
      //     if(this.blockName === 'BRAND_MODEL'){
      //       this.showSelectedInputChecked(this.selectedArryObj,params,"PROD_SKU_BRAND_CODE");        
      //     }else if(this.blockName === 'CATEGORY_MODEL'){
      //       this.showSelectedInputChecked(this.selectedArryObj,params,"PROD_SKU_LEVEL1_CODE");      
      //     }else if(this.blockName === 'PROD_MODEL'){
      //       this.showSelectedInputChecked(this.selectedArryObj,params,"PRODUCT_CODE");         
      //     }
      //   else{
      //     if(this.selectionOccured){
      //       this.params.api.deselectAllFiltered();
      //     }          
      //   }
      // }else{
      //   this.params.api.deselectAllFiltered();
      // }
  }
  
  refresh(params):boolean{
    this.params.api.deselectAllFiltered();
    return true;
  }
  selectedHandleEvent(param){
    this.selectionOccured = true;
    this.params.node.setSelected(!this.params.node.selected);
    //this.params.context.OnchangeGridData(param,true,this.params);    
  }
  
  handleChange(param) {
    this.params.node.setSelected(!this.params.node.selected);    
    //this.shareService.sendParamsForDataModelProdReco.next(param);
    this.params.context.OnchangeGridData(param,false,this.params);
  }
  ngOnInit(): void {
  }

}
