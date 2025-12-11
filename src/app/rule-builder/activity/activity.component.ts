import { Component, OnInit } from "@angular/core";
import { AppConstants } from "@app/app.constants";
import { HttpService } from "@app/core/services/http.service";
import { SharedataService } from "@app/core/services/sharedata.service";
import { environment } from "@env/environment";
import { AgGridAngular } from "ag-grid-angular";
import { ColDef, FirstDataRenderedEvent } from "ag-grid-community";
import { CustomTooltip } from "./custom-tooltip.component";
import { ruleBuilderData } from "assets/JSON/ruleBuilder.json";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-activity",
  templateUrl: "./activity.component.html",
  styleUrls: ["./activity.component.scss"],
})
export class ActivityComponent implements OnInit {
  private BASE_URL = environment.BASE_URL;
  isRuleBuilderActivity: boolean = true;
  rowData: any = [];
  agGridLocaleLabels:any = {
    "to": "",
    "of": "",
    "page": "",
    "noRowsToShow": ""
  };
  public localeText: {
    [key: string]: any;
  } = this.agGridLocaleLabels;
  constructor(private shareService: SharedataService, private httpService: HttpService, private translate: TranslateService) {
    this.agGridLocaleLabels = {
      "to": this.translate.instant('agGridLocaleLabels.to'),
      "of": this.translate.instant('agGridLocaleLabels.of'),
      "page": this.translate.instant('agGridLocaleLabels.page'),
      "noRowsToShow": this.translate.instant('agGridLocaleLabels.noRowsToShow')
    };
    this.shareService.ruleBuilder.next(this.isRuleBuilderActivity);
  }
  
  columnDefs: ColDef[] = [
    { field: "ruleName", headerName: "Rule name", resizable: true, sortable: true, cellStyle: { color: "#026FE9" }, width: 200 },
    {
      field: "ruleDesc",
      headerName: "Rule description",
      width: 150,
      cellClass: "textAlignCenter",
      headerClass: "textAlignCenter",
      cellRenderer: ({ params }) => `<img src="assets/images/info-icon.svg">`,
      tooltipField: "ruleDesc",
      tooltipComponentParams: { color: "#fff" },
    },
    { field: "status", headerName: "Status", width: 150 },
    { field: "dataset", headerName: "Dataset", width: 100, cellClass: "textAlignCenter", headerClass: "textAlignCenter" },
    { field: "activityType", headerName: "Activity type", width: 150 },
    { field: "createdBy", headerName: "Created by", width: 150 },
    { field: "validTill", headerName: "Valid till", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      cellClass: "textAlignCenter",
      headerClass: "textAlignCenter",
      cellRenderer: ({}) =>
        `<div class="icon-ctr mutton-icon-style"><img class="mutton-menu-icon"  src="assets/images/mutton-icon.svg"></div>`,
    },
  ];

  //rowData = ruleBuilderData;

  public defaultColDef: ColDef = {
    editable: false,
    sortable: false,
    flex: 1,
    minWidth: 100,
    filter: false,
    resizable: false,
    tooltipComponent: CustomTooltip,
  };

  imageCellRenderer(params) {
    console.log(params);
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  openActionDetailsMenu(event: any) {
    let target = event.event.target;
    //console.log(event);

    if (event.column.getColId() == "actions" || event.column.getColId() == "dataset") {
      let menuCtr;
      if(event.column.getColId() == "actions") {
        menuCtr = document.getElementById("actionDetailsCtr");
      } else {
        menuCtr = document.getElementById("dataSetDetailsCtr");
      }
      menuCtr?.classList.remove("hide");
      let position: any = {
        x: "",
        y: "",
      };
      let targetRect = target.getBoundingClientRect();
      if (event.column.getColId() == "actions") {
        position.x = targetRect.x + targetRect.width / 2;
        position.y = targetRect.top + targetRect.height;
      } else if(event.column.getColId() == "dataset") {
        position.x = targetRect.x + targetRect.width+50 ;
        position.y = targetRect.top + targetRect.height-120;
      } else {
        position.x = targetRect.x + targetRect.width ;
        position.y = targetRect.top + targetRect.height;
      }

      let menuWidth;
      if(event.column.getColId() == "actions") {
        menuWidth = document.getElementById("actionDetailsCtr")!.clientWidth;
      } else {
        menuWidth = document.getElementById("dataSetDetailsCtr")!.clientWidth;
      }

      menuCtr!.style.left = parseInt(position.x) - menuWidth + "px";
      menuCtr!.style.top = position.y + "px";
    } else {
      let menuCtr = document.getElementById("actionDetailsCtr");
      menuCtr?.classList.add("hide");

      let dCtr = document.getElementById("dataSetDetailsCtr");
      dCtr?.classList.add("hide");
    }
  }

  ngOnInit(): void {
    this.httpService.post('/ruleBuilder/getActivitySummary').subscribe(res => {
      this.rowData = JSON.parse(res.response)
    });
  }

  getRowClass = (params: any) => {
    if (params.node.rowIndex % 2 === 0) {
      return "agGridRowStyling";
    } else return "applyBackground";
  };

  createRuleBuilder(): void {
    // this.httpService.get(AppConstants.API_END_POINTS.CREATE_RULE_BUILDER).subscribe((data) => {
    //   window.open(`${this.BASE_URL}/triggerPromo/promoWizRedirectToEditPage?url=updateTriggerForm`, '_parent');
    // });
    window.open(`${this.BASE_URL}/ruleBuilder/createRuleBuilder`, '_parent');
  }
}
