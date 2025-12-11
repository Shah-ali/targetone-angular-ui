import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { GraphService } from '@app/core/services/graph.service';

echarts.use([BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent]);

@Component({
  selector: 'app-bar-chart-simple',
  template: `
    <div echarts [options]="options" class="echarts-container"></div>
  `,
  styles: [
    `
      .echarts-container {
        height: 600px; /* Set the height as needed */
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Default
})
export class BarChartSimpleComponent implements OnInit {
  @Input() selectedTimePeriod: string | undefined;
  @Input() datefrom: string | undefined;
  @Input() dateTo: string | undefined;
  @Output() notifyTimePeriodChange: EventEmitter<string> = new EventEmitter<string>();
  options: EChartsOption = {};

  constructor(private graphService : GraphService) {}

  ngOnInit() {
    this.graphService.openGraphData$.subscribe((data) => {
       this.generateChatSeries(data);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  handleNotification(message: string) {
    console.log(`Received message in child: ${message}`);
  }

  generateChatSeries(data: any) {
    const categories = Object.keys(data);
  
    // Sort the categories based on the corresponding data values in descending order
    const sortedCategories = categories.sort((a, b) => data[a] - data[b]);
  
    // Update the options with the consolidated data
    this.options = {
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
        data: sortedCategories,
        axisLine: { show: true },
        axisTick: { show: true },
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
      series:<any> [
        {
          data: sortedCategories.map(category => data[category]),
          barWidth: 30,
          type: 'bar',
          emphasis: {
            label: {
              show: false,
              position: 'insideTop',
              formatter: (params: any) => {
                const value: number = parseFloat(params.value); // Ensure value is treated as a number
                return value > 0 ? value : "";
              },
            },
          },
          label: {
            show: true,
            position: 'right',
            formatter: (params: any) => {
              const value: number = parseFloat(params.value); // Ensure value is treated as a number
              return value > 0 ? value : "";
            },
          },
          showBackground: false,
          itemStyle: {
            color: '#51C3B7',
          }
        
        },
      ],
    };
  }
  
  
  
}
