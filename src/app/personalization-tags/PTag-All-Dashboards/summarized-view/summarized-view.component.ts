import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { PersonalizedTagPerformanceService } from '@app/core/services/personalized-tag-performance.service';
import { GraphService } from '@app/core/services/graph.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppConstants } from '@app/app.constants';
import { DataService } from '@app/core/services/data.service';
import { DrawerService } from '@app/core/services/drawer.service';
import allTagsData  from '@assets/pTagDash_JSON/data/all_tags_performance_with_filter.json';
import { TranslateService } from '@ngx-translate/core';
import { DateTimeAdapter } from 'ng-pick-datetimex';
import { HttpService } from '@app/core/services/http.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import moment from 'moment';
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { DataZoomComponent, GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { ButtonRendererComponent } from './button-render.component';
echarts.use([LineChart, CanvasRenderer, BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent]);
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-summarized-view',
  templateUrl: './summarized-view.component.html',
  styleUrls: ['./summarized-view.component.scss']
})
export class SummarizedViewComponent implements OnInit {  
  active = 1;
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  LAST_7_DAYS: any;
  LAST_30_DAYS: any;
  LAST_60_DAYS: any;
  CUSTOM_DATE_RANGE: any;
  selectedTimePeriod: any;
  startDate:any ="";
  endDate:any ="";
  dateFrom: string = '';
  dateTo: string = '';
  selectedCompaigns: any[] = []; // Replace with your actual data
  allCompaigns: any[] = []; // Replace with your actual data
  filterApplied =false;
  modalRef: BsModalRef | undefined;
  selectedTagID:string ="";
  aggregateOpen:number =0;
  aggregateClicks:number =0;
  dropdownData: any[] = [];
  aggregateCTR: number = 0;
  langCode:any = AppConstants.DEFAULT_LANGUAGE;
  timeZoneInGMT: any;
  selectedSecondaryChartType: 'bar' | 'line' = 'bar';
  today:any = new Date();
  clearIconStartDateEnable:boolean = false;
  clearIconEndDateEnable:boolean = false;
  objectKeys:any = Object.keys;
  @ViewChild('startDtEndDtElement') startDtEndDtElement!: ElementRef;
  @ViewChild('modalBody') modalBody!: ElementRef;
	
