import { Component } from "@angular/core";
import { ITooltipAngularComp } from "ag-grid-angular";
import { ITooltipParams } from "ag-grid-community";

@Component({
  selector: "tooltip-component",
  template: ` <div class="custom-tooltip" [style.background-color]="color">
    <p><span>Description: </span>{{ data.ruleDesc }}</p>
  </div>`,
  styles: [
    `
      :host {
        position: absolute;
        width: 150px;
        height: 70px;
        pointer-events: none;
        transition: opacity 1s;
      }

      :host.ag-tooltip-hiding {
        opacity: 0;
      }

      .custom-tooltip {
        width: 200px;
        height: auto;
        border: 1px solid #d9d9d9;
        overflow: hidden;
        position: absolute;
        z-index: 999999;
        padding: 10px;
      }

      .custom-tooltip p {
        margin: 5px;
        font-size: 10px;
        color: #000;
        width: 100%;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .custom-tooltip p:first-of-type {
        font-weight: bold;
      }
    `,
  ],
})
export class CustomTooltip implements ITooltipAngularComp {
  private params!: { color: string } & ITooltipParams;
  public data!: any;
  public color!: string;

  agInit(params: { color: string } & ITooltipParams): void {
    this.params = params;

    this.data = params.api!.getDisplayedRowAtIndex(params.rowIndex!)!.data;
    this.color = this.params.color || "white";
  }
}
