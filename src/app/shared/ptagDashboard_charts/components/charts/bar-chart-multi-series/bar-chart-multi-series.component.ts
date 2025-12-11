import { Component } from '@angular/core';
import { GraphService } from '@app/core/services/graph.service';
import { TranslateService } from '@ngx-translate/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-bar-chart-multi-series',
  template: `
    <div echarts [options]="chartOptions" class="echarts-container"></div>
  `,
  styles: [
    `
      .echarts-container {
        height: 600px; /* Set the height as needed */
      }
    `,
  ],
})
export class BarChartMultiSeriesComponent {
  chartOptions: EChartsOption = {};
  constructor(private graphService : GraphService, private translate: TranslateService){

  }
  ngOnInit() {
    this.graphService.openGraphMultiSeriesData$.subscribe((data) => {
       this.generateChatSeries(data);
    });
  }
  generateChatSeries(data) {
 // Define the desired order of time categories
 const orderOfTimeCategories = [
  '12AM-03AM',
  '04AM-07AM',
  '08AM-11AM',
  '12PM-03PM',
  '04PM-07PM',
  '08PM-11PM',
];

// Sort the data array based on the desired order of time categories
const sortedData = data.sort(
  (a, b) => orderOfTimeCategories.indexOf(b.time) - orderOfTimeCategories.indexOf(a.time)
);

const timeCategories = sortedData.map((item) => item.time);

    this.chartOptions = {
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
      color: ['#31E18C', '#FFD560', '#B960FF'],
      yAxis: {
        type: 'category',
        data: timeCategories,
        axisLabel: {
          interval: 0,
          rotate: 0,
        },
        axisLine: { show: true },
        axisTick: { show: true },
      },
      xAxis: {
        type: 'value',
        axisLine: { show: true },
        axisTick: { show: true },
        splitLine: { show: true },
        splitArea: { show: true },
        axisLabel: { show: false },
      },
      legend: {
        data: [this.translate.instant('header.personalisationTags.tabletBarChartLbl'), this.translate.instant('designEditor.emailEditor.desktoplbl'), this.translate.instant('designEditor.emailEditor.mobilelbl')], // Names of your series
        orient: 'horizontal', // or 'vertical'
        bottom: 5, // Adjust the bottom margin as needed
      },
      series:<any> [
        {
          name: this.translate.instant('header.personalisationTags.tabletBarChartLbl'),
          type: 'bar',
          data: data.map((item) => item.tablet),
          label: {
            show: true,
            position: 'right',
            formatter: (params: any) => {
              const value: number = parseFloat(params.value); // Ensure value is treated as a number
              return value > 0 ? value : "";
            },
          },
          barWidth: 10,
        },
        {
          name: this.translate.instant('designEditor.emailEditor.desktoplbl'),
          type: 'bar',
          data: data.map((item) => item.desktop),
          label: {
            show: true,
            position: 'right',
            formatter: (params: any) => {
              const value: number = parseFloat(params.value); // Ensure value is treated as a number
              return value > 0 ? value : "";
            },
          },
          barWidth: 10,
        },
        {
          name: this.translate.instant('designEditor.emailEditor.mobilelbl'),
          type: 'bar',
          data: data.map((item) => item.mobile),
          label: {
            show: true,
            position: 'right',
            formatter: (params: any) => {
              const value: number = parseFloat(params.value); // Ensure value is treated as a number
              return value > 0 ? value : "";
            },
          },
          barWidth: 10,
        },
      ],
      barCategoryGap: '30%',
    };
  }
  
  
  
};