declare var heatmap:any;
import { Component, OnInit,Input, Output, EventEmitter,TemplateRef,ViewChild, ElementRef,AfterViewInit} from '@angular/core';
import { HttpService } from '@app/core/services/http.service';
import { GlobalConstants } from '../common/globalConstants';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, RouterLink } from '@angular/router';
import { AppConstants } from '@app/app.constants';
import { HttpParams } from '@angular/common/http';
import { SharedataService } from '@app/core/services/sharedata.service';
import { LoaderService } from '@app/core/services/loader.service';
import BeefreeSDK from '@beefree.io/sdk';
import { showThumbnail } from '../modalInterface';
import { DataService } from '@app/core/services/data.service';
import Swal from 'sweetalert2';
import { EChartsOption } from 'echarts';
import h337 from "../../../assets/js/heatmap.js";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-trigger-analytics',
  templateUrl: './trigger-analytics.component.html',
  styleUrls: ['./trigger-analytics.component.scss']
})
export class TriggerAnalyticsComponent implements OnInit {  

  loadTemplates: any;
  imgThumbnailView: any;
  public tempId: any;
  selectedItem:any = 0;
  isTemplateType: any = 0;
  modalRef?: BsModalRef;
  deviceViewStyle: Record<string, string> = {};
  isMobileView: boolean = false;
  isPreTemplate:boolean = true;
  isPreview:boolean = false;
  isTemplateEditMode:boolean = false;
  promoKey:any;
  promoCommKey: any;
  promotionObj:any;
  channelObj:any;
  @Output() onAdd = new EventEmitter<any>();
  vendorObj: any;
  commChannelKey: any;
  vendorDataObj: any = [];
  editModeData:any;
  ischannelTabs:boolean=true;
  imgThumbnailMobileView: any;
  defaultPreview: any;
  payloadSavingJson: any;
  isPayload: boolean = false;
  templateConentObj: any;
  promoExecutedOrRunning: any;
  currentSplitId:any;
  _object = Object;
  latest: boolean = false;
  searchObj: any;
  vendorDesc: any;
  subject: any;
  preHeader: any;
  currentChannelName: any;
  channelName: any;
  loadThumbnailContent: any;
  previewHTMl: any;
  isDefaultStorageBEE:any;
  isFailsafeactiveTab: any;
  funnelChartOption: EChartsOption = {};
  clickPerformanceChartOption: EChartsOption = {};
  clickOpenRateOption: EChartsOption ={};
  deliveredCount:any;
  openCount : any;
  clickCount : any;
  openRate: any;
  clickRate: any;
  totalPurchase: any;
  heatmapConfiguration : any = {};
  coordinatesMap :any= []
  constructor(private http: HttpService, private router: Router,private shareService:SharedataService, private loader: LoaderService, private dataService: DataService,private translate:TranslateService) { 
    this.getPromotionKey(); 
    this.getpromoChannelObj();
    this.getSavedTemplatePromo();
    this.loader.ShowLoader();
    if(GlobalConstants.isPreviewMode){
      this.getPayLoadJson();
    }
    this.shareService.failSafeTabActive.subscribe(res => {
      this.isFailsafeactiveTab = res;
    });
    this.loader.HideLoader();     
    }

