import { Component, OnInit, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpService } from '@app/core/services/http.service';
import { TestSMS, TestWhatsapp, UserList } from '@app/core/models/journey';
import { SharedataService } from '@app/core/services/sharedata.service';
import { TestEmail } from '@app/core/models/journey';
import { DataService } from '@app/core/services/data.service';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants } from '@app/app.constants';
import Swal from 'sweetalert2';
import { filter } from 'lodash';
import { list } from 'postcss';

@Component({
  selector: 'app-test-email',
  templateUrl: './test-email.component.html',
  styleUrls: ['./test-email.component.scss']
})
export class TestEmailComponent implements OnInit {
  @Input('dataFromParent') modalRef?: BsModalRef;
  @Input('pushNotifyObj') pushNotifyObj: any;
  @Input('finalInappPayloadData') finalInappPayloadData: any;
  @Input('finalAPIPayloadData') finalAPIPayloadData: any;
  emailList: string[] = [];
  smsList: number[] = [];
  inputEmail: string = '';
  inputSMS: string = '';
  sendTo: string = 'email';
  customerCode: string = '';
  customerCodechecked: boolean = false;
  isTestList: boolean = false;
  isTestSMSList: boolean = false;
  responseReceived: boolean = false;
  testEmailResponse: any = {};
  successDelivery: boolean = true;
  errorFileName: string = '';
  showLoader: boolean = false;
  private BASE_URL = environment.BASE_URL;
  customerList: UserList[] = [];
  channelType: any;
  CHANNEL_INFO_HTML = AppConstants.CHANNEL_INFO;
  inputAndroidDeviceId: string = '';
  inputIOSDeviceId: string = '';
  testEmailObj: TestEmail = {
    subject: '',
    msgContent: '',
    toAddr: this.emailList.toString(),
    customercode: this.customerCode,
    senderName: '',
    isTestList: this.isTestList,
    promoKey: '',
    commChannelKey: '',
    testListId: 0,
    currentSplitid: '',
    senderId: '',
    preHeader:'',
    testMsgFields: {},
    isTestListCreate:false,
    testListName:''
  }
  
  testSMSObj: TestSMS = {
    commChannelKey: '',
    currentSplitid: '',
    customercode: this.customerCode,
    isTestList: false,
    msgContent: '',
    promoKey: '',
    senderId: '',
    senderName: '',
    testListId: 0,
    toAddr: this.smsList.toString(),
    smsMultiSplit: false,
    unicodeEnable: false,
    selectedOffers: [],
    selectedRecoWidgets:[],
    testMsgFields: {},
    isTestListCreate:false,
    testListName:''

  }
  testWhatsappObj: TestWhatsapp = {
    commChannelKey: '',
    currentSplitid: '',
    customercode: this.customerCode,
    isTestList: false,
    msgContent: '',
    promoKey: '',
    senderId: '',
    senderName: '',
    testListId: 0,
    toAddr: this.smsList.toString(),
    //smsMultiSplit: false,
    unicodeEnable: false,
    testMsgFields: {},
    isTestListCreate:false,
    testListName:''
    //selectedOffers: [],
    //selectedRecoWidgets:[]

  }
  currentSplitId: any;
  isfailSafeActiveTab: boolean = false;
  isTemplateEditMode: boolean = false;
  androidDeviceIds:any = [];
  iosDeviceIds:any = [];
  enableTestWithParams: boolean = true; // Flag to enable/disable test with params section
  
