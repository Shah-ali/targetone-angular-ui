import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components';
import { GraphService } from '@app/core/services/graph.service';
import { HttpService } from '@app/core/services/http.service';
import { DataService } from '@app/core/services/data.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { TranslateService } from '@ngx-translate/core';
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';

echarts.use([BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent]);
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-location-chart',
  templateUrl: './location-chart.component.html',
  styleUrls: ['./location-chart.component.scss']
})
export class LocationChartComponent implements OnInit {
  options: EChartsOption = {};
  pageSize = 10; // Number of locations per page
  currentPage = 1; // Current page
  totalItems = 0; // Total number of locations
  data: any[] = []; // Your location data
  displayedData: any[] = []; // Locations to display on the current page
  agGridLocaleLabels:any = {
    "to": "",
    "of": "",
    "page": "",
    "noRowsToShow": ""  
  };
  
selectedDropdownDefaultVal = '-1';
  public localeText: {
    [key: string]: any;
  } = this.agGridLocaleLabels;
  columnHeadersRuleReco: ColDef[] = [];
  
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    cellStyle: { outline: 'none', 'text-align': 'left' },
    //filter:true
  };
  rowSelection: any = 'single';
  rowData:any = [];
  public getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.id;
  rowDataCollect: any = [];
  disabledDownloadDropdown: any = true;
  
  constructor(private graphService: GraphService,
    private httpService: HttpService,
    private dataService: DataService,
    private shareService: SharedataService,
    private translate: TranslateService
  ) {
    this.agGridLocaleLabels = {
      "to": this.translate.instant('agGridLocaleLabels.to'),
      "of": this.translate.instant('agGridLocaleLabels.of'),
      "page": this.translate.instant('agGridLocaleLabels.page'),
      "noRowsToShow": this.translate.instant('agGridLocaleLabels.noRowsToShow')   
    };

    this.columnHeadersRuleReco = [
      { field: 'location', headerName: this.translate.instant('header.personalisationTags.locationGridcolumnLbl'),width:80, sortable: true, filter: false,tooltipField:'location'},
      { field: 'count', headerName: this.translate.instant('header.personalisationTags.countGridColumnLbl'), width: 20, sortable: true, filter: false, tooltipField:'count' },
      
    ];
  }

  ngOnInit() {
    this.graphService.topLocationData$.subscribe((data) => {
      this.data = Object.entries(data).map(([location, count]) => ({ location, count }));
      this.rowDataCollect = this.data;
      this.disabledDownloadDropdown = this.rowDataCollect.length > 0 ? false:true;
      if(this.data.length > 50){
        this.totalItems = 50; // now limiting to 50 records
      }else{
        this.totalItems = this.data.length; 
      }
      
      this.updateDisplayedData();
      this.generateChatSeries();
    });
  }
  paginationChangeMethod(evt){
    //console.log(evt);
  }
  generateChatSeries() {
    this.displayedData.sort((a, b) => a.count - b.count);
    const names = this.displayedData.map((item) => item.location);
    const values = this.displayedData.map((item) => item.count);
    

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
        data: names,
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
      series: [
        {
          data: values,
          barWidth: 30,
          barCategoryGap: '20%',
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
          },
          showBackground: false,
          itemStyle: {
            color: '#167CEA',
          },
        },
      ],
    };

// load data into table
setTimeout(() => {
  this.rowData = this.rowDataCollect;
}, 700);
    
    
  }
  downloadOptionChooseMethod(evt){
    //console.log(evt.target.value);
    let fileType;
    let fileExtn;
    let fileContentDownload;
    if(evt.target.value !== '-1'){
      if(evt.target.value == '1'){ // .CSV file download
        fileExtn = 'Performance by active content.csv';
        fileType = 'text/csv;charset=utf-8;'; 
        this.selectedDropdownDefaultVal = '1';
        fileContentDownload = this.convertObjectToCSVMethod(this.rowDataCollect);    
        if(fileContentDownload !== undefined){
          this.downloadobjArryToCSV(fileType,fileExtn,fileContentDownload);
        }   
      }else{ //.Xls file download
        fileExtn = 'Performance by active content.xlsx';
        fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; 
        this.selectedDropdownDefaultVal = '2';
        fileContentDownload = this.rowDataCollect;
        this.downloadobjArryToXlsx(fileType,fileExtn,fileContentDownload);        
             
      }   
   
  }  
  }

  convertObjectToCSVMethod(objArray){
    // Convert array of objects to CSV string
    const array = Array.isArray(objArray) ? objArray : [objArray];
    // Extract the keys for the header row
    if(array[0] !== undefined){    
    const headers = Object.keys(array[0]);  
    // Map each object to a CSV row
    const csvRows = array.map(obj => 
      headers.map(header => JSON.stringify(obj[header] ?? "")).join(",")
    );
    // Join the header and the rows
    return [headers.join(","), ...csvRows].join("\n");      
   }else{
    return;
   }
  }
  downloadobjArryToXlsx(fileType,fileExtn,Xlscontent){
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Xlscontent);
    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileName = fileExtn;

    const fileData: Blob = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(fileData, fileName);


    
  }
  downloadobjArryToCSV(fileType,fileExtn,Xlscontent){
     // Create a Blob from the data
     const blob = new Blob([Xlscontent], { type: fileType });
     // Create a link element
     const link = document.createElement('a');
     link.href = window.URL.createObjectURL(blob);
     link.download = fileExtn;
     // Trigger the download
     link.click();
     // Clean up the URL object
     window.URL.revokeObjectURL(link.href);
  }
  
  updateDisplayedData() {
    const startIdx = (this.currentPage - 1) * this.pageSize;
    const endIdx = startIdx + this.pageSize;
    this.displayedData = this.data.slice(startIdx, endIdx);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateDisplayedData();
    this.generateChatSeries();
  }
}
