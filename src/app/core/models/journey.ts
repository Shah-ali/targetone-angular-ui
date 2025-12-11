export interface Journey {
    promotionKey: number;
    promotionDesc: string;
    tags: Tags[];
    allSelectedTagKeys: string;
    promStartDate: Date;
    promEndDate: Date;
	promStartDateStr: string;
    promEndDateStr: string;
    campaignKey: string;
    selectedReEntryType: string;
    reentryRestrictDays: number;
    lastSavedStep: number;
    simulationMode: number;
    listGenKey: number;
}

export interface Campaign {
    dbKey: number;
    campaignName: string;
}

export interface Tags {
    dbKey: number;
    tagName: string;
    tagColorCode: string;
}

export interface UserList {
    dbKey: number;
    listGenName: string;
}

export interface TestEmail {
    subject: string;
    msgContent: string;
    toAddr: string;
    customercode: string;
    senderName: string;
    isTestList: boolean;
    promoKey: string;
    commChannelKey: string;
    testListId: number;
    currentSplitid: string;
    senderId: string;
    preHeader:string;
    testMsgFields: any;
    isTestListCreate:boolean;
    testListName:string;
}

export interface TestSMS {
    commChannelKey: string;
    currentSplitid: string;
    customercode: string;
    isTestList: boolean;
    msgContent: string;
    promoKey: string;
    senderId: string;
    senderName: string;
    testListId: number;
    toAddr: string;
    smsMultiSplit: boolean;
    unicodeEnable: boolean;
    selectedOffers:any;
    selectedRecoWidgets:any;
    testMsgFields: any;
    isTestListCreate:boolean,
    testListName:string
}
export interface TestWhatsapp {
    commChannelKey: string;
    currentSplitid: string;
    customercode: string;
    isTestList: boolean;
    msgContent: string;
    promoKey: string;
    senderId: string;
    senderName: string;
    testListId: number;
    toAddr: string;
    //smsMultiSplit: boolean;
    unicodeEnable: boolean;
    testMsgFields: any;
    isTestListCreate:boolean,
    testListName:string
    //selectedOffers:any;
    //selectedRecoWidgets:any;
}