  personalizedFields: any;  
  testMsgFields: any;
  addDropdownObj: any;
  filterSeedListOption: any = [];
  showSeedListDropdown: boolean = false;
  selectedSeedValue:any;
  seedListNameInputEnable:boolean = false;
  seedListName:string = '';
  commChannelkey: any;
  currentObj: any;
  searchFilterListIption: any;
  testListId: any = 0;
  channelNameText: any;
  savedListAddressArry: any = [];
  savedListAddressArryAndriod: any = [];
  savedListAddressArryIos: any = [];
  seedListAddLimit = AppConstants.CONSTANT_VALUES.SEED_LIST_ADD_LIMIT;
  constructor(private modalService: BsModalService, 
    private httpService: HttpService, 
    private shareService: SharedataService,
    private dataService: DataService, private translate:TranslateService) { 
      this.shareService.failSafeTabActive.subscribe(res => {
        this.isfailSafeActiveTab = res;
      });
      this.shareService.isEditMode.subscribe(res => {
        this.isTemplateEditMode = res;
      });
      
    }
    
  closeTestEmail(): void {
    if(this.modalRef !== undefined) {
      this.modalRef.hide();
    }
  }
  checkCustomerCodeValue(evt){
    this.customerCode = "";
  }
   
  enableTestNameInputMethod(evt){
    let isVal = evt.target === undefined ? evt : evt.target.checked;
    if(isVal){
      this.seedListNameInputEnable = true;
    }else{
      this.seedListNameInputEnable = false;
    }    

  }

  addAndroidIosDeviceId(type,val): void {
    if(type === 'android') {
      let deviceIdArry = val.split(',');
      for(let item of deviceIdArry) {
        let selectedItem = item.trim();
        if(selectedItem !== '' && this.androidDeviceIds.indexOf(selectedItem) === -1) {   
          if((this.androidDeviceIds.length + this.iosDeviceIds.length) < this.seedListAddLimit){
            this.androidDeviceIds.push(selectedItem);
            this.inputAndroidDeviceId = ''; // Clear input field after adding
          }else{
            let channelId = this.translate.instant('designEditor.testEmailComponent.deviceIdLbl');
            let channelIdLabel = this.translate.instant('designEditor.testEmailComponent.channelIdAddLimitMsgLbl').replace('#channelId#',channelId);
            this.dataService.SwalAlertSuccesOrFailMgs(channelIdLabel +" "+ this.seedListAddLimit,"warning");
          }
          } else {
            this.dataService.SwalAlertSuccesOrFailMgs(selectedItem +" "+ this.translate.instant('designEditor.testEmailComponent.alreadyExistslbl'),"warning");
          }        
      }      
    }else{ // IOS 
        let deviceIdArry = val.split(',');
        for(let item of deviceIdArry) {
          let selectedItem = item.trim();
          if(selectedItem !== '' && this.iosDeviceIds.indexOf(selectedItem) === -1) {   
            if((this.androidDeviceIds.length + this.iosDeviceIds.length) < this.seedListAddLimit){
              this.iosDeviceIds.push(selectedItem);
              this.inputIOSDeviceId = ''; // Clear input field after adding
            }else{
              let channelId = this.translate.instant('designEditor.testEmailComponent.deviceIdLbl');
              let channelIdLabel = this.translate.instant('designEditor.testEmailComponent.channelIdAddLimitMsgLbl').replace('#channelId#',channelId);
              this.dataService.SwalAlertSuccesOrFailMgs(channelIdLabel +" "+ this.seedListAddLimit,"warning");
            }              
            } else {
              this.dataService.SwalAlertSuccesOrFailMgs(selectedItem +" "+ this.translate.instant('designEditor.testEmailComponent.alreadyExistslbl'),"warning");
            }        
        } 
    }    
  }
  removeAndroidDeviceId(deviceId: string): void {
    this.androidDeviceIds = this.androidDeviceIds.filter((item) => item !== deviceId);
  }
  removeIOSDeviceId(deviceId: string): void {
    this.iosDeviceIds = this.iosDeviceIds.filter((item) => item !== deviceId);
  } 
  addEmails(): void {
    let re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    let emailArr = this.inputEmail.split(',');

    for(let item of emailArr) {
      let selectedItem = item.trim();
      if(selectedItem !== '') {
        if(selectedItem.match(re)) {
          if(this.emailList.indexOf(selectedItem) === -1) {
            if(this.emailList.length < this.seedListAddLimit){ 
              this.emailList.push(selectedItem);
            }else{
              let channelId = this.translate.instant('designEditor.testEmailComponent.emailIdLbl');
              let channelIdLabel = this.translate.instant('designEditor.testEmailComponent.channelIdAddLimitMsgLbl').replace('#channelId#',channelId);
              this.dataService.SwalAlertSuccesOrFailMgs(channelIdLabel +" "+ this.seedListAddLimit,"warning");
            }            
          } else {
            this.dataService.SwalAlertSuccesOrFailMgs(selectedItem +" "+ this.translate.instant('designEditor.testEmailComponent.alreadyExistslbl'),"warning");
          }
        } else {
          this.dataService.SwalAlertSuccesOrFailMgs(selectedItem +" "+ this.translate.instant('designEditor.testEmailComponent.validEmailAddresslbl'),"warning");
        }
      }
    }
    this.inputEmail = '';
  }

