import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { GraphService } from '@app/core/services/graph.service';
import { PersonalizedTagPerformanceService } from '@app/core/services/personalized-tag-performance.service';
import { DrawerService } from '@app/core/services/drawer.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { now } from 'lodash';
import { AppConstants } from '@app/app.constants';
import { DataService } from '@app/core/services/data.service';
import allGraphData  from '@assets/pTagDash_JSON/data/graph-data_with_filter.json';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { SharedataService } from '@app/core/services/sharedata.service';
import { DateTimeAdapter } from 'ng-pick-datetimex';
import { HttpService } from '@app/core/services/http.service';
import { ColDef, GetRowIdFunc, GetRowIdParams,RowGroupingDisplayType} from 'ag-grid-community';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

import { DataZoomComponent, GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
echarts.use([LineChart, CanvasRenderer, BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent]);
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ButtonRendererViewPerformanceComponent } from './button-render-viewPerformance.component';
@Component({
  selector: 'graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.scss']
  
})
export class GraphViewComponent implements OnInit { 
  @ViewChild('echartAreaSection', { static: true }) echartContainer!: ElementRef;
  myChart!: echarts.ECharts
	active = 1;
	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null;
	toDate: NgbDate | null;
  dropdownData: any[] = [];
  LAST_7_DAYS: any;
  LAST_30_DAYS: any;
  LAST_60_DAYS: any;
  CUSTOM_DATE_RANGE: any;
  selectedTimePeriod: any;
  parsedData: any;
  openStatusSum: Number | 0 | undefined;
  clickSum:Number | 0 | undefined;
  ctrSum:Number | 0 | undefined;
  dateFrom: string = '';
  dateTo: string = '';
  selectedCompaigns: any[] = []; 
  allCompaigns: any[] = []; 
  filterApplied =false;
  modalRef: BsModalRef | undefined;
  selectedTagID:string ="";
  selectedTagName:string ="";
  startDate:any ="";
  endDate:any ="";
  activePtagDataObj: any = {};
  activationDate: any;
  currentDate: any;
  langCode:any = AppConstants.DEFAULT_LANGUAGE;
  chartType: 'line' | 'bar' = 'bar';
  opensData: any[] = [];
  clicksData: any[] = [];
  ctrData: any[] = [];
  selectedType: any = 'CTR'; // 'click' or 'ctr' 
  chartOptions: any = {}; 
  timeZoneInGMT: any;
  agGridLocaleLabels:any =  {};
  rowWisePerformanceArrayObj: any[] = [];
  selectedRow: any = null;
  selectedRowObject: any = {};
  currentActiveContentLoaded: any;
  rowData: any = [];
  activeContentName: any = ""; 
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
    //filter:false
  };
  rowSelection: any = { 
        mode: 'single',
        checkboxes:false,
        enableClickSelection: false,  
        groupSelectsChildren:true
    };  
  public getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.tagId;
  showClickOrCtrObj:any = [];
  downloadDisabled: boolean = true;
  autoGroupColumnDef = {
    field: 'rowLabel',
    cellRendererParams: { suppressCount: false }
  };
  groupDisplayType: RowGroupingDisplayType = "groupRows";
  groupDefaultExpanded = 1;
  chartTitleLabelUpdate: any = "";
  today:any = new Date();
  clearIconStartDateEnable:boolean = false;
  clearIconEndDateEnable:boolean = false;
  gridApi: any;
  customRangeDateObj: any = {};
  showCustomDatesSelected: boolean = false;
  objectKeys:any = Object.keys;
  constructor(
    config: NgbModalConfig, 
    private modalService: NgbModal, 
    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter,
    private cdr: ChangeDetectorRef,
    private graphService: GraphService,
    private dataService: PersonalizedTagPerformanceService,
    private drawerService: DrawerService,
    private parentDataService: DataService,
    private translate: TranslateService,
    private shareService: SharedataService,
    dateTimeAdapter: DateTimeAdapter<any>,
    private httpService: HttpService,
    private swalAlertService: DataService
    ) {
    this.showClickOrCtrObj = [{id:'click',name:this.translate.instant('header.personalisationTags.ctrLblPercent'),saveVal:1,checked:true},{id:'ctr',name:this.translate.instant('header.personalisationTags.clicksLbl'),saveVal:2,checked:false}];
		// customize default values of modals used by this component tree
		config.backdrop = 'static';
		config.keyboard = false;
		config.windowClass ='ptags-modal';

		this.fromDate = null;
		this.toDate = null;    
    this.shareService.setActiveLanguage.subscribe((res) => {
      if(res != ""){
        dateTimeAdapter.setLocale(res);
        this.langCode = res;
      }
    });
    this.parentDataService.ptagActveDataObj.subscribe(res => {
      if(Object.keys(res).length > 0){
        this.activePtagDataObj = res;
      }
    });

    setTimeout(() => {      
      this.LAST_7_DAYS = this.translate.instant('header.personalisationTags.last7dayslbl');
      this.LAST_30_DAYS = this.translate.instant('header.personalisationTags.last30dayslbl');
      this.LAST_60_DAYS = this.translate.instant('header.personalisationTags.last60dayslbl');
      this.CUSTOM_DATE_RANGE = this.translate.instant('header.personalisationTags.customDateRangelbl');
      this.selectedTimePeriod = this.translate.instant('header.personalisationTags.last7dayslbl');
      this.chartTitleLabelUpdate = this.translate.instant('header.personalisationTags.chartHeadingLabelImpessionVsCrtMsg');
      this.columnHeadersRuleReco = [
       {
          field: 'rowLabel',
          cellRenderer: ButtonRendererViewPerformanceComponent,          
          cellRendererParams: {
            onClick: this.showChartOnActiveContentClickMethod.bind(this),
          },
          headerName: this.translate.instant('header.personalisationTags.heading'),
          flex: 5, sortable: false, filter: false, tooltipField: 'rowLabel',
          headerClass:'customMt-1',
          
        },
        { field: 'open', headerName: this.translate.instant('header.personalisationTags.opensLbl'), headerClass:'customMt-1', flex: 2, sortable: false, filter: false, tooltipField: 'open' },
        { field: 'click', headerName: this.translate.instant('header.personalisationTags.clicksLbl'), headerClass:'customMt-1', flex: 1, sortable: false, filter: false, tooltipField: 'click' },
        { field: 'ctr', headerName: this.translate.instant('header.personalisationTags.ctrLblPercent'), headerClass:'mt-1customMt-1', flex: 1, sortable: false, filter: false, tooltipField: 'ctr' }
      ];

      this.showClickOrCtrObj = [{id:'click',name:this.translate.instant('header.personalisationTags.ctrLblPercent'),saveVal:1,checked:true},{id:'ctr',name:this.translate.instant('header.personalisationTags.clicksLbl'),saveVal:2,checked:false}];
      
    }, 1000);
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
  returnDateRangewithIn90dayMethod(date){
    let now:any = new Date();
    let presentDate = now.getTime();
    let range = new Date(date); // Clone the date
    let pastdate = range.setDate(range.getDate() + 89);
    if(pastdate > presentDate){
      range = now;
    }else{
      range; 
    }
    return range;
  }
  ngOnInit() {
    this.parentDataService.pTagKeySelected.subscribe(res => {
      if(res !== undefined){
        this.selectedTagID = res.tagKey;
        this.selectedTagName = res.tagName;
      }      
    });
    this.parentDataService.setPtagDashboard(false);
    this.parentDataService.setPtagGraphPerformanceDashboard(true);
    this.parentDataService.setPtagSummarisedPerformanceDashboard(false);
    this.setStartDateEndDate();
    this.fetchData();
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
  // getTimeZOneInGMTMethod(){
  //   this.httpService.post('/triggerPromo/getTimezoneInGMT').subscribe((data) => {
  //     if(data !== undefined){
  //       this.timeZoneInGMT = data.response;
	// 	console.log(this.timeZoneInGMT);
  //     }
  //   });
  // }

  initChart() {
    const chartElement = this.echartContainer?.nativeElement;
    if (!chartElement) {
      console.error(this.translate.instant('designEditor.offerDrawerComponent.dataNotFoundLbl'));
      return;
    }
    if(this.myChart === undefined){
      this.myChart = echarts.init(chartElement);
    }   
    this.myChart.setOption(this.chartOptions);
   
  }
setChartType(type: 'bar' | 'line'): void {
  const trend = this.rowWisePerformanceArrayObj.find(x => x.tagId == this.currentActiveContentLoaded.tagId);
  if (!trend) return;

  this.chartType = type;

  const dates = Object.keys(trend);
  const opensData = dates.map(d => trend[d].open);
  const clicksData = dates.map(d => trend[d].click);
  const ctrData = dates.map(d => trend[d].ctr);

  let series: any[] = [];
  let legendData: string[] = [];
  let color: string[] = [];
  let nameChart:any = this.selectedType === 'click' ? this.translate.instant('header.personalisationTags.ctrLblPercent') : this.translate.instant('header.personalisationTags.clicksLbl');
 let dataChart:any = this.selectedType === 'click' ? clicksData : ctrData;
let loadType = this.selectedType === 'click' ? 0 : 1;
 this.generateChatSeries(trend, loadType);
   
}

   downloadChartImage(){
    if(this.myChart !== undefined){
      // Generate the image (PNG format)
      let image = this.myChart.getDataURL({
        type: 'png',  // You can also use 'jpeg'
        pixelRatio: 2, // Higher value for better resolution
        backgroundColor: '#ffffff' // Set background color if needed
    });


    // Create a download link
    let link = document.createElement('a');
    link.href = image;
    link.download = this.selectedTagName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    }  
  }
  fetchData(): void {  
    if(this.startDate == "" ){
      this.swalAlertService.SwalAlertMgs(this.translate.instant('header.personalisationTags.enterStartDateAlertMsglbl'));
      return;
    }
    if(this.endDate == ""){
      this.swalAlertService.SwalAlertMgs(this.translate.instant('header.personalisationTags.enterendDateAlertMsglbl'));
      return;
    }
    let customStartDtFormat = moment(this.startDate).format('YYYY-MM-DD');
    let customEndDtFormat = moment(this.endDate).format('YYYY-MM-DD');
    this.dataService.getGrapghData(this.selectedTagID, customStartDtFormat,customEndDtFormat, this.selectedCompaigns).subscribe(data => {
      //data.body = allGraphData;
     
      this.graphService.setOpenGraphData(data?.body.response?.deviceOpenStats);
      this.graphService.setOpenGraphMultiSeriesData(data?.body.response?.deviceOpenStatsTimeWise);
      this.graphService.setTrendGraphData(data?.body.response?.trend);
      this.graphService.setTopLocationGraphData(data?.body.response?.topOpenLocation);
      this.clickSum = data?.body.response?.totalClick;
      this.ctrSum = data?.body.response?.totalCTR;
      this.openStatusSum = data?.body.response?.totalOpen;
      this.allCompaigns = data?.body.response?.campaigns;

      if(data?.body.response?.rowWisePerformance !== undefined){        
        this.rowWisePerformanceArrayObj = data?.body.response?.rowWisePerformance;         
        //this.currentActiveContentLoaded 
        let startObj:any = this.rowWisePerformanceArrayObj.slice(0,1);       
        let restObj:any = this.rowWisePerformanceArrayObj.slice(1,this.rowWisePerformanceArrayObj.length);
        // adding row details to overall performance data object to load in Ag-grid-angular for Overall Performance *check how Ag-Grid loads
        startObj[0]["rowLabel"] = startObj[0].tagName;
        startObj[0]["rowId"] = startObj[0].tagId;

        let obj1:any = {}
        obj1["rowLabel"] = this.translate.instant('header.personalisationTags.chartRowLevelPerformanceLbl');
        obj1['headerLabel'] = true;
        let finalObj:any = [];
        //finalObj.splice(0,0,obj);
        finalObj.splice(0,0,...startObj);
        if(restObj.length > 0){
          restObj = restObj.filter(x => x.rowLabel !== undefined);
          if(restObj.length > 0){
            finalObj.splice(1,0,obj1);
            finalObj.splice(2,0,...restObj);
          }
        }
        const startDate = new Date(this.startDate);
        const endDate = new Date(this.endDate);
        const diffDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
         this.chartType = diffDays >= 30 ? 'line' : 'bar';

        this.generateChatSeries(finalObj[0],1);
        this.currentActiveContentLoaded = finalObj[0] // load frist Item assign
        this.rowData = [];
        setTimeout(() => {
          this.rowData = finalObj;
          this.downloadDisabled = this.rowData.length > 0 ? false:true;
        }, 1000);
      }else{
          this.rowData = [];
          this.rowWisePerformanceArrayObj = [];
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
  openDrawer(event:any) {
    event.preventDefault();
    //const compaigs = this.tagsData;
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
  formatCustomDate(dt){
      dt = moment(dt).format("MM/DD/YYYY");
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
  setStartDateEndDate(): void{
   
    const now = new Date();
    var setDate = new Date(now);
    switch (this.selectedTimePeriod) {
      case this.LAST_7_DAYS:
        this.customRangeDateObj = {};
        this.clearIconStartDateEnable = false;
        this.clearIconEndDateEnable = false;
        setDate.setDate(now.getDate() - 7);
        this.showCustomDatesSelected = false;
        this.startDate = this.formatDate(setDate);
        this.endDate = this.formatDate(now);
        break;
      case this.LAST_30_DAYS:
        this.customRangeDateObj = {};
        this.clearIconStartDateEnable = false;
        this.clearIconEndDateEnable = false;
        setDate.setDate(now.getDate() - 30);
        this.showCustomDatesSelected = false;
        this.startDate = this.formatDate(setDate);
        this.endDate = this.formatDate(now);
        break;
      case this.LAST_60_DAYS:
        this.customRangeDateObj = {};
        this.clearIconStartDateEnable = false;
        this.clearIconEndDateEnable = false;
        setDate.setDate(now.getDate() - 60);
        this.showCustomDatesSelected = false;
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
   
  }
  calculateSum(data:any) {
    let sumClicks = 0;
    let sumOpens = 0;
    let sumCtr = 0;

    for (const entry of data) {
      sumClicks += entry.clicks;
      sumOpens += entry.opens;
      sumCtr += parseFloat(entry.ctr);
    }
    this.openStatusSum=sumOpens;
    this.clickSum=sumClicks;
    this.ctrSum=sumCtr;

    // console.log('Sum of Clicks:', sumClicks);
    // console.log('Sum of Opens:', sumOpens);
    // console.log('Sum of CTR:', sumCtr);
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
    formatNgbDate(ngbDate: NgbDate): string {
      if (ngbDate) {
        // NgbDate properties: year, month, day
        const year = ngbDate.year;
        const month = ngbDate.month;
        const day = ngbDate.day;
    
        // Create a JavaScript Date object
        const jsDate = new Date(year, month - 1, day);
        //let formattedData:any = this.formatDate(jsDate);
        // Format the date as needed, for example: yyyy-MM-dd
       //const formattedDate = jsDate.toISOString().split('T')[0];
       //const formattedDate = jsDate.toLocaleDateString()
    
        return this.formatDate(jsDate);
      }
    
      return '';
    }
    selectTimePeriod(period: string) {
      this.selectedTimePeriod = period;
      this.setStartDateEndDate();
      this.fetchData();

      //this.graphService.setOpenGraphData(this.getChartData());
      //this.cdr.detectChanges();
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
    getDateMethod(startDateSelected,dataRange){
      if(dataRange == 'startDate'){
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
	open(content: any) {
    this.selectedTimePeriod = this.CUSTOM_DATE_RANGE;
    const now = new Date();
    var setDate = new Date(now);
   
    if(Object.keys(this.customRangeDateObj).length > 0){
      this.startDate = this.backToDateFormat(this.customRangeDateObj.startDate);  
      this.endDate = this.backToDateFormat(this.customRangeDateObj.endDate);
    }else{
      this.startDate='';  
      this.endDate='';
    }
    
		this.modalService.open(content);
	}
  applyDates(){    
    this.fetchData();   
  }

  // ---------- chart data details -------------
   showChartOnActiveContentClickMethod(e) {
    let curtObjFind = this.rowWisePerformanceArrayObj.find(x => x.rowId == e.rowData.rowId);
    //let curtObjFindIndex = this.rowWisePerformanceArrayObj.findIndex(x => x.tagId == e.rowData.tagId);
    this.currentActiveContentLoaded = curtObjFind;
    this.showClickOrCtrObj[1].checked = false;
    this.showClickOrCtrObj[0].checked = true;

    let index = e.event.rowIndex;
    e.event.api.deselectAllFiltered();
    e.event.api.getDisplayedRowAtIndex(index).setSelected(true);
    this.chartTitleLabelUpdate = this.translate.instant('header.personalisationTags.chartHeadingLabelImpessionVsCrtMsg');
    this.generateChatSeries(e.rowData,1);    
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
    if(trendData.rowLabel !== undefined){
      if(trendData.rowLabel.includes('Performance')){
        checkPerformanceTxt = '';
        }else{
          checkPerformanceTxt = ' '+this.translate.instant('header.personalisationTags.performanceMsgLbl');
      }   
      this.activeContentName = trendData.rowLabel + checkPerformanceTxt;   
    }
    
    if(trendDataActiveContent.trend !== undefined){
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
          right: '10%', 
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
            splitLine: { show: false },
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
    name: '', 
    position: 'left',
    axisTick: { show: true },
    splitLine: { show: false },
    splitArea: { show: false },
    axisLine: {
      show: false,
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
    name: '', 
    position: 'left',
    offset: 80,
    axisLine: {
      show: false,
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
    name: '', 
    position: 'right',
    min: 0,
    max: 100,
    axisLine: {
      show: false,
      lineStyle: {
        color: '#EE6666',
      },
    },
    axisLabel: {
      formatter: '{value} %', 
    },
  }
],
        series: this.seriesConfigureMethod(loadByType,opens,clicks,ctr),
        color: this.colorOnSwitchMethod(loadByType), // Open,CTR,clicks
      };
      this.initChart();
    }    
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
  colorOnSwitchMethod(typeSelected){
    let colorsObj:any = [];
    if(typeSelected === 1){
      colorsObj = ['#05759E','#17B3E5'];
    }else{
      colorsObj = ['#05759E','#17B3E5'];
    }
    return colorsObj;
  }
 seriesConfigureMethod(
  loadByType: number,
  opensData: any[],
  clicksData: any[],
  ctrData: any[]
): any[] {
  const series: any[] = [];
   const isBarChart = this.chartType === 'bar';
  const isCTR = loadByType === 1; // 1 for CTR, 0 for Clicks
const opensLabel = this.translate.instant('header.personalisationTags.opensLbl');
const ctrOrClicksLabel = isCTR
 ? this.translate.instant('header.personalisationTags.ctrLblPercent')
    : this.translate.instant('header.personalisationTags.clicksLbl');

 if (isBarChart) {
  // Show Opens as bar
  series.push({
    name: opensLabel,
    type: 'bar',
    data: opensData,
    barWidth: 20,
    yAxisIndex: 0,
    legendHoverLink: true
  });

  // Show CTR/Clicks as line
  series.push({
    name: ctrOrClicksLabel,
    type: 'line',
    data: isCTR ? ctrData : clicksData,
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
    data: opensData,
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
    data: isCTR ? ctrData : clicksData,
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
  paginationChangeMethod(evt){
    //console.log(evt);
  }
  
  downloadTabularDataMethod(){
    //.Xlsx file download
    let fileExtn = 'Performance by active content.xlsx';
    let fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; 
    let filterData:any = this.rowData;
    let rowLevelDataObj = filterData; // .slice(2,this.rowData.length); // filtering with row level data only
    let sortedObjFinal:any = [];
    let acticeContent = this.translate.instant("header.personalisationTags.heading");
    let clicksLabel = this.translate.instant("header.personalisationTags.clicksLbl");    
    let opensLabel = this.translate.instant("header.personalisationTags.opensLbl");
    let ctrLabel = this.translate.instant("header.personalisationTags.ctrLblPercent");
    rowLevelDataObj.map(x => {
      let reorderedObj:any = {};
    reorderedObj[acticeContent] = x.rowLabel;
    reorderedObj[opensLabel] = x.open;
    reorderedObj[clicksLabel] = x.click;
    reorderedObj[ctrLabel] = x.ctr;
      sortedObjFinal.push(reorderedObj);
    });
    sortedObjFinal = sortedObjFinal.filter(x => x[opensLabel] !== undefined)
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
      this.selectedType = 'CTR';
      this.chartTitleLabelUpdate = this.translate.instant('header.personalisationTags.chartHeadingLabelImpessionVsCrtMsg');
      this.generateChatSeries(this.currentActiveContentLoaded,1);
    }else{ // show Clicks
      this.showClickOrCtrObj[0].checked = false;
      this.showClickOrCtrObj[1].checked = true;
      this.selectedType = 'click';
      this.chartTitleLabelUpdate = this.translate.instant('header.personalisationTags.chartHeadingLabelClickVsCrtMsg');
      this.generateChatSeries(this.currentActiveContentLoaded,0);
    }

  }
 ChartTypeChange(type: 'bar' | 'line') {
  this.chartType = type;

  this.chartOptions.series = this.seriesConfigureMethod(
    1, // loadType
    this.opensData,
    this.clicksData,
    this.ctrData
  );

  this.chartOptions = { ...this.chartOptions }; 
}
}




