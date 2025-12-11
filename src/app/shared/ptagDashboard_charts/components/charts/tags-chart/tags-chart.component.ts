import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { GraphService } from '@app/core/services/graph.service';
import { TranslateService } from '@ngx-translate/core';

echarts.use([BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent]);

@Component({
  selector: 'app-tags-chart',
  template: `
  <div class="row">
  <div class="col-12">
    <div class="ptags-content-graph rounded-5 chart-box">
      <div class="heading">
      {{'header.personalisationTags.top10ActiveContentOpenlbl'|translate}}
      </div>
      <div class="chart-area">
        <div echarts [options]="optionsOpens" class="echarts-container"></div>
        <div class="ml-auto pagination" *ngIf="totalItemsOpens > pageSizeOpens">
          <ngb-pagination [collectionSize]="totalItemsOpens" [(page)]="currentPageOpens" [pageSize]="pageSizeOpens"
            aria-label="Pagination" (pageChange)="onPageChange($event, 'Opens')"></ngb-pagination>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="row">
  <div class="col-12">
    <div class="ptags-content-graph rounded-5 chart-box">
      <div class="heading">
      {{'header.personalisationTags.top10ActiveContentClicklbl'|translate}}
      </div>
      <div class="chart-area">
        <div echarts [options]="optionsClicks" class="echarts-container"></div>
        <div class="ml-auto pagination" *ngIf="totalItemsClicks > pageSizeClicks">
          <ngb-pagination [collectionSize]="totalItemsClicks" [(page)]="currentPageClicks" [pageSize]="pageSizeClicks"
            aria-label="Pagination" (pageChange)="onPageChange($event, 'Clicks')"></ngb-pagination>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="row">
  <div class="col-12">
    <div class="ptags-content-graph rounded-5 chart-box">
      <div class="heading">
      {{'header.personalisationTags.top10ActiveContentUsagelbl'|translate}}
      </div>
      <div class="chart-area">
        <div echarts [options]="optionsUage" class="echarts-container"></div>
        <div class="ml-auto pagination" *ngIf="totalItemsUage > pageSizeUage">
          <ngb-pagination [collectionSize]="totalItemsUage" [(page)]="currentPageUage" [pageSize]="pageSizeUage"
            aria-label="Pagination" (pageChange)="onPageChange($event, 'Uage')"></ngb-pagination>
        </div>
      </div>
    </div>
  </div>
</div>


  `,
  styles: [
    `
    .chart-box {
      border: 1px solid #ddd;
      padding: 15px;
      margin-bottom: 20px;
      position: relative; /* Make it a positioning context for children */
    }
    
    .heading {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #4F4F4F;
    }
    
    .chart-area {
      position: relative;
    }
    
    .echarts-container {
      height: 600px; /* Set the height as needed */
    }
    
    .pagination {
      position: absolute;
      bottom: -33px;
      right: 0;
      margin-bottom: 10px; /* Adjust as needed */
    }
    
    
    
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TagsChartComponent implements OnInit {
  @Input() selectedTimePeriod: string | undefined;
  @Input() datefrom: string | undefined;
  @Input() dateTo: string | undefined;
  @Output() notifyTimePeriodChange: EventEmitter<string> = new EventEmitter<string>();

  optionsOpens: EChartsOption = {};
  optionsClicks: EChartsOption = {};
  optionsUage: EChartsOption = {};
  tagDetails:any;

  pageSizeOpens = 10;
  currentPageOpens = 1;
  totalItemsOpens = 0;
  displayedDataOpens: any[] = [];
  dataOpens: any = {};

  pageSizeClicks = 10;
  currentPageClicks = 1;
  totalItemsClicks = 0;
  displayedDataClicks: any[] = [];
  dataClicks: any = {};

  pageSizeUage = 10;
  currentPageUage = 1;
  totalItemsUage = 0;
  displayedDataUage: any[] = [];
  dataUage: any = {};
  opens: any;
  clicks: any;
  ctrs: any;

  constructor(private graphService: GraphService,private translate: TranslateService,) {
    this.opens = this.translate.instant('header.personalisationTags.opensLbl');
    this.clicks = this.translate.instant('header.personalisationTags.clicksLbl');
    this.ctrs =this.translate.instant('header.personalisationTags.CTRLbl')
  }

  ngOnInit() {
    this.graphService.allTagPerformaanceData$.subscribe((data: any) => {
      if (data && data?.topTagsDetails) {
        this.tagDetails=data?.tagDetails;
        this.dataOpens = this.constructChartObject(data?.topTagsDetails.topOpenedTags);
        this.dataClicks = this.constructChartObject(data?.topTagsDetails.topClickedTags);
        this.dataUage = this.constructChartObject(data?.topTagsDetails.topUsedTags);
        

        this.totalItemsOpens = this.dataOpens.length;
        this.totalItemsClicks = this.dataClicks.length;
        this.totalItemsUage = this.dataUage.length;

        this.updateDisplayedData('Opens');
        this.updateDisplayedData('Clicks');
        this.updateDisplayedData('Uage');
      }
    });
  }

  constructChartObject(data):any {
    let result = {};
    let tagChartArry:any = [];
    for (const key in data) {
      let tagName:any = this.tagDetails[key];
      let tagValue = data[key];
      result = {name:this.tagDetails[key],value:data[key]};
      tagChartArry.push(result);
      //result[tagName] = tagValue;
    }
    return tagChartArry;
  }
  onPageChange(page: number, chartType: string) {
    switch (chartType) {
      case 'Opens':
      this.currentPageOpens = page;
        this.updateDisplayedData('Opens');
        break;
      case 'Clicks':
        this.currentPageClicks = page;
        this.updateDisplayedData('Clicks');
        break;
      case 'Uage':
        this.currentPageUage = page;
        this.updateDisplayedData('Uage');
        break;
    }
  }

  updateDisplayedData(chartType: string) {
    const startIdx = (this['currentPage' + chartType] - 1) * this['pageSize' + chartType];
    const endIdx = startIdx + this['pageSize' + chartType];
    this['displayedData' + chartType] = this['data' + chartType]
      .slice(startIdx, endIdx);
      //.map(([name, value]) => ({ name, value }));
    this.generateChatSeries(chartType);
  }

  generateChatSeries(chartType: string) {
    const names = this['displayedData' + chartType].map((item) => item.name);
    const values = this['displayedData' + chartType].map((item) => item.value);
  
    const barHeight = 500 / names.length; // Calculate bar height dynamically
  
    this['options' + chartType] = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '6%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            
            type: 'shadow'        // 'line' | 'shadow'
        }
    },
      yAxis: {
        type: 'category',
        data: names,
        axisLine: { show: true },
        axisTick: { show: true },
        axisLabel: {
          interval: 0, // Display all labels
          margin: 10, // Adjust as needed
        },
      },
      xAxis: {
        type: 'value',
        axisLine: { show: true },
        axisTick: { show: true },
        splitLine: { show: true },
        splitArea: { show: false },
        axisLabel: {
          show: false,
        },
      },
      series: [
        {
          data: values,
          barWidth: 30,
          barGap: '5%', // Adjust as needed
          barCategoryGap: '5%', // Adjust as needed
          type: 'bar',
          emphasis: {
            label: {
              show: false,
              position: 'insideTop',
            },
          },
          label: {
            show: true,
            position: 'right',
            offset: [10, 0], // Adjust as needed
          },
          showBackground: false,
          itemStyle: {
            color: '#167CEA',
            barMaxWidth: 30, // Set a maximum width for bars
          },
          barMinHeight: 10, // Set a minimum height for bars
          barMaxHeight: barHeight, // Set the dynamically calculated height
        },
      ],
    };
  }
  
  
}