  removeEmail(email :string): void {
    this.emailList = this.emailList.filter((item) => item !== email);
  }

  removeSMS(smsNumber :number): void {
    this.smsList = this.smsList.filter((item) => item !== smsNumber);
  }

  getUserDetails(type: string): void {
    //this.customerCodechecked = false;
    if(type === 'list') {
      this.isTestList = true;
      this.sendTo = 'list';
      this.selectedSeedValue = '';
      if(this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.EMAIL){
        this.emailList = [];
      }else if (this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.SMS_CHANNEL || this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.WHATS_APP_CHANNEL){
        this.smsList = [];
      }else if (this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.PUSH_NOTIFICATION || this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.INAPP_NOTIFICATION){
        this.androidDeviceIds = [];
        this.iosDeviceIds = [];
      }   
    } else {
      if(this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.EMAIL){
        this.testEmailObj.testListId = 0;
        this.emailList = this.savedListAddressArry ? this.savedListAddressArry : [];
        this.inputEmail = '';
      }else if (this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.SMS_CHANNEL){
        this.testSMSObj.testListId = 0;
        this.smsList = this.savedListAddressArry ? this.savedListAddressArry : [];
        this.inputSMS = '';
      }else if (this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.WHATS_APP_CHANNEL){
        this.testWhatsappObj.testListId = 0;
        this.smsList = this.savedListAddressArry ? this.savedListAddressArry : [];
        this.inputSMS = '';
      }else if (this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.PUSH_NOTIFICATION || this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.INAPP_NOTIFICATION){
        this.androidDeviceIds = this.savedListAddressArryAndriod ? this.savedListAddressArryAndriod : [];
        this.inputAndroidDeviceId = '';
        this.iosDeviceIds = this.savedListAddressArryIos ? this.savedListAddressArryIos : [];
        this.inputIOSDeviceId = '';       
        
      }      
      this.sendTo = 'email';
      this.isTestList = false;
    }
  }
  selectSeedListMethod(obj){
    this.showSeedListDropdown = false;
    this.selectedSeedValue = obj.listName;
    this.testListId = obj.dbKey;
    if(this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.EMAIL){
      this.testEmailObj.testListId = obj.dbKey;
      this.emailList = obj.toAddress.split(',');
    }else if (this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.SMS_CHANNEL || this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.WHATS_APP_CHANNEL){
      this.testSMSObj.testListId = obj.dbKey;
      this.smsList = obj.toAddress.split(',');
    }else if( this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.PUSH_NOTIFICATION || this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.INAPP_NOTIFICATION){
      let deviceIdsArrForAndriod = obj.toAndroid.split(',');
      let deviceIdsArrForIos = obj.toIOS.split(',');
      this.androidDeviceIds = deviceIdsArrForAndriod;
      this.iosDeviceIds = deviceIdsArrForIos;    
  }
}
  getTestListData(): void {
    this.httpService.post('/promoChannel/getList').subscribe((data) => {
      this.customerList = data.response;
    });
  }