  ngOnInit(): void {   
  }
  async getpromoChannelObj() {
    let url = AppConstants.API_END_POINTS.GET_MAP_PROMO_CHANNELS+`?promoKey=${GlobalConstants.promoKey}`;
    const resultObj = await this.http.post(url).toPromise();
    this.channelObj = resultObj;
    GlobalConstants.channelObj = this.channelObj;
    this.shareService.channelObj.next(this.channelObj);
     console.log(this.channelObj);    
  }   
  async getSavedTemplatePromo(){  
    let url = AppConstants.API_END_POINTS.GET_SAVED_USAGE_TEMPLATES+`?promoKey=${GlobalConstants.promoKey}`;
    const data = await this.http.post(url).toPromise();  
      if(data.status == "SUCCESS" ){
        if(data.response == ""){
          this.isTemplateEditMode = false;
        }else{         
          if(Object.keys(data.response.adminCommTemplate).length > 0){
            this.isTemplateEditMode = true; 
            this.editModeData = JSON.parse(data.response.adminCommTemplate);
            this.shareService.savedAdminComTemplateObj.next(this.editModeData);     
            console.log(this.editModeData);            
          }            
          if(Object.keys(data.response.promotion).length > 0) {
            this.promoExecutedOrRunning = data.response.promotion.promoExecutedOrRunning;
            this.dataService.setLastSavedStep = data.response.promotion.lastSavedStep;
            this.dataService.setRunningPromotion = data.response.promotion.promoExecutedOrRunning;
            this.shareService.ispromoExecutedOrRunning.next(this.promoExecutedOrRunning);
          }
          
          GlobalConstants.promotionSplitHelper = JSON.parse(data.response.promotionSplitHelper);
          if(Object.keys(data.response.promotionSplitHelper).length > 0) {
            GlobalConstants.varArgs = GlobalConstants.promotionSplitHelper.splitsGroups[0].channels[0].varArgs.root.item;
          }
        }
        GlobalConstants.isEditMode = this.isTemplateEditMode;
        this.loadCurrentObj();
        this.EditLoadData();
      }else if(data.status == "FAIL"){
        this.loader.HideLoader();
      }
      /*this.loadFunnelChart();
      this.loadClickPerformance()
      this.clickAndOpenRateChart();  */ 
  }
  
