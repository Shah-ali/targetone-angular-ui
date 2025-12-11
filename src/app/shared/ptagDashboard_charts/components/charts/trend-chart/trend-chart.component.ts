import { Component } from '@angular/core';
import { GraphService } from '@app/core/services/graph.service';
import { TranslateService } from '@ngx-translate/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-trend-chart',
  template: `
    <div echarts [options]="chartOptions" class="echart"></div>
  `,
  styles: [
    `
      .echart {
        width: 100%;
        height: 600px; /* Adjust the height as needed */
      }
    `,
  ],
})
export class TrendChartComponent {
  chartOptions: EChartsOption = {};
  constructor(private graphService: GraphService,private translate: TranslateService,) {}

  ngOnInit() {
    this.graphService.trendGrahData$.subscribe((data) => {
      this.generateChatSeries(data);
    });
  }
  // Function to convert "DD-MMM" to a valid Date object
parseDate(dateStr) {
  const [day, month] = dateStr.split('-');
  return new Date(`${month} ${day}, ${new Date().getFullYear()}`); // Assuming current year
}


  generateChatSeries(trendData) {
    // Sort and reconstruct the object
   
    
    const dates = Object.keys(trendData);
    // Sort the dates array based on the keys of the trendData object
    dates.sort((a, b) => this.parseDate(a).getTime() - this.parseDate(b).getTime());

    const opens = dates.map((date) => trendData[date].open);
    const clicks = dates.map((date) => trendData[date].click);
    const ctr = dates.map((date) => trendData[date].ctr);

    this.chartOptions = {
      color: ['#FFD560', '#B960FF', '#31E18C'],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '6%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: [this.translate.instant('header.personalisationTags.opensLbl'), this.translate.instant('header.personalisationTags.clicksLbl'), this.translate.instant('header.personalisationTags.ctrLblPercent')],
        orient: 'horizontal',
        bottom: 10,
      },
      xAxis: [
        {
          type: 'category',
          axisLine: { show: true },
          axisTick: { show: true },
          splitLine: { show: true },
          splitArea: { show: false },
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 45,
          },
          data: dates,
        },
      ],
      yAxis: [
        {
          type: 'value',
          position: 'left',
          axisTick: { show: true },
          splitLine: { show: true },
          splitArea: { show: false },
          axisLine: {
            show: false, // Set to false to hide the Y-axis marker lines
            lineStyle: {
              color: '#5470C6',
            },
          },
          axisLabel: {
            formatter: '{value}',
          },
        },
        {
          type: 'value',
          position: 'left',
          offset: 80,
          axisLine: {
            show: false, // Set to false to hide the Y-axis marker lines
            lineStyle: {
              color: '#91CC75',
            },
          },
          axisLabel: {
            formatter: '{value}',
          },
        },
        {
          type: 'value',
          position: 'right',
          axisLine: {
            show: false, // Set to false to hide the Y-axis marker lines
            lineStyle: {
              color: '#EE6666',
            },
          },
          axisLabel: {
            formatter: '{value}%',
          },
        },
      ],
      series: [
        {
          name: this.translate.instant('header.personalisationTags.opensLbl'),
          type: 'bar',
          data: opens,
          barWidth: 30,
        },
        {
          name: this.translate.instant('header.personalisationTags.clicksLbl'),
          type: 'bar',
          data: clicks,
          barWidth: 30,
        },
        {
          name: this.translate.instant('header.personalisationTags.ctrLblPercent'),
          type: 'line',
          yAxisIndex: 2,
          data: ctr,
        },
      ],
    };
  }
}