  selectRow(key: number): void {
    this.testEmailObj.testListId = key;
  }

  isActive(key: number) {
    return this.testEmailObj.testListId === key;
  }

  downloadReport(): void {
    window.open(`${this.BASE_URL}/promoChannel/downloadTestErrorReport?name=${this.errorFileName}`, '_parent');
  }

  sendTestEmails(): void {
    // Validations
    if(!this.isTestList && this.emailList.length === 0) {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.testEmailComponent.pleaseEnterOneRmoreEmailIDslbl'));
      return;
    }

    if(this.isTestList && this.testEmailObj.testListId === 0) {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.testEmailComponent.pleaseSelectTheListItemlbl'));
      return;
    }

    if(this.customerCodechecked && this.customerCode === '') {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.testEmailComponent.customerCodeisRequiredlbl'));
      return;
    }

    if(this.customerCode === '') {
      this.customerCode === null;
    }
    this.showLoader = true;
    this.collectDataForTestMsgFieldsMethod(this.emailList);
    //this.loadCurrentObj();
    this.shareService.testEmailObj.subscribe((res:any) => {
      if(res != undefined) {
        // if(this.isTemplateEditMode){
        //   var crrntObj = res; 
        //   if(crrntObj != undefined){
        //     if(this.isfailSafeActiveTab){
        //       this.testEmailObj.subject = crrntObj.failSafeSubjectLine;
        //       this.testEmailObj.preHeader = crrntObj.failSafePreHeader;
        //      }else{
        //       this.testEmailObj.subject = crrntObj.subjectLine;
        //       this.testEmailObj.preHeader = crrntObj.preHeader;
        //      } 
        //      this.testEmailObj.msgContent = crrntObj.templateText;
        //      this.testEmailObj.senderName = crrntObj.senderName;
        //      this.testEmailObj.promoKey = crrntObj.promoKey;
        //      this.testEmailObj.commChannelKey = crrntObj.commChannelKey;
        //      this.testEmailObj.currentSplitid = crrntObj.promoSplitKey;
        //      this.testEmailObj.senderId = crrntObj.senderId;
        //   }
        // }
    //else{
          var crrntObj = res.channels.find(x => x.promoSplitKey == this.currentSplitId);          
          if(crrntObj != undefined){
            this.commChannelkey = crrntObj.commChannelKey;
            if(this.isfailSafeActiveTab){
              this.testEmailObj.subject = encodeURIComponent(crrntObj.failSafeInfo.failsafeSubObj.subject);
              this.testEmailObj.preHeader = encodeURIComponent(crrntObj.failSafeInfo.failsafeSubObj.preHeader);
              this.testEmailObj.msgContent = crrntObj.failSafeInfo.html;
             }else{
              /* let subjectString = crrntObj.subjectObj.subject;
              subjectString = subjectString.replace(/<\/?[/]span[^>]*>/g,"}").replace(/<\/?span[^>]*>/g,"{");
              subjectString = subjectString.replaceAll("&nbsp;", " "); 
              this.testEmailObj.subject = subjectString; */

              this.testEmailObj.subject = encodeURIComponent(crrntObj.subjectObj.subject);;
              this.testEmailObj.preHeader = encodeURIComponent(crrntObj.subjectObj.preHeader);
              this.testEmailObj.msgContent = crrntObj.html;
             }             
             this.testEmailObj.senderName = crrntObj.subjectObj.senderName;
             this.testEmailObj.promoKey = crrntObj.PromotionKey;
             this.testEmailObj.commChannelKey = crrntObj.channelId;
             this.testEmailObj.currentSplitid = crrntObj.promoSplitKey;
             this.testEmailObj.senderId = crrntObj.subjectObj.senderId;
             this.testEmailObj.testMsgFields = this.testMsgFields;
          }
        }                      
        this.testEmailObj.customercode = this.customerCode;
        this.testEmailObj.isTestList = this.isTestList;
        this.testEmailObj.toAddr = this.emailList.toString();
        this.testEmailObj.isTestListCreate = this.seedListNameInputEnable;
        this.testEmailObj.testListName = this.seedListName;
        this.testEmailObj.testListId = this.isTestList ? this.testListId : 0;
     // }
    });

    const body = this.testEmailObj;
    this.httpService.post('/promoChannel/testEmailV2', body).subscribe((data) => {   
      this.showLoader = false;   
      //if(data.status == 'FAIL'){
        this.testEmailSendStatus(data);
      //}      
    });
  }