  EditLoadData(){
    if(this.isTemplateEditMode){
       this.shareService.channelsPayloadObj.next(this.editModeData);        
        GlobalConstants.payLoadSavedObjAllChannels = this.editModeData; // set channel obj
        const curtObj = this.editModeData.find(x => x.promoSplitKey == this.currentSplitId);
        console.log(this.editModeData);
        if(typeof(curtObj) != "undefined"){
          this.vendorDesc = curtObj.senderName;
          this.preHeader =curtObj.preHeader;
          this.subject = curtObj.subjectLine;
          this.getRunningOrExecutedObj();
          //GlobalConstants.isPreviewMode = true;      
          this.isPreview = true;          
          this.setIframeStyle(this.loadThumbnailContent);
          this.shareService.failSafePreviousTab.next(0);
          this.shareService.isTemperarySave.next(true);                
        }else{          
         this.backToTemplateView();
        }    
      this.loader.HideLoader();     
    }
    else if(this.isPayload){
      this.isPreview = true; 
      GlobalConstants.isPreviewMode = this.isPreview;             
      this.loader.HideLoader();
    } 
 
  }
   async loadHeatMapChart(){
    let data:any = [];
    let chatDataObj =   GlobalConstants.promotionSplitHelper.splitsGroups[0].channels[0].templateUrlClickHeatMap; 
    let links = Object.keys(chatDataObj); 
    await this.createHrefMap();
    console.log(this.coordinatesMap);
    for (let index = 0; index < links.length; index++) {
      let obj = this.coordinatesMap[links[index]];
      if(obj != undefined) {
        data.push( { x: parseInt(obj.x), y: parseInt(obj.y), value: parseInt(chatDataObj[links[index]]) });
      }  
    }  
    this. heatmapConfiguration = {
      container: document.getElementById('heatMapContainer')
           //, radius:20    
   }  
   if(h337){
    var heatmap = h337.create(this.heatmapConfiguration);    
    heatmap.setData({
       data:data,
        min: 0
    });    
   }
 }
 
numFormatter(num) {
    if(num > 999 && num < 1000000){
        return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    }else if(num > 1000000){
        return (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    }else if(num < 900){
        return num; // if value < 1000, nothing to do
    }
}
formatDate(inputdate){
  let monthNames :any ={
     "01":"Jan",
     "02":"Feb",
     "03":"Mar",
     "04":"Apr",
     "05":"May",
     "06":"Jun",
     "07":"Jul",
     "08":"Aug",
     "09":"Sep",
     "10":"Oct",
     "11":"Nov",
     "12":"Dec"
  }
  let formattedDate : string = ""
  formattedDate = formattedDate + inputdate.slice(-2) + "-" + monthNames[inputdate.substr(4,2)] + "-" + inputdate.substr(0,3)
  return formattedDate;
}
createHrefMap(){
  return new Promise(resolve => {
    setTimeout(() => {
      var emailContent:any = document.querySelector('#emailContent .text-center');
      var emailTemplate : any =  document.getElementById("thumbnailContent");
      var anchorTags;
      anchorTags = emailTemplate.contentDocument.getElementsByTagName("a");
      //anchorTags = emailTemplate.contentDocument!.getElementsByTagName("a");
      var iframeCtrHeightDiff = emailContent.offsetHeight - emailTemplate.offsetHeight;
      for (let a = 0; a<anchorTags.length ; a++) {
        let anchorCoordinates = anchorTags[a].getBoundingClientRect();
        let hrefLink = anchorTags[a].href;
        let lastChar = hrefLink.substr(hrefLink.length-1);
        if(lastChar==='/'){
          hrefLink = hrefLink.substr(0,hrefLink.length-1);
        }
        this.coordinatesMap[hrefLink] =
                                {"x": (anchorCoordinates.left),
                                "y":(anchorCoordinates.top + iframeCtrHeightDiff)
                                };
      }
      resolve('resolved');
    }, 2000);
  });
}
  loadFunnelChart(){
    //let chatDataObj =   GlobalConstants.promotionSplitHelper.splitsGroups[0].channels[0].conversationFunnel;  
    let chatObj = GlobalConstants.promotionSplitHelper.splitsGroups.filter(c => c.splitId === this.currentSplitId)
    let chatDataObj =   chatObj[0].channels[0].conversationFunnel;  

    this.deliveredCount =this.numFormatter(chatDataObj.deliveredCount);
    this.openCount = this.numFormatter(chatDataObj.openCount);
    this.clickCount = this.numFormatter(chatDataObj.clickCount);
    this.totalPurchase =this.numFormatter(chatDataObj.totalPurchase);

    this.openRate = this.numFormatter(chatDataObj.openRate);
    this.clickRate = this.numFormatter(chatDataObj.clickRate);

    let chartData : { value: number}[] =  [];
    chartData[1] = { value: this.openCount}
    chartData[2] = { value: this.clickCount}
    chartData[0] = { value: this.deliveredCount}
    chartData[3] = { value: this.totalPurchase}

    /* let chartlegend = Object.keys(chatDataObj);
      let chartData : { value: number}[] =  [];
      for (let index = 0; index < chartlegend.length; index++) {
        chartData[chartData.length] = { value: chatDataObj[chartlegend[index]]}
      } */
      this.funnelChartOption= {        
        tooltip: {
          trigger: 'item',
          formatter: '{c}'
        }, 
        color:['#7D99B6','#7BD47A','#49B0D9','#F8A850'],      
        series: [
          {
            name: 'Funnel',
            type: 'funnel',
            left: '0',
            top: 15,
            bottom: 15,
            width: '100%',
            min: 0,
            max: 100,
            minSize: '0%',
            //maxSize: '100%',
           
            gap: 2,
            label: {
              show: true,
              position: 'inside'
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 20
              }
            },
            data: chartData
          }
        ] 
      }
    }
  loadClickPerformance(){
    //let chatDataObj =   GlobalConstants.promotionSplitHelper.splitsGroups[0].channels[0].clickPerformance; 
    let chatObj = GlobalConstants.promotionSplitHelper.splitsGroups.filter(c => c.splitId === this.currentSplitId)
    let chatDataObj =   chatObj[0].channels[0].clickPerformance;


    let xaisData = Object.keys(chatDataObj);
    let morningData : { value: number}[] =  [];
    let noonData : { value: number}[] =  [];
    let eveningData : { value: number}[] =  [];
    for (let index = 0; index < xaisData.length; index++) {
      morningData[morningData.length] = chatDataObj[xaisData[index]].MORNING;
      noonData[noonData.length] = chatDataObj[xaisData[index]].NOON;
      eveningData[eveningData.length] = chatDataObj[xaisData[index]].EVENING;
      xaisData[index] = this.formatDate(xaisData[index]);
    }
    this.clickPerformanceChartOption  = {
       tooltip: {
        trigger: 'axis',
        axisPointer: {
          // Use axis to trigger tooltip
          type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
        }
      },      
      xAxis: {
         type: 'category',
        data: xaisData
       
      },
      yAxis: {
        type: 'value'
      },
      color:['#03BD5B','#50E3C2','#F5A623'], 
      series: [       
        {
          name: 'Morning',
          type: 'bar',
          stack: 'total',
          barGap: '5%',
          emphasis: {
            focus: 'series'
          },
          data: morningData,
          barWidth: '15%'

        },
        {
          name: 'Noon',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: noonData,
          barWidth: '15%',
          barGap: '5%',
        },
        {
          name: 'EVENING',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: eveningData,
          barWidth: '15%',
          barGap: '5%',
        }
      ]
    };
  }
  clickAndOpenRateChart(){
    //let chatDataObj =   GlobalConstants.promotionSplitHelper.splitsGroups[0].channels[0].openClickDistrubution;
    let chatObj = GlobalConstants.promotionSplitHelper.splitsGroups.filter(c => c.splitId === this.currentSplitId)
    let chatDataObj =   chatObj[0].channels[0].openClickDistrubution;
    let yaxisData = ['Last7Days','Last30Days','Last90Days','Overall']    
    let openrate : { value: number}[] =  [];
    let clickrate : { value: number}[] =  [];
    for (let index = 0; index < yaxisData.length; index++) {     
      openrate[openrate.length] = chatDataObj[yaxisData[index]].OPENRATE;
      clickrate[clickrate.length] = chatDataObj[yaxisData[index]].CLICKRATE;     
    }
    this.clickOpenRateOption =  {
     
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        valueFormatter:(value) =>  value+'%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      color:['#F8B3D3','#F9AF8D'],  
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        axisLabel: {
          formatter: '{value} %'
        }
      },
      yAxis: {
        type: 'category',
        data:yaxisData,
        axisTick: {
          show: false
        }
      },
      series: [
        {
          name: 'Open Rate',
          type: 'bar',
          data:openrate
        },
        {
          name: 'ClickRate',
          type: 'bar',
          data: clickrate
        }
        
      ]
    };   
  }
  // loadEditorFresh(){
  //   //Load Bee Editor pre-template
  //   this.defaultTemplateEnabled();
  //   this.isPreTemplate = true; // links active
  //   this.isPreview = false;
  //   GlobalConstants.isPreBuildTemp = this.isPreTemplate;
  //   this.loader.HideLoader();
  //   //}
  // }
  loadCurrentObj(){
    this.shareService.currentSelectedChannelObj.subscribe((res:any) => {
      this.currentSplitId = res.currentSplitId;
      this.promoKey = res.promotionKey;
      this.commChannelKey=res.commChannelKey;
      this.channelName = res.channelName;
      this.loadFunnelChart();
      this.loadClickPerformance()
      this.clickAndOpenRateChart(); 
    });
  }
  
  getPayLoadJson(){
    //this.loadCurrentObj();
    this.payloadSavingJson = GlobalConstants.payLoadSavedObjAllChannels;
    this.vendorDesc = this.payloadSavingJson.channels[0].subjectObj.vendorDesc;
    this.subject = this.payloadSavingJson.channels[0].subjectObj.subject;
    this.preHeader = this.payloadSavingJson.channels[0].subjectObj.preHeader;
    this.tempId = this.payloadSavingJson.channels[0].uuid;
    this.isPayload = true;
    this.imgThumbnailView = JSON.parse(this.payloadSavingJson.channels[0].thumbnailImage).thumbnail_desktop;
    this.imgThumbnailMobileView = JSON.parse(this.payloadSavingJson.channels[0].thumbnailImage).thumbnail_mobile;
  }
  getRunningOrExecutedObj(){// old promotion saved already on load data
    let subObj = {};
    this.payloadSavingJson = GlobalConstants.payLoadSavedObjAllChannels;
    const cuurtObj = this.payloadSavingJson.find(x => x.promoSplitKey == this.currentSplitId);
    this.isPayload = true;
    this.imgThumbnailView = JSON.parse(cuurtObj.thumbnailImage).thumbnail_desktop;
    this.imgThumbnailMobileView = JSON.parse(cuurtObj.thumbnailImage).thumbnail_mobile;
    this.loadThumbnailContent = cuurtObj.templateText;    
  }
  getPromotionKey(): void {   
    const url = window.location.href;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      this.promoKey = httpParams.get("promotionKey");
      GlobalConstants.promoKey = this.promoKey;      
      this.promoCommKey = httpParams.get("promoCommunicationKeys");
      GlobalConstants.promoCommKey = this.promoCommKey;
      this.promotionObj={ "promoKey":this.promoKey,"promoCommKey":this.promoCommKey }
      this.shareService.promoKeyObj.next(this.promotionObj);      
    }else{
      if(GlobalConstants.isSavedEmails && GlobalConstants.promoKey !== undefined){
        this.promoKey=GlobalConstants.promoKey;
        this.promoCommKey = GlobalConstants.promoCommKey;

      }
    }
  }
  directCallToBeeEditor(){
    this.isPreview = false;
    if(Object.keys(this.editModeData.length > 0)){
      this.shareService.savedTemplateObj.next(this.editModeData);
      // reset when incomplete promo edit again
      this.payloadSavingJson={}
    GlobalConstants.payLoadSavedObjAllChannels = [];    
      this.router.navigate(['/bee-editor']);
    }    
}
  getDeviceView(deviceId){
    if(deviceId == "Desktop"){
      this.isMobileView = false;
    }else{
      this.isMobileView = true;
    }
    
  }
  openPreviewModal(template: TemplateRef<any>) {
    if(typeof(this.tempId) !== 'undefined'){
      if(this.selectedItem == '0' && this.tempId === 1){
      this.shareService.isDefaultStorageBee.next(this.isDefaultStorageBEE); 
      let urlPath = this.accessTemplatesContentFrom(this.isDefaultStorageBEE,this.tempId);  
      GlobalConstants.urlPath = urlPath;
      this.onAdd.emit(urlPath);
      GlobalConstants.vendorObj = this.vendorObj;
      GlobalConstants.channelObj = this.channelObj;
      GlobalConstants.promoKey=this.promoKey;
      GlobalConstants.promoCommKey=this.promoCommKey;
      GlobalConstants.isPreviewMode = this.isPreview;
      GlobalConstants.templateKey = this.tempId;
      this.router.navigate(['/bee-editor']);      
        //this.directCallToBeeEditor();
      }else{
        if(this.imgThumbnailView === undefined && this.imgThumbnailMobileView === undefined){
         this.shareService.isDefaultStorageBee.next(this.isDefaultStorageBEE);
         const urlPath = this.accessTemplatesContentFrom(this.isDefaultStorageBEE,this.tempId);
          if(this.isPreTemplate){
            this.getPreviewTemplateHTML(urlPath);
          }else{
            this.getPreviewTemplateHTML(AppConstants.API_END_POINTS_OTHERS.GET_SELECTED_TEMPLATE_CONTENT+this.tempId);
          }        
        }        
        this.isPreview = true;  
        GlobalConstants.isPreviewMode = this.isPreview;  
        //------ Create Thumbnail using Html code---------  
        // setTimeout(() => {
        //   let ele: any = document.querySelector('#thumbnailContent');
        //   ele.contentDocument.body.insertAdjacentHTML('beforebegin',this.loadThumbnailContent);
        // },1000);  
      }  
    }       
  }
  
  getDefaultTemplates(url){
    if(this.isDefaultStorageBEE){
      this.http.getBee(url).subscribe(data => {
        this.getResponeData(data.body.results);  
      });     
    }else{
      this.http.get(url).subscribe(data => {
        this.getResponeData(data.body.results);  
      });     
    } 
  }
  async getPreviewTemplateHTML(url){      
    const html = await this.http.post(url).toPromise();
    if(html !== undefined){
      //this.loadThumbnailContent = html; 
      this.imgThumbnailView = html.thumbnail;
      this.imgThumbnailMobileView=html.thumbnail;
    }    
}

  
  getResponeData(data){
    // ---------- Pre template -----------
    if(this.isTemplateType == 0){
      this.loadTemplates = data;
      this.tempId = this.loadTemplates[0].uuid;
    }else{
      //--------- My template ------------
      this.loadTemplates = data;
      this.tempId = this.loadTemplates[0].uuid;
      //this.promoKey = this.loadTemplates.promoKey;      
    }       
  }
  getThumbnailImg(obj: showThumbnail){
    // obj.thumbnail_desktop = this.templateConentObj.thumbnail_large;
    // obj.thumbnail_mobile = this.templateConentObj.thumbnail;
    this.shareService.thumnailImages.next(obj);
  }
  sortByLatest(){
    this.loadTemplates.sort((a, b) => (a.order < b.order ? -1 : 1));
    this.latest = true;
  }
  sortByOldest(){
    this.loadTemplates.sort((a, b) => (a.order > b.order ? -1 : 1));
    this.latest = false;
  }
  searchTemplate(event){
    if(event.target.value === '') {
      this.accessDefaultTemplatesFrom(this.isDefaultStorageBEE);    
    } else {
      this.loadTemplates = this.loadTemplates.filter((item) => {
        return item.title.toLowerCase().indexOf(event.target.value.toLowerCase().trim()) > -1;
      });
    }    
  }
  getThumbnailView(imgView, mobileView){
    this.defaultPreview =   imgView;
  }
  getThumbnailId(imgView, mobileView,id,index){
    this.tempId = "";
    this.tempId = id;    
    this.selectedItem = index;
    this.imgThumbnailView = imgView;
   this.imgThumbnailMobileView = mobileView;
  GlobalConstants.templateKey = this.tempId;
  this.templateConentObj={"thumbnail_desktop":this.imgThumbnailView,"thumbnail_mobile":this.imgThumbnailMobileView}
  this.getThumbnailImg(this.templateConentObj);
  }
  editTemplateSelected(){
    if(this.isTemplateEditMode){
      this.templateConentObj={"thumbnail_desktop":this.imgThumbnailView,"thumbnail_mobile":this.imgThumbnailMobileView}
      this.getThumbnailImg(this.templateConentObj);
      this.directCallToBeeEditor();
      GlobalConstants.isPreviewMode = this.isPreview;
    }else{
      let urlPath: any;
      this.isPreview = false;
      GlobalConstants.isPreviewMode = this.isPreview;
      this.shareService.isDefaultStorageBee.next(this.isDefaultStorageBEE);
      this.shareService.failSafeEnable.next(false);
      if(this.isPreTemplate){
        urlPath = this.accessTemplatesContentFrom(this.isDefaultStorageBEE,this.tempId);  
      }else{
        urlPath = AppConstants.API_END_POINTS_OTHERS.GET_SELECTED_TEMPLATE_CONTENT+this.tempId;  
      }        
      GlobalConstants.urlPath = urlPath;
      this.onAdd.emit(urlPath);
      this.loadCurrentObj();
    }   
  }
  switchLink(evnt){
    const ele = evnt.target.value;
    this.loadTemplates = [];
    if(ele == '0'){
      this.isPreTemplate = true;
      this.selectedItem = 0;
      GlobalConstants.isPreBuildTemp = this.isPreTemplate;      
      //'https://beefree.io/wp-json/v1/catalog/templates//?page=1&pagesize=30&context=free',ele);
      this.accessDefaultTemplatesFrom(this.isDefaultStorageBEE);
    }else{
      this.isPreTemplate = false;
      this.selectedItem = 0;      
      this.imgThumbnailView = undefined;
      GlobalConstants.isPreBuildTemp = this.isPreTemplate;      
      this.accessDefaultTemplatesFrom(this.isDefaultStorageBEE);     
    }
  }
  accessDefaultTemplatesFrom(storageFrom){
    if(storageFrom){
      // From BEE Storage
      this.getDefaultTemplates(AppConstants.API_END_POINTS_OTHERS.GET_BEE_TEMPLATES);
    }else{
      // From S3 Storage
      if(this.isPreTemplate){
        this.getDefaultTemplates(AppConstants.API_END_POINTS_OTHERS.GET_S3_TEMPLATES);
      }else{
        this.getDefaultTemplates(AppConstants.API_END_POINTS_OTHERS.GET_MY_TEMPLATES);
      }      
    }
  }
  accessTemplatesContentFrom(storageFrom,templateId){
    let url:any = "";
    if(storageFrom){
      // From BEE Storage Content
      url = AppConstants.API_END_POINTS_OTHERS.GET_TEMPLATE_CONTENT+templateId;
    }else{
      // From S3 Storage Content
      url =  AppConstants.API_END_POINTS_OTHERS.GET_S3_TEMPLATE_CONTENT+templateId;
    }
    return url;
  }
  async defaultTemplateEnabled(){
    const defaultStorageFlagBackEnd = await this.http.get("/configurationProperty/getProperty?property.name=pp.bee.template.default.enabled").toPromise();
    if(defaultStorageFlagBackEnd !== null || defaultStorageFlagBackEnd !== undefined){
      this.isDefaultStorageBEE = defaultStorageFlagBackEnd.body;
      this.accessDefaultTemplatesFrom(this.isDefaultStorageBEE);
      console.log(defaultStorageFlagBackEnd.body);
    }
  }

  backToTemplateView(){    
    if(this.isTemplateEditMode && this.isPreview){
    this.confirmAlert();            
    }else{
      this.initTempLoad();
    }
  }
  initTempLoad(){
    this.isTemplateEditMode = false;
    this.isPreview = false;
    this.selectedItem = 0;
    this.imgThumbnailView = undefined;
    this.imgThumbnailMobileView = undefined; 
    this.defaultPreview = undefined;
    if(this.loadTemplates !== undefined){
      this.tempId = this.loadTemplates[0].uuid; // asigning to default empty template.
    }else{
      this.tempId = undefined // asigning to default empty template.
    }
    this.tempId = this.loadTemplates[0].uuid; // asigning to default empty template.
    this.isPayload = false;
    GlobalConstants.isEditMode = false;
  }
  onsave(){
    const beeInit = new BeefreeSDK();
  }
  confirmAlert(){
    Swal.fire({
      title: this.translate.instant('designEditor.failsafePage.confirmationMgs.savedDatawillbeLostMgslbl'),
      //text: 'Your saved data will be lost!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('yes'),
      cancelButtonText: this.translate.instant('cancel')
    }).then((result) => {
      if (result.value) {
        this.initTempLoad();
      }
    })
  }
  loadFreshChannel(isFalse){
    this.isPayload = isFalse;
    this.isTemplateEditMode = isFalse;
    GlobalConstants.isEditMode = isFalse;
    GlobalConstants.isPreviewMode = isFalse;
    this.isPreview = isFalse;
    GlobalConstants.templateKey = 1;
  }
  loadSavedChannel(savedObj){
    if(savedObj !== undefined){
    const savedObjCurrent = savedObj.find(x => x.promoSplitKey == this.currentSplitId);
    const isTrue = true;
    const thumbnailImg = JSON.parse(savedObjCurrent.thumbnailImage);
    let index = this.channelObj.findIndex(x => x.promoSplitId == savedObj.promoSplitKey);
    if(index == undefined){
      index = 0;
    }  
    this.vendorDesc= savedObjCurrent.senderName;
    this.imgThumbnailMobileView= thumbnailImg.thumbnail_mobile;
    this.imgThumbnailView=thumbnailImg.thumbnail_desktop;
    this.isPayload = isTrue;
    this.isTemplateEditMode = isTrue;
    GlobalConstants.isEditMode = isTrue;
    GlobalConstants.isPreviewMode = isTrue;
    this.isPreview = isTrue;
    GlobalConstants.templateKey = savedObjCurrent.templateParentKey; 
    if(this.isFailsafeactiveTab){
      index = 1;
      if(savedObjCurrent.failSafe){
        this.preHeader= savedObjCurrent.failSafePreHeader;
        this.subject= savedObjCurrent.failSafeSubjectLine;
        GlobalConstants.setActiveTab = index;
        this.shareService.activeSplitId.next(index); 
        this.loadThumbnailContent = savedObjCurrent.failSafetemplateText;
        this.setIframeStyle(this.loadThumbnailContent);
      }      
    }else{
      index = 0;
      this.preHeader= savedObjCurrent.preHeader;
      this.subject= savedObjCurrent.subjectLine;
      GlobalConstants.setActiveTab = index;
      this.shareService.activeSplitId.next(index); 
      this.loadThumbnailContent = savedObjCurrent.templateText;
      this.setIframeStyle(this.loadThumbnailContent);
    }    
  }else{
    if(Object.keys(this.loadTemplates).length > 0){
      this.accessDefaultTemplatesFrom(this.isDefaultStorageBEE);
    }
  }
  this.loader.HideLoader();
}
 async setIframeStyle(loadIframeContent){
   
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        let ele: any = document.querySelector('#thumbnailContent');
         if(ele !== null){
          ele.contentDocument.head.innerHTML = "";
          ele.contentDocument.head.innerHTML = "<style type='text/css'>table{width: 100% !important;}<style>";
          ele.contentDocument.body.innerHTML = loadIframeContent; 
          resolve({});        
        }          
      },1000);
   });
    promise.then(values => {
      this.loadHeatMapChart();
    });
}

}