  agGridLocaleLabels:any =  {};
  chartTitleLabelUpdate: any = "";
  public localeText: {
    [key: string]: any;
  } = {};
  columnHeadersRuleReco: ColDef[] = [];
  
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    cellStyle: { outline: 'none', 'text-align': 'left' },
    suppressMenu:true
    //filter:true
  };
  rowSelection: any = { 
        mode: 'singleRow',
        checkboxes:false,
        enableClickSelection: true,
    };  
  public getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.tagId;
  rowDataCollect: any = [];
  displayedData: any = [];
  rowData:any = [];
  tagWisePerformanceArrayObj: any = [];
  chartOptions: EChartsOption = {};
  activeContentName: any = "";
  showClickOrCtrObj:any = [];
  currentActiveContentLoaded: any;
  themeName:any = '';
  downloadDisabled: boolean = true;
  @ViewChild('echartAreaSection', { static: true }) echartContainer!: ElementRef;
  myChart!: echarts.ECharts;
  gridApi: any;
  customRangeDateObj: any = {};
  showCustomDatesSelected: boolean = false;
  daysDifference: any;
  isExtDataDisabled: boolean = true;
  constructor(
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private dataService: PersonalizedTagPerformanceService,
    private graphService: GraphService,
    private drawerService: DrawerService,
    private parentDataService:DataService,
    private translate: TranslateService,
    config: NgbModalConfig, 
    private shareService: SharedataService,
    dateTimeAdapter: DateTimeAdapter<any>,
    private httpService: HttpService,
    private swalAlertService: DataService
  ) {
    this.showClickOrCtrObj = [{id:'click',name:this.translate.instant('header.personalisationTags.ctrLblPercent'),saveVal:1,checked:true},{id:'ctr',name:this.translate.instant('header.personalisationTags.clicksLbl'),saveVal:2,checked:false}];
    this.shareService.setActiveLanguage.subscribe((res) => {
      if(res != ""){
        dateTimeAdapter.setLocale(res);
        this.langCode = res;
      }
    });
    config.backdrop = 'static';
		config.keyboard = false;
		config.windowClass ='ptags-modal';
    this.fromDate=null;
    this.toDate=null;

    setTimeout(() => {      
      this.LAST_7_DAYS = this.translate.instant('header.personalisationTags.last7dayslbl');
      this.LAST_30_DAYS = this.translate.instant('header.personalisationTags.last30dayslbl');
      this.LAST_60_DAYS = this.translate.instant('header.personalisationTags.last60dayslbl');
      this.CUSTOM_DATE_RANGE = this.translate.instant('header.personalisationTags.customDateRangelbl');
      this.selectedTimePeriod = this.translate.instant('header.personalisationTags.last7dayslbl');
      this.chartTitleLabelUpdate = this.translate.instant('header.personalisationTags.chartHeadingLabelImpessionVsCrtMsg');
      // label initializing onload
      this.columnHeadersRuleReco = [
        { 
          field: 'tagName',
          cellRenderer: ButtonRendererComponent,
          cellRendererParams: {
            onClick: this.showChartOnActiveContentClickMethod.bind(this),
          },
          headerName: this.translate.instant('header.personalisationTags.heading'),
          flex: 5, sortable: false, filter: false, tooltipField: 'tagName',
          headerClass:'customMt-1'
        },
        { field: 'open', headerName: this.translate.instant('header.personalisationTags.opensLbl'), headerClass:'customMt-1', flex: 2, sortable: false, filter: false, tooltipField: 'open' },
        { field: 'click', headerName: this.translate.instant('header.personalisationTags.clicksLbl'), headerClass:'customMt-1', flex: 1, sortable: false, filter: false, tooltipField: 'click' },
        { field: 'ctr', headerName: this.translate.instant('header.personalisationTags.ctrLblPercent'), headerClass:'customMt-1', flex: 1, sortable: false, filter: false, tooltipField: 'ctr' }
      ];

      this.showClickOrCtrObj = [{id:'click',name:this.translate.instant('header.personalisationTags.ctrLblPercent'),saveVal:1,checked:true},{id:'ctr',name:this.translate.instant('header.personalisationTags.clicksLbl'),saveVal:2,checked:false}];
      
            
    }, 1000)
    
    
  }
  dateclearMethod(dateEvt,type){
    if(type == 'startDate'){
      this.startDate = "";
      this.endDate = "";
      this.clearIconStartDateEnable = false;
      this.clearIconEndDateEnable = false;
      this.today = new Date();
    }else{
      this.endDate = "";
      this.clearIconEndDateEnable = false;
      this.today = this.returnDateRangewithIn90dayMethod(this.startDate);
    }
    
  }
  checkExtDataEnabledMethod(daysDifference){
    if(daysDifference > 90){
      this.isExtDataDisabled = false; // enable
    }else{
      this.isExtDataDisabled =  true; // disable
    }

  }
  returnDateRangewithIn90dayMethod(date){
    let now:any = new Date();
    let presentDate = now.getTime();
    let range = new Date(date); // Clone the date
   // let pastdate = range.setDate(range.getDate() + this.maxDateRangeSeleted);  
 // const daysDifference = 365; // Approximate number of days in a year
  const daysDifference = Math.floor((presentDate - range.getTime()) / (1000 * 60 * 60 * 24)); // any dates
  let pastdate = range.setDate(daysDifference + range.getDate());
  this.daysDifference = Math.floor((new Date(this.endDate).getTime() - new Date(this.startDate).getTime()) / (1000 * 60 * 60 * 24));
  this.checkExtDataEnabledMethod(this.daysDifference);
    if(pastdate > presentDate){
      range = now;
    }else{
      range; 
    }
    return range;
  }
  initChart() {
    const chartElement = document.getElementById('echartAreaSectionGraph') //.echartContainer?.nativeElement;
    if (!chartElement) {
      console.error(this.translate.instant('designEditor.offerDrawerComponent.dataNotFoundLbl'));
      return;
    }
    if(this.myChart === undefined){
      this.myChart = echarts.init(chartElement);
    }   
    this.myChart.setOption(this.chartOptions);
   
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.agGridLocaleLabels = {
      "to": this.translate.instant('agGridLocaleLabels.to'),
      "of": this.translate.instant('agGridLocaleLabels.of'),
      "page": this.translate.instant('agGridLocaleLabels.page'),
      "noRowsToShow": this.translate.instant('agGridLocaleLabels.noRowsToShow')   
    };
    this.localeText = this.agGridLocaleLabels;
      if(this.gridApi.gridOptionsWrapper !== undefined){
        this.gridApi.gridOptionsWrapper.gridOptions.localeText = this.agGridLocaleLabels;
      }
  }
 
  onTabChange(evt){
    if(evt.nextId === 1){
      this.rowData = [];
      setTimeout(() => {
        this.rowData = this.tagWisePerformanceArrayObj;
      }, 1000);
    }
  }
  switchBtwClickNCtrMethod(evtVal){
    let inpVal = evtVal.target;
    let val;
    if(inpVal === undefined){
      val = evtVal;
    }else{
      val = inpVal.value;
    }
    if(val == 1){ // show CRT %
      this.showClickOrCtrObj[1].checked = false;
      this.showClickOrCtrObj[0].checked = true;
      this.chartTitleLabelUpdate = this.translate.instant('header.personalisationTags.chartHeadingLabelImpessionVsCrtMsg');
      this.generateChatSeries(this.currentActiveContentLoaded,1);
    }else{ // show Clicks
      this.showClickOrCtrObj[0].checked = false;
      this.showClickOrCtrObj[1].checked = true;
      this.chartTitleLabelUpdate = this.translate.instant('header.personalisationTags.chartHeadingLabelClickVsCrtMsg');
      this.generateChatSeries(this.currentActiveContentLoaded,0);
    }
  }
  onSecondaryChartTypeChange(type: 'bar' | 'line') {
  this.selectedSecondaryChartType = type;
  const loadByType = this.showClickOrCtrObj[0].checked ? 1 : 2;
  this.generateChatSeries(this.currentActiveContentLoaded, loadByType);
}
  showChartOnActiveContentClickMethod(e) {
    let curtObjFind = this.tagWisePerformanceArrayObj.find(x => x.tagId == e.rowData.tagId);
    let curtObjFindIndex = this.tagWisePerformanceArrayObj.findIndex(x => x.tagId == e.rowData.tagId);
    this.currentActiveContentLoaded = curtObjFind;
    this.showClickOrCtrObj[1].checked = false;
    this.showClickOrCtrObj[0].checked = true;
    e.event.api.getDisplayedRowAtIndex(curtObjFindIndex).setSelected(true);
    //e.event.api.getRowNode(curtObjFindIndex).setSelected(true);
    this.chartTitleLabelUpdate = this.translate.instant('header.personalisationTags.chartHeadingLabelImpessionVsCrtMsg');
    this.generateChatSeries(e.rowData,1);    
  }
  paginationChangeMethod(evt){
    //console.log(evt);
  }
  downloadTabularDataMethod(){
    //.Xlsx file download
    let fileExtn = 'Performance by active content.xlsx';
    let fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; 
    let filterData:any = this.rowData;
    let sortedObjFinal:any = [];
    filterData.map(x => {
      let reorderedObj:any = {
        "Active content": x.tagName,
        "Opens": x.open,        
        "Clicks": x.click,
        "CTR(%)": x.ctr
    };
      sortedObjFinal.push(reorderedObj);
    });
      this.downloadobjArryToCSV(fileType,fileExtn,sortedObjFinal);
  }  
  downloadobjArryToCSV(fileType,fileExtn,Xlscontent){
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Xlscontent);
    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileName = fileExtn;

    const fileData: Blob = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(fileData, fileName);


    
  }