  ngOnInit(): void {
    this.loadCurrentObj();
  }
  testEmailSendStatus(data){
    this.testEmailResponse = JSON.parse(data.response);
    if(this.testEmailResponse === null && data.message !== null){
      this.dataService.SwalAlertMgs(data.message);
        return;
    } else if(this.testEmailResponse.errorReportFileName !== null) {
      this.responseReceived = true;  
      this.successDelivery = false;
      this.errorFileName = this.testEmailResponse.errorReportFileName;
    } else {
      this.responseReceived = true;  
      this.successDelivery = true;
    }
  }
  loadCurrentObj(){
    this.shareService.currentSelectedChannelObj.subscribe((res:any) => {
      this.channelType = res.channelType;
      this.channelNameText = res.channelType.substring(0,res.channelType.length-4);
      this.currentSplitId = res.currentSplitId;
      this.currentObj = res.currentObj;          
      let filterListDataOnChannelType = res.currentObj.testListData ? res.currentObj.testListData.filter(item => item.channelType == this.channelType) : []; 
      this.filterSeedListOption = filterListDataOnChannelType || [];
      this.searchFilterListIption = this.filterSeedListOption;
      if(res.currentObj.testMsgFields != undefined && res.currentObj.testMsgFields.personalizedFields !== undefined){
        this.personalizedFields = this.addExtraParams(res.currentObj.testMsgFields.personalizedFields);
        this.testMsgFields = res.currentObj.testMsgFields;
        this.showSavedDataOnTestEditMethod(this.testMsgFields,this.channelType);
      }      
    });
  }
  openExtDropdown() {
      this.showSeedListDropdown = !this.showSeedListDropdown;
    }
    showHideSeedlistMethod(){
      setTimeout(() => {
        this.showSeedListDropdown = !this.showSeedListDropdown;
      }, 0);      
    }
    filterExtOptions(event: any) {
      const searchText = event.target.value;
      this.searchFilterListIption = this.filterSeedListOption.filter((option) =>
        option.listName.toLowerCase().includes(searchText.toLowerCase())
      );
      this.showSeedListDropdown = this.searchFilterListIption.length > 0;
      if(this.searchFilterListIption.length == 0){
        if(this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.EMAIL){
          this.emailList = [];
        }else if (this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.SMS_CHANNEL || this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.WHATS_APP_CHANNEL){
          this.smsList = [];
        }else if (this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.PUSH_NOTIFICATION || this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.INAPP_NOTIFICATION){
          this.androidDeviceIds = [];
          this.iosDeviceIds = [];
        }
      }
    }
  showSavedDataOnTestEditMethod(res,channelType){    
      this.customerCode = res.customerCode || '';
      if (res.toAdd) {
        const newEmails = res.toAdd.split(',').map(email => email.trim());
        this.savedListAddressArry = newEmails;
        if(channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.EMAIL){
          this.emailList = Array.from(new Set([...this.emailList, ...newEmails]));
        }else if (this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.SMS_CHANNEL || this.channelType == this.CHANNEL_INFO_HTML.CHANNEL_TYPE.WHATS_APP_CHANNEL){
          this.smsList = Array.from(new Set([...this.smsList, ...newEmails]));
        }        
      }else if(res.toAndroid || res.toIOS){
        //this.androidDeviceIds = (res.toAndroid != undefined && res.toAndroid != '') ? res.toAndroid.split(',') : [];
        //this.iosDeviceIds = (res.toIOS != undefined && res.toIOS != '') ? res.toIOS.split(',') : [];
        if(res.toAndroid){
          const newAndroidDeviceIds = res.toAndroid.split(',').map(id => id.trim());
          this.savedListAddressArryAndriod = newAndroidDeviceIds;
          this.androidDeviceIds = Array.from(new Set([...this.androidDeviceIds, ...newAndroidDeviceIds]));
        }
        if(res.toIOS){
          const newIOSDeviceIds = res.toIOS.split(',').map(id => id.trim());
          this.savedListAddressArryIos = newIOSDeviceIds;
          this.iosDeviceIds = Array.from(new Set([...this.iosDeviceIds, ...newIOSDeviceIds]));
        }
      }      
      if(this.customerCode != '' && this.customerCode != null){
        this.customerCodechecked = true;
      }else{
        this.customerCodechecked = false;
      }
      
  }
  addExtraParams(resObj){
    resObj.map((param) => {
      param['multiResponseMessage'] = this.translate.instant('designEditor.testEmailComponent.usePipeSeparartorForMultipleDataLbl');      
    });
    
    return resObj;    
  }
  numberWithCommaOnly(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 44) {
      return false;
    }
    return true;
  }

  addSMSNumbers(): void {
    let smsArr = this.inputSMS.split(',');
    for(let item of smsArr) {
      let selectedItem = parseInt(item.trim());
      if(selectedItem > 0) {
        if(this.smsList.indexOf(selectedItem) === -1) {
          if(this.smsList.length < this.seedListAddLimit){
            this.smsList.push(selectedItem);
          }else{
            let channelId = this.translate.instant('designEditor.testEmailComponent.phoneNumberLbl');
            let channelIdLabel = this.translate.instant('designEditor.testEmailComponent.channelIdAddLimitMsgLbl').replace('#channelId#',channelId);
            this.dataService.SwalAlertSuccesOrFailMgs(channelIdLabel +" "+ this.seedListAddLimit,"warning");
          }          
        } else {
          this.dataService.SwalAlertSuccesOrFailMgs(selectedItem +" "+this.translate.instant('designEditor.testEmailComponent.alreadyExistslbl'),"warning");
        }
      }
    }
    this.inputSMS = '';
  }

  sendTestSMS() {
    if(this.customerCodechecked && this.customerCode === '') {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.testEmailComponent.customerCodeisRequiredlbl'));
      return;
    }
    if(this.isTestList && this.testSMSObj.testListId === 0) {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.testEmailComponent.pleaseSelectTheListItemlbl'));
      return;
    }
    if(this.smsList.length == 0) {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.testSMSComponent.validationMsg.addAtleastOneMobileNumberToTest'));
      return;
    }

    if(this.customerCode === '') {
      this.customerCode === null;
    }
    this.showLoader = true;
    this.collectDataForTestMsgFieldsMethod(this.smsList);
    this.shareService.testSMSObj.subscribe((res:any) => {
      if(res != undefined) {
        var crrntObj = res.channels.find(x => x.currentSplitid == this.currentSplitId);
        if(crrntObj != undefined) {
          this.testSMSObj.commChannelKey = crrntObj.commChannelKey;
          this.testSMSObj.currentSplitid = crrntObj.currentSplitid;
          this.testSMSObj.msgContent = this.dataService.formatToneWidgetText(crrntObj.msgContent);
          this.testSMSObj.promoKey = crrntObj.promoKey;
          this.testSMSObj.senderId = crrntObj.senderId;
          this.testSMSObj.senderName = crrntObj.senderName;          
          this.testSMSObj.smsMultiSplit = crrntObj.smsMultiSplit;
          this.testSMSObj.unicodeEnable = crrntObj.unicodeEnable;       
          this.testSMSObj.selectedOffers = crrntObj.selectedOffers; 
          this.testSMSObj.selectedRecoWidgets = crrntObj.selectedRecoWidgets;  
          this.testSMSObj.testMsgFields = this.testMsgFields;  
        }
        this.testSMSObj.customercode = this.customerCode;
        this.testSMSObj.isTestList = this.isTestList;
        this.testSMSObj.toAddr = this.smsList.toString();        
        this.testSMSObj.isTestListCreate = this.seedListNameInputEnable;
        this.testSMSObj.testListId = this.isTestList ? this.testListId : 0;
        this.testSMSObj.testListName = this.seedListName;
      }
    });

    const body = this.testSMSObj;
    this.httpService.post('/promoChannel/testEmailV2', body).subscribe((data) => {
      this.responseReceived = true;
      this.showLoader = false;
      this.testEmailResponse = JSON.parse(data.response);
      
      if(this.testEmailResponse.errorReportFileName !== null) {
        this.successDelivery = false;
        this.errorFileName = this.testEmailResponse.errorReportFileName;
      } else {
        this.successDelivery = true;
      }
    });
  }
  sendTestWhatsapp() {
    if(this.customerCodechecked && this.customerCode === '') {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.testEmailComponent.customerCodeisRequiredlbl'));
      return;
    }

    if(this.smsList.length == 0) {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.testSMSComponent.validationMsg.addAtleastOneMobileNumberToTest'));
      return;
    }

    if(this.customerCode === '') {
      this.customerCode === null;
    }
    this.showLoader = true;
    this.collectDataForTestMsgFieldsMethod(this.smsList);
    this.shareService.testWhatsappObj.subscribe((res:any) => {
      if(res != undefined) {
        var crrntObj = res.channels.find(x => x.currentSplitid == this.currentSplitId);        
        if(crrntObj != undefined) {
          this.testWhatsappObj.commChannelKey = crrntObj.commChannelKey;
          this.testWhatsappObj.currentSplitid = crrntObj.currentSplitid;
          this.testWhatsappObj.msgContent = crrntObj.msgContent;
          this.testWhatsappObj.promoKey = crrntObj.promoKey;
          this.testWhatsappObj.senderId = crrntObj.senderId;
          this.testWhatsappObj.senderName = crrntObj.senderName;          
          //this.testWhatsappObj.smsMultiSplit = crrntObj.smsMultiSplit;
          this.testWhatsappObj.unicodeEnable = crrntObj.unicodeEnable;   
          this.testWhatsappObj.testMsgFields = this.testMsgFields;    
          //this.testWhatsappObj.selectedOffers = crrntObj.selectedOffers; 
          //this.testWhatsappObj.selectedRecoWidgets = crrntObj.selectedRecoWidgets;    
        }
        this.testWhatsappObj.customercode = this.customerCode;
        this.testWhatsappObj.isTestList = this.isTestList;
        this.testWhatsappObj.toAddr = this.smsList.toString();
        this.testWhatsappObj.isTestListCreate = this.seedListNameInputEnable;
        this.testWhatsappObj.testListName = this.seedListName;
        this.testWhatsappObj.testListId = this.isTestList ? this.testListId : 0;
      }
    });

    const body = this.testWhatsappObj;
    this.httpService.post('/promoChannel/testEmailV2', body).subscribe((data) => {
      this.responseReceived = true;
      this.showLoader = false;
      this.testEmailResponse = JSON.parse(data.response);
      if(this.testEmailResponse !== null){
        if(this.testEmailResponse === null && data.message !== null){
          this.dataService.SwalAlertMgs(data.message);
            return;
        }else if(this.testEmailResponse.errorReportFileName !== null) {
          this.successDelivery = false;
          this.errorFileName = this.testEmailResponse.errorReportFileName;
        } else {
          this.successDelivery = true;
        }
      }
      
    });
  }
  sendPushNotification() {
    if(this.customerCodechecked && this.customerCode === '') {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.testEmailComponent.customerCodeisRequiredlbl'));
      return;
    }
    if(this.androidDeviceIds.length == 0 && this.iosDeviceIds.length == 0) {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.mobilePushComponent.deviceIdShouldNotBeEmptyLbl'));
      return;
    }

    if(this.customerCode === '') {
      this.customerCode === null;
    }
    this.collectDataForTestMsgFieldsMethod("");
  this.pushNotifyObj.testMsgFields = this.testMsgFields;
    this.showLoader = true;
    const body = this.pushNotifyObj;
    body.toAndroid = this.androidDeviceIds.join(',');
    body.toIOS = this.iosDeviceIds.join(',');
    body.customercode = this.customerCode;
    body.isTestList = false;
    body.isTestListCreate = this.seedListNameInputEnable;
    body.testListName = this.seedListName;
    body.testListId = this.isTestList ? this.testListId : 0;
    this.httpService.post('/promoChannel/testEmailV2', body).subscribe((data) => {   
      this.showLoader = false;   
      //if(data.status == 'FAIL'){
        this.testEmailSendStatus(data);
      //}      
    });
  }
  // inapp test notification call
  sendInappNotification() {
    if(this.customerCodechecked && this.customerCode === '') {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.testEmailComponent.customerCodeisRequiredlbl'));
      return;
    }
    if(this.androidDeviceIds.length == 0 && this.iosDeviceIds.length == 0) {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.mobilePushComponent.deviceIdShouldNotBeEmptyLbl'));
      return;
    }

    if(this.customerCode === '') {
      this.customerCode === null;
    }
    this.collectDataForTestMsgFieldsMethod("");
    this.finalInappPayloadData.testMsgFields = this.testMsgFields;
    this.showLoader = true;
    const body = this.finalInappPayloadData;
    body.toAndroid = this.androidDeviceIds.join(',');
    body.toIOS = this.iosDeviceIds.join(',');
    body.customercode = this.customerCode;
    body.isTestList = false;
    body.isTestListCreate = this.seedListNameInputEnable;
    body.testListName = this.seedListName;
    body.testListId = this.isTestList ? this.testListId : 0;
    this.httpService.post('/promoChannel/testEmailV2', body).subscribe((data) => {   
      this.showLoader = false;   
      //if(data.status == 'FAIL'){
        this.testEmailSendStatus(data);
      //}      
    });
  }
  
   // API test notification call
   sendAPINotification() {
    if(this.customerCodechecked && this.customerCode === '') {
      this.dataService.SwalValidationMsg(this.translate.instant('designEditor.testEmailComponent.customerCodeisRequiredlbl'));
      return;
    }    
    if(this.customerCode === '') {
      this.customerCode === null;
    }
    this.collectDataForTestMsgFieldsMethod("");
    this.finalAPIPayloadData.testMsgFields = this.testMsgFields;
    this.showLoader = true;
    const body = this.finalAPIPayloadData;
    // body.toAndroid = this.androidDeviceIds.join(',');
    // body.toIOS = this.iosDeviceIds.join(',');
    body.customercode = this.customerCode;
    body.isTestList = false;
    this.httpService.post('/promoChannel/testEmailV2', body).subscribe((data) => {   
      this.showLoader = false;   
      //if(data.status == 'FAIL'){
        this.testEmailSendStatus(data);
      //}      
    });
  }
  collectDataForTestMsgFieldsMethod(channelList){
    this.testMsgFields = {
      customerCode: this.customerCode,
      personalizedFields: this.personalizedFields,
      toAdd:channelList.toString() || '',
      toAndroid:this.androidDeviceIds.join(',') || '',
      toIOS:this.iosDeviceIds.join(',') || '', 
      listId:0,      
      isTestList:this.isTestList,     
      modelName:this.currentObj.testMsgFields.modelName || '',
      commChannelKey:this.currentObj.commChannelKey || '',
    }
    
  }

}
