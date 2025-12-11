import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-renderer',
  template: `
        <div class="smallFont {{pointerPoint}} {{color}} {{marginLeft}}" (click)="onClick(params)">{{label}}</div>
    `
})

export class ButtonRendererViewPerformanceComponent implements ICellRendererAngularComp {

  params;
  label: string = '';
  color: string = '';
  marginLeft: string = '';
  pointerPoint: string = '';

  agInit(params): void {
    this.params = params;
    if(this.params.data.headerLabel === undefined){
      this.color = 'linkColor';
      this.marginLeft = 'ml-3';
      this.pointerPoint = 'pointer';

    }else{
      this.color = 'default';
      this.marginLeft = '';
      this.pointerPoint = 'default';
    }
    this.label = this.params.value || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      }
      if(this.params.data.headerLabel === undefined){
        this.params.onClick(params);
      }
    }
  }
}