// Function to convert "DD-MMM" to a valid Date object
parseDate(dateStr) {
  const [day, month] = dateStr.split('-');
  return new Date(`${month} ${day}, ${new Date().getFullYear()}`); // Assuming current year
}
  generateChatSeries(trendData,loadByType) {
    // Sort and reconstruct the object
    let trendDataActiveContent = trendData;   
    let checkPerformanceTxt:any = '';
    if(trendData.tagName !== undefined){
      if(trendData.tagName.includes('Performance')){
        checkPerformanceTxt = '';
      }else{
        checkPerformanceTxt = ' '+this.translate.instant('header.personalisationTags.performanceMsgLbl');
      }  
      this.activeContentName = trendData.tagName + checkPerformanceTxt; 
    }     
     
    let getTrendLength = Object.keys(trendDataActiveContent.trend).length;

    const dates = Object.keys(trendDataActiveContent.trend);  
    let showValueBy:any;
    if(loadByType === 1){
      showValueBy = '{value}%';
    }else{
      showValueBy = '{value}';
    }
    // Sort the dates array based on the keys of the trendData object
    dates.sort((a, b) => this.parseDate(a).getTime() - this.parseDate(b).getTime());

    const opens = dates.map((date) => trendDataActiveContent.trend[date].open);
    const clicks = dates.map((date) => trendDataActiveContent.trend[date].click);
    const ctr = dates.map((date) => trendDataActiveContent.trend[date].ctr);
    let remIndex:any;
    if(getTrendLength > 14){
      remIndex =  (getTrendLength / 15).toFixed();
      remIndex = parseInt(remIndex) || 0;
    }

    
    let xaixsLabelCustom = function (value, index) {
      // Show every remIndex label
      remIndex = parseInt(remIndex) || 0;
      if(remIndex === 0){
        return value;
      }else{
        return index % remIndex === 0 ? value : '';
      }
    }
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
          type: 'cross',
        },
      },
      legend: {
        data: this.loadLegendMethod(loadByType),
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
            formatter: xaixsLabelCustom,
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
            formatter: showValueBy,
          },
        },
      ],
      series: this.seriesConfigureMethod(loadByType,opens,clicks,ctr),
      color: this.colorOnSwitchMethod(loadByType), // Open,CTR,clicks
    };
      this.initChart();
  }
  loadLegendMethod(type){
    let legendObj:any = [];
    if(type === 1){
      legendObj = [this.translate.instant('header.personalisationTags.opensLbl'), this.translate.instant('header.personalisationTags.ctrLblPercent')]
    }else{
      legendObj = [this.translate.instant('header.personalisationTags.opensLbl'),this.translate.instant('header.personalisationTags.clicksLbl')]
    }
    return legendObj;
  }
 colorOnSwitchMethod(typeSelected) {
  if (this.selectedSecondaryChartType === 'line') {
    return ['#05759E', '#17B3E5']; 
    // Opens Line, CTR/Clicks Line
  } else {
    return ['#05759E', '#17B3E5']; 
    // Opens Bar, Opens Line, CTR/Clicks Bar, CTR/Clicks Line
  }
}
seriesConfigureMethod(type, opens, clicks, ctr) {
  const series: any[] = [];
  const isBarChart = this.selectedSecondaryChartType === 'bar';
  const isCTR = type === 1;

  const opensLabel = this.translate.instant('header.personalisationTags.opensLbl');
  const ctrOrClicksLabel = isCTR
    ? this.translate.instant('header.personalisationTags.ctrLblPercent')
    : this.translate.instant('header.personalisationTags.clicksLbl');


if (isBarChart) {
  // Show Opens as bar
  series.push({
    name: opensLabel,
    type: 'bar',
    data: opens,
    barWidth: 20,
    yAxisIndex: 0,
    legendHoverLink: true
  });

  // Show CTR/Clicks as line
  series.push({
    name: ctrOrClicksLabel,
    type: 'line',
    data: isCTR ? ctr : clicks,
    yAxisIndex: 2,
    showSymbol: true,
    symbol: 'circle',
    symbolSize: 8,
    smooth: true,
    lineStyle: {
      width: 2
    },
    areaStyle: {
      opacity: 0.2
    }
  });

} else {
  // Show Opens as line
  series.push({
    name: opensLabel,
    type: 'line',
    data: opens,
    yAxisIndex: 0,
    showSymbol: true,
    symbol: 'circle',
    symbolSize: 8,
    smooth: true,
    lineStyle: {
      width: 2
    },
    areaStyle: {
      opacity: 0.2
    }
  });

  // Show CTR/Clicks as line
  series.push({
    name: ctrOrClicksLabel,
    type: 'line',
    data: isCTR ? ctr : clicks,
    yAxisIndex: 2,
    showSymbol: true,
    symbol: 'circle',
    symbolSize: 8,
    smooth: true,
    lineStyle: {
      width: 2
    },
    areaStyle: {
      opacity: 0.2
    }
  });
}

return series;
}
  onDateSelection(date: NgbDate,forDate) {
    if(forDate == 'fromDate'){
      this.fromDate = date;
      this.startDate = this.formatNgbDate(this.fromDate);
    }else{
      this.toDate = date;
      this.endDate = this.formatNgbDate(this.toDate);
    }

  }
  getAllAssociatedCampaigns(data) {
    return data.reduce((allCampaigns, tag) => {
      allCampaigns.push(...tag.associatedCampaigns);
      return allCampaigns;
    }, []);
  }
  applySelectedCompaigns(item){

    this.selectedCompaigns=item;
    if (item.length===this.dropdownData.length){
      this.selectedCompaigns=[];
    }
  this.fetchData();
   //this.getFilteredTags();
   this.filterApplied=true;
   this.drawerService.closeDrawer();
  }
  closeDrawer() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
  
  getDateMethod(startDateSelected,dateRange){
   if(dateRange == 'startDate'){
    this.endDate = "";
    this.clearIconStartDateEnable = true;
    this.clearIconEndDateEnable = false;
   }else{
    if(this.startDate == ''){
      this.clearIconEndDateEnable = false;      
      this.swalAlertService.SwalAlertMgs(this.translate.instant('header.personalisationTags.enterStartDateAlertMsglbl'));
      setTimeout(() => {
        this.endDate = "";
        this.customRangeDateObj.endDate = '';
      }, 0);   
      return;
    }else{
      this.clearIconEndDateEnable = true;
    }
    
   }
    this.today = this.returnDateRangewithIn90dayMethod(this.startDate);
   
   if(this.startDate !== ""){
    this.startDate = this.formatDate(this.startDate);
    
    }
    if(this.endDate !== ""){
      this.endDate = this.formatDate(this.endDate);
      
    }
    this.customRangeDateObj['startDate'] = this.formatCustomDate(this.startDate);
    this.customRangeDateObj['endDate'] = this.formatCustomDate(this.endDate);
    
  }
  
  setStartDateEndDate(timePeriod): void{
   
    const now = new Date();
    var setDate = new Date(now);
    this.selectedTimePeriod = timePeriod
    switch (timePeriod) {
      case this.LAST_7_DAYS:
        this.customRangeDateObj = {};
        this.clearIconStartDateEnable = false;
        this.clearIconEndDateEnable = false;
        this.showCustomDatesSelected = false;
        setDate.setDate(now.getDate() - 7);
        this.startDate = this.formatDate(setDate);
        this.endDate = this.formatDate(now);
        break;
      case this.LAST_30_DAYS:
        this.customRangeDateObj = {};
        this.clearIconStartDateEnable = false;
        this.clearIconEndDateEnable = false;
        this.showCustomDatesSelected = false;
        setDate.setDate(now.getDate() - 30);
        this.startDate = this.formatDate(setDate);
        this.endDate = this.formatDate(now);
        break;
      case this.LAST_60_DAYS:
        this.customRangeDateObj = {};
        this.clearIconStartDateEnable = false;
        this.clearIconEndDateEnable = false;
        this.showCustomDatesSelected = false;
        setDate.setDate(now.getDate() - 60);
        this.startDate = this.formatDate(setDate);
        this.endDate = this.formatDate(now);
        break;
      case this.CUSTOM_DATE_RANGE:      
      this.startDate = '';
       this.endDate = '' ;
        break;

      default:
        break;
    }
    this.fetchData();
  }
  formatNgbDate(ngbDate: NgbDate): string {
    if (ngbDate) {
      // NgbDate properties: year, month, day
      const year = ngbDate.year;
      const month = ngbDate.month;
      const day = ngbDate.day;
  
      // Create a JavaScript Date object
      const jsDate = new Date(year, month - 1, day);
      let formattedData = this.formatDate(jsDate);
      // Format the date as needed, for example: yyyy-MM-dd
     //const formattedDate = jsDate.toISOString().split('T')[0];
     //const formattedDate = jsDate.toLocaleDateString()
  
      return formattedData;
    }
  
    return '';
  }

  selectTimePeriod(period: string) {
    this.selectedTimePeriod = period;
    //this.cdr.detectChanges();
  }
  
  ngOnInit(): void {
    this.parentDataService.pTagKeySelected.subscribe(res => {
      if(res !== undefined){
        this.selectedTagID = res.tagKey;
      } 
    });
    this.parentDataService.setPtagDashboard(false);
    this.parentDataService.setPtagGraphPerformanceDashboard(false);
    this.parentDataService.setPtagSummarisedPerformanceDashboard(true);
    this.setStartDateEndDate(this.LAST_7_DAYS);
       
  }
  // getTimeZOneInGMTMethod(){
  //   this.httpService.post('/triggerPromo/getTimezoneInGMT').subscribe((data) => {
  //     if(data !== undefined){
  //       this.timeZoneInGMT = data.response;
	// 	console.log(this.timeZoneInGMT);
  //     }
  //   });
  // }
  fetchData(){
    if(this.startDate == "" ){
      this.swalAlertService.SwalAlertMgs(this.translate.instant('header.personalisationTags.enterStartDateAlertMsglbl'));
      return;
    }
    if(this.endDate == ""){
      this.swalAlertService.SwalAlertMgs(this.translate.instant('header.personalisationTags.enterendDateAlertMsglbl'));
      return;
    }
    let customStartDtFormat = moment(this.startDate).format('YYYY-MM-DD') || '';
    let customEndDtFormat = moment(this.endDate).format('YYYY-MM-DD') || '';
    this.dataService.getAllTagPerformanceData(customStartDtFormat,customEndDtFormat,this.selectedCompaigns,this.daysDifference).subscribe((data:any)=>{
      //data.body = allTagsData;  
             
      this.graphService.setAllTagPerformanceData(data?.body.response);
      // "totalOpen":953,
      // "totalClick":1047,
      // "totalCTR":109,
      this.aggregateClicks=data?.body.response?.totalClick || 0;
      this.aggregateOpen=data?.body.response?.totalOpen || 0;
      this.aggregateCTR=data?.body.response?.totalCTR || 0;
      this.graphService.setOpenGraphData(data?.body.response?.deviceOpenStats);
      this.graphService.setOpenGraphMultiSeriesData(data?.body.response?.deviceOpenStatsTimeWise);
      this.graphService.setTopLocationGraphData(data?.body.response?.topOpenLocation);
      // this.clickSum = data?.body.response?.totalClick;
      // this.ctrSum = data?.body.response?.totalCTR;
      // this.openStatusSum = data?.body.response?.totalOpen;
      this.allCompaigns = data?.body.response?.campaigns;
      if(data?.body.response?.tagWisePerformance !== undefined){
        this.currentActiveContentLoaded = data?.body.response?.tagWisePerformance[0];
        this.generateChatSeries(data?.body.response?.tagWisePerformance[0],1);
        this.tagWisePerformanceArrayObj = data?.body.response?.tagWisePerformance;

        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
		// Set chart type based on date range
        this.selectedSecondaryChartType = diffDays >=30 ? 'line' : 'bar';         
        this.generateChatSeries(this.currentActiveContentLoaded,1);
        
        setTimeout(() => {
          this.rowData = this.tagWisePerformanceArrayObj;
          this.downloadDisabled = this.rowData.length > 0 ? false:true;
        }, 1000);
      }else{
        this.rowData = [];
          this.tagWisePerformanceArrayObj = [];
          if(this.myChart !== undefined){
            this.myChart.clear();
          }          
          this.downloadDisabled = this.rowData.length > 0 ? false:true;
      }       
      this.agGridLocaleLabels = {
        "to": this.translate.instant('agGridLocaleLabels.to'),
        "of": this.translate.instant('agGridLocaleLabels.of'),
        "page": this.translate.instant('agGridLocaleLabels.page'),
        "noRowsToShow": this.translate.instant('agGridLocaleLabels.noRowsToShow')   
      };
      this.localeText = this.agGridLocaleLabels;
      if(this.gridApi.gridOptionsWrapper !== undefined){
        this.gridApi.gridOptionsWrapper.gridOptions.localeText = this.agGridLocaleLabels;
      }
      
      this.modalService.dismissAll();
    });
    if(this.objectKeys(this.customRangeDateObj).length > 0){
      this.showCustomDatesSelected = true;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  formatCustomDate(dt){
    dt = moment(dt).format('MM/DD/YYYY');    
    return dt;
  }
  backToDateFormat(dt){
    let resetDt = new Date(dt);
    return resetDt;
  }
  formatDate(date):any{   
    //let dateInLocal:any;    
    return date;

}
  open(content: any) {
    this.selectedTimePeriod = this.CUSTOM_DATE_RANGE;
    const now = new Date();
    var setDate = new Date(now);
    if(Object.keys(this.customRangeDateObj).length > 0){
      this.startDate=this.backToDateFormat(this.customRangeDateObj.startDate);  
      this.endDate=this.backToDateFormat(this.customRangeDateObj.endDate);
    }else{
      this.startDate='';  
      this.endDate='';
    }
		this.modalService.open(content);
  }
  applyDates(){     
    this.fetchData(); 
  }
  openDrawer(event:any) {
    event.preventDefault();
    //const compaigs = this.tagsData;
    this.dropdownData = [];
    const getAllCompaigns =this.allCompaigns;
   
    const uniqueCampaigns = new Set();
    
    for (const element of getAllCompaigns) {
      const campaignId = element;
    
      // Check if the campaignId is not already in the uniqueCampaigns Set
      if (!uniqueCampaigns.has(campaignId)) {
        this.dropdownData.push({
          id: element,
          name: element,
          checked: false
        });
    
        // Add the campaignId to the Set to mark it as seen
        uniqueCampaigns.add(campaignId);
      }
    }
    
    this.drawerService.setDropdownData(this.dropdownData);
    this.drawerService.openDrawer();
  }
  clearCompaignFilter(event:any) {
    event.preventDefault();
    this.selectedCompaigns=[];
    this.filterApplied=false;
    this.drawerService.setDropdownData([]);
    this.fetchData(); // calling the fetchData() method to reset the data based on the cleared filter.
  }
}
