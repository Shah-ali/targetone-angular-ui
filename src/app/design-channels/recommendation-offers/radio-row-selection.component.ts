import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedataService } from '@app/core/services/sharedata.service';
import {ICellRendererAngularComp} from "ag-grid-angular";
import { GlobalConstants } from '../common/globalConstants';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-radio-row-selection',
  template: `
  <div class="radio-container">
    <input type="radio" name="radio_api_row" value="{{this.selectedName}}" [(checked)]="params.node.selected" class="radioGridSelected" style="vertical-align: middle;" (click)="handleChange($event, params.node)" [disabled]="params.context.isMergedTagOffersDrawerOpen && params.context.isRowEditModeEnable">
  </div>`,
  styles: [
    `.radioGridSelected:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }`
  ]
})
export class RadioRowSelectionComponent implements ICellRendererAngularComp {
  apiNameSaved:any;
  blockName: any;
  selectedName: any;
  showEdit: any;
  selectionOccured: boolean = false;
  constructor(private shareService:SharedataService, private translate: TranslateService) {
    this.shareService.selectedRowCheckedbox.subscribe((res:any) => {
      if(Object.keys(res).length > 0 && res !== undefined){
        this.blockName = res.blockName;
        this.selectedName = res.name;
        this.showEdit = res.editMode;
      }
    });
   }
   public params: any;

    agInit(params: any): void {
        this.params = params;        
        if(this.showEdit){ 
        if(this.selectedName === params.data.apiName && this.blockName === 'api'){
          this.params.api.deselectAllFiltered();
          this.selectedHandleEvent(params);
        }else if(this.selectedName === params.data.modelName && this.blockName === 'dmeCustomer'){
          this.selectedHandleEvent(params);
        }else if(this.selectedName === params.data.modelName && this.blockName === 'dmeNonCustomer'){
          this.selectedHandleEvent(params);
        }else if(this.selectedName === params.data.placementName && this.blockName === 'productReco'){
          this.selectedHandleEvent(params);
        }else if(this.selectedName === params.data.modelName && this.blockName === 'dmeOffers'){
          this.selectedHandleEvent(params);
        }
        else{
          if(this.selectionOccured){
            this.params.api.deselectAllFiltered();
          }          
        }
      }else{
        this.params.api.deselectAllFiltered();
      }
    }

    refresh(params):boolean{
      return true;
    }
    selectedHandleEvent(param){
      this.selectionOccured = true;
      this.params.node.setSelected(!this.params.node.selected,true);
      this.params.context.onChangeApiNames(param,true);    
    }
    handleChange(event: Event, param: any): void {
      const deselectAndToggleSelection = () => {
        this.params.node.beans.selectionService.deselectAllRowNodes();
        this.params.node.setSelected(!this.params.node.selected, true);
        this.params.context.onChangeApiNames(param, false);
      };
    
      if (GlobalConstants.isRowEditModeEnable) {
        Swal.fire({
          titleText: this.translate.instant('apiPersonalization.changingDataSourceValidation'),
          showCancelButton: true,
          confirmButtonText: this.translate.instant('yes'),
          cancelButtonText: this.translate.instant('cancel'),
          allowOutsideClick: false,
          allowEscapeKey: false,
          customClass: {
            cancelButton: 'buttonCssStyle',
            confirmButton: 'buttonCssStyle',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            deselectAndToggleSelection();
          } else {
            (event.target as HTMLInputElement).checked = false;

            const previousSelection = document.querySelector(
              `input[name="radio_api_row"][value="${this.selectedName}"]`
            ) as HTMLInputElement;
      
            if (previousSelection) {
              previousSelection.checked = true;
            }
          }
        });
      } else {
        deselectAndToggleSelection();
      }
    }
  ngOnInit(): void {
  }

}
