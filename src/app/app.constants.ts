export const AppConstants = {
  PRODUCT_NAME: "TargetOne",
  CUSTOM_HEADER_NAME: "TENANT-IDENTIFIER",
  APP_URLS: {
    LOGIN: "login",
    SETUP: "journey",
    FINALSETUP: "final-setup",
    BEE_EDITOR: "bee-editor",
    EMAIL_TEMPLATE: "email-templates",
    TEMPLATE_LIBRARY: "template-library",
    TRIGGER_ANALYTICS: "trigger-analytics",
    DESIGN_PAGE: "design-page",
    SAVED_PERSONALIZED_TAGS: "saved-personalized-tags",
    SIMULATE_TAG_PARAMTERS: "simulate-tag-paramters",
    PERSONALIZED_TAGS: "personalizedTag-editor",
    SAVE_AND_PUBLISH_TAGS: "save-and-publish-tags",
    TAG_LIST_PERFORMANCE_DASHBOARD: "list-view",
    TAG_GRAPH_PERFORMANCE_DASHBOARD: "graph-view",
    TAG_SUMMARISED_PERFORMANCE_DASHBOARD: "summarized-view",
  },
  CONSTANT_VALUES: {
    ADDPARAMSLIMIT_ENSEMBLE_AI: 10, // Maximum number of additional parameters allowed in Ensemble AI
    ENSEMBLE_RESPONSE_LIMIT: 10, // Maximum number of responses allowed in Ensemble AI
    CUSTOME_DATE_RANGE_LIMIT:90, // Maximum number of days allowed in custom date range selection is one year.
    SEED_LIST_ADD_LIMIT: 25 // Maximum number of seed list entries allowed
  },
  LANGUAGES: [
    { key: "English", value: "en" },
    { key: "中国人", value: "cn" },
    { key: "Española", value: "es" },
  ],
  DEFAULT_LANGUAGE: "en",
  ADMIN_DATE_FORMAT: "/triggerPromo/uidateformat",
  DEFAULT_THEME: "light-mode",
  HTTP_DATA: {
    HEADERS: {
      APP_JSON_CONTENT_TYPE: "application/json",
    },
  },
  PTAG_STATIC_DATA: {
    CUSTOMER_DME: "customerDme",
    noOfProductConfig: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    defaultSelectedProduct: 4 
  },
  DEFAULT_OPERATORS_ROW_CONFIG:{
    defaultOperatorsForMultiResponse: ["=","!=",">","<",">=","<="],
    defaultOperatorsForUndefinedOperators: ['=', '!=', 'is null','is not null']
  },
  OFFERS_ENABLE: {
    MERGE_TAG: true,
    STATIC_OFFERS: true,
    RECOMMENDATION_OFFERS: false,
  },

  API_END_POINTS: {
    DUMMY_CONNECT: "/connect",
    GET_USER_ACCESS: "/userAccess",
    GET_VENDOR_NAMES: "/triggerPromo/getVendorMap",
    GET_SAVED_USAGE_TEMPLATES: "/triggerPromo/getSavedPromoUsageTemplates",
    SAVE_ADMIN_PEOMO_TEMPLATE_USAGE: "/triggerPromo/saveAdminPromoTemplateUsage",
    GET_MAP_PROMO_CHANNELS: "/triggerPromo/getMapPromoChannels",
    GET_EMOJI_OBJ: "/triggerPromo/getEmojis",
    SAVE_UPLOAD_PDF: "/promoChannel/saveUploadPDF",
    DELETE_UPLOAD_PDF: "/promoChannel/deleteUploadPDF",
    UPDATE_PROMOTION: "/triggerPromo/updatePromo",
    CREATE_PROMOTION: "/triggerPromo/createPromotion",
    EDIT_PROMOTION: "/triggerPromo/editPromo",
    GET_JOURNEY_TEMPLATES: "/triggerPromo/getTemplates",
    GET_CREATE_TRIGGER_PROMOTION: "/triggerPromo/getCreateTriggerPromotion",
    SCHEDULE_TRIGGER_PROMOTION: "/triggerPromo/scheduleTriggerPromoAPI",
    GET_USER_DETAILS_OBJ: "/triggerPromo/userDetails",
    GET_CURRENT_USAGE_OBJ: "/litmus/getCurrentUsage?litmusTestType=1",
    GET_CURRENT_USAGE_SPAM_TEST_OBJ: "/litmus/getCurrentUsage?litmusTestType=2",
    GET_LITMUS_PREVIEW: "/litmus/preview",
    GET_LITMUS_SPAM_TEST: "/litmus/spamCheck",
    GET_DOWNLOAD_LINK: "/litmus/downloadReport?litmusTestType=",
    GET_OFFERS_DATA: "/promoOffer/getOfferListForPromtion",
    GET_OFFERS_ACTUAL_VALUES: "/rule/addOffersForChannel",
    GET_INAPP_TEMPLATES_OBJ: "/triggerPromo/getInAppTemplates" + `?promoKey=`,
    GET_RECOMMENDATION_OBJ: "/rule/display?featureType=1&recoType=0&usageType=-1",
    GET_DM_COLUMNAR_TEMPLATE_OBJ: "/triggerPromo/getAllTemplates" + `?commKey=`,
    GET_DM_COLUMNAR_SAVEASTEMPLATE: "/templateApi/saveAsTemplateForDm",
    GET_SMS_FACEBOOK_TEMPLATES: "/triggerPromo/getAllTemplates" + `?commKey=`,
    GET_All_PLACEMENTS_PAGE_TYPE: "/triggerPromo/getAllPlacements?promoKey=",
    GET_PRODUCT_RECO_PREBUILD: "/templateApi/getRecoTemplates?commChannelKey=",
    GET_PRODUCT_RECO_LAYOUT: "/templateApi/getLayoutTemplates?commChannelKey=",
    CREATE_RULE_BUILDER: "/ruleBuilder/createRuleBuilder",
    GET_DME_MODEL_DATA: "/dataExt/getAllDataModel",
    GET_DIM_MODEL_DATA_OBJ: "/triggerPromo/getDimpopupmodel?",
    GET_DME_MERGE_TAG_OBJ: "/triggerPromo/getDmeMergeTag",
    GET_DME_MODEL_ATTRIBUTES: "/dataExt/getDmeFields",
    GET_TEMPLATE_FULL_PREVIEW: "/triggerPromo/getTemplateFullPreview?",

    GET_LOAD_PERSONALIZATION_TAGS_API: "/personalizationTags/loadPersonalizationTags",
    GET_CREATE_PERSONALIZATION_TAG: "/personalizationTags/createPersonalizationTag",
    GET_SAVE_PERSONALIZATION_TAG: "/personalizationTags/savePersonalizationTag",
    GET_EDIT_PERSONALIZATION_TAG: "/personalizationTags/editPersonalizationTag",
    GET_SAVE_TAG_PARAMETERS_API: "/personalizationTags/saveTagParameters",
    GET_TAG_PARAMETERS_API: "/personalizationTags/getTagParameters",
    GET_SIMULATE_TAG_API: "/pTags/simulate",
    GET_FINALIZED_TAGS_API: "/personalizationTags/getGeneratedTags",
    GET_FETCH_ALL_PERSONALIZATION_TAGS: "/personalizationTags/fetchAllPersonalizationTags",
    GET_GENERATED_TAG_FINAL_PAGE: "/personalizationTags/fetchGeneratedTags",
    GET_SIMULATE_URL_API: "/personalizationTags/getPTagUrls/",
    GET_FRAGMENT_SIMULATE_API: "/p/fsimulate/",
    GET_DEEP_LINK_TAG_URL_API: "/p/simulate/dl/",
    GET_FRAGMENT_DEEP_LINK_TAG_URL_API: "/p/simulate/dlFragment/",
    GET_PMERGETAG_EXT_URL: "/personalizationTags/getPMergeTagExt",
    GET_PTAG_SPLITCHAR_API: "/personalizationTags/getTagParamSplitChars",
    GET_PTAG_ROW_CONFIG_PREVIEW: "/personalizationTags/rowPreview",
    VALIDATE_PTAG_ROW_NAME: "/personalizationTags/validateRowName",
    GET_SIMULATE_LOG_API: "/personalizationTags/simulateLog",
    // API based URL
    GET_API_BASED_CREATE_INTEGERATION: "/apiPersonalization/createApiIntegration/",
    GET_API_BASED_SAVE_INTEGRATION: "/apiPersonalization/saveApiIntegration",
    GET_API_BASED_EDIT_INTEGRATION: "/apiPersonalization/editApiIntegration/",
    GET_API_SAVED_LIST_INTERGRATION: "/apiPersonalization/getlistApis",
    GET_API_OUTPUT_FIELDS: "/apiPersonalization/getApiFields?",
    GET_API_PROCESS_URL: "/apiPersonalization/processUrl",
    GET_ACTIVE_INACTIVE_APIS: "/apiPersonalization/makingApiActiveInActive/",
    GET_LICENCE_TYPE_API: "/personalizationTags/getLicenseType",
    GET_SCRIPT_URL_API: "/triggerPromo/scriptUrl",
    GET_FULL_HTML_TAG_URL_API: "/ph/fetchfullhtmltag?tagHash=",
    GET_LANDING_PAGE_TAG_URL_API: "/ph/fetchLandingpageTags?tagHash=",
    GET_API_CHANNEL_SAVED_TEMPALTES: "/triggerPromo/getAllTemplates?commKey=",

    // GrapesJS endpoints in PersonalizationGrapeController
    GET_SAVE_PTAGGRP_TAG: "/ptagsGrp/savePersonalizationTag",
    GET_EDIT_PTAGGRP_TAG: "/ptagsGrp/editPersonalizationTag",

    // DME Product Filters option API
    GET_FIELDS_OPTION_FILTER: "/dataExt/getDataModeldetailsJson?dmID=",
    GET_PRODUCT_FILTER_FIELD_DATA_API: "/lucene/getDMEFieldTerms",

    // Active Edit and Copy API Details
    GET_EDIT_ACTIVE_PTAG_API: "/personalizationTags/editActivePersonalizationTag",
    GET_CLONE_COPY_PTAG_API: "/personalizationTags/clonePersonalizationTag",
    GET_DISCARD_PTAG_API: "/personalizationTags/revertActiveEditDraft",

    //  Ensemble AI API
    GET_ENSEMBLE_SETTINGS_API:'/personalizationTags/getEnsambledSettings',
  },
  API_PERSONSOALIZATION_TAGS_END_POINTS: {
    GET_LIST: "/personalizationTags/loadPersonalizationTags",
    GET_PMERGETAG: "/personalizationTags/getPMergeTag?tagKey=",
    PERSONALIZATION_NAME_RENAME: "/personalizationTags/rename",
    PERSONALIZATION_ENABLE_DISABLE: "/personalizationTags/enableDisable",
    GET_All_PERSONALIZATION_PLACEMENTS: "/personalizationTags/getAllPlacements?tagKey=",
    GET_ALL_APIS_PERSONALIZATION: "/apiPersonalization/getApis",
    PERSONALIZATION_FAV_TAGS: "/personalizationTags/favPtag",
    GET_VERIFY_CUSTOMER_TAG_ENABLE_API: "/personalizationTags/verifyCustomerTagEnable?tagKey=",
  },
  API_END_POINTS_OTHERS: {
    GET_BEE_TEMPLATES: "https://plugin-demos.getbee.io/templates",
    GET_TEMPLATE_CONTENT: "https://plugin-demos.getbee.io/templates/",
    BEEFREE_DOMAIN_NAME: "plugin-demos.getbee.io",

    // GET_BEE_TEMPLATES:"https://beefree.io/wp-json/v1/catalog/templates?page=1&pagesize=30&context=free",
    // GET_TEMPLATE_CONTENT:"https://beefree.io/wp-json/v1/catalog/templates/",
    // BEEFREE_DOMAIN_NAME: "beefree.io",
    //---------------- S3 Storage API ------------------
    GET_S3_TEMPLATES: "/templateApi/getTemplates",
    GET_S3_TEMPLATE_CONTENT: "/templateApi/getTemplateContent?templateUuid=",
    GET_MY_TEMPLATES: "/templateApi/getTemplates?isMyTemplates=true",
    GET_SELECTED_TEMPLATE_CONTENT: "/templateApi/getTemplateContent?isMyTemplates=true&templateUuid=",
    SAVE_MY_TEMPLATE_CONTENT: "/templateApi/saveMyTemplate?templateUuid=",
    DELETE_S3_MY_TEMPLATE: "/templateApi/removeMyTemplate?templateUuid=",
    GET_LIST_FUSION_JS_API: "/fusionJs/getlistFusionJs",
    CREATE_FUSION_JS_API: "/fusionJs/createFusionJs",
    SAVE_N_PUBLISH_FUSION_JS_API: "/fusionJs/saveAndPublishFusionJs",
    DELETE_FUSION_JS_API: "/fusionJs/deleteFusionJs?jsKey=",
    TEST_CONSOLE_FUSIONJS_API: "/fusionJs/testConsole",
    GET_PUBLISH_SCRIPT_FUSION_JS_API: "/fusionJs/getPublishFusionJs",
    GET_EXECUTE_FUSION_JS_SCRIPT_API: "/fusionJs/testApi",
    DISCARD_SCRIPT_FUSION_JS_API:"/fusionJs/discardFusionJs/"
  },
  CHANNEL_INFO: {
    CHANNEL_TYPE: {
      EMAIL: "EmailType",
      PUSH_NOTIFICATION: "MobileAppType",
      WEB_PUSH: "WebPushType",
      INAPP_NOTIFICATION: "InAppType",
      DM_CHANNEL: "DMType",
      SMS_CHANNEL: "SmsType",
      FACEBOOK_CHANNEL: "FBType",
      API_CHANNEL: "ApiType",
      WHATS_APP_CHANNEL: "WhatsAppType",
    },
  },
  HTTP_MESSAGE_TYPE: {
    OK: "ok",
    RUNNING: "running",
  },
  UPLOAD_DATA: {
    DATASET_TYPE_ID: "dataSetType",
  },
  SCHEMA_DETAILS: {
    DATA_TYPE: {
      INT: "int",
      DATE: "date",
      VARCHAR: "varchar",
      BIG_INT: "bigint",
      NUMERIC: "numeric",
      TEXT_TYPE: "text",
      NUMBER_TYPE: "number",
      OBJECT: "object",
    },
    DATA_TYPE_VARCHAR: {
      MIN: 0,
      MAX: 500,
    },
    NUMERIC_VALIDATOR: {
      FORMAT: {
        MIN: 0,
        MAX: 20,
      },
      PRECISION: {
        MIN: 0,
        MAX: 8,
      },
    },
    DEFAULT_VALUE: {
      TEXT_LENGTH: 100,
      NUMERIC_FORMAT_VALUE: 16,
      NUMERIC_SCALE_VALUE: 8,
    },
    COLUMNS_KEY: {
      ID: {
        KEY: "id",
        REQUIRED: true,
      },
      COLUMN_NAME: {
        KEY: "columnName",
        REQUIRED: false,
      },
      PRIMARY_SELECTION: {
        KEY: "primarySelection",
        REQUIRED: false,
      },
      DISPLAY_COLUMN_NAME: {
        KEY: "displayColumnName",
        REQUIRED: true,
      },
      MANDATORY_SELECTION: {
        KEY: "mandatorySelection",
        REQUIRED: false,
      },
      DATA_TYPE: {
        KEY: "dataType",
        REQUIRED: true,
      },
      FORMAT: {
        KEY: "format",
        REQUIRED: true,
      },
      COLUMN_DEFINITION_TYPE: {
        KEY: "columnDefinitionType",
        REQUIRED: false,
      },
      VALIDATION_METHOD: {
        KEY: "validationMethod",
        REQUIRED: false,
      },
      COLUMN_MAP_TO: {
        KEY: "columnMapTo",
        REQUIRED: true,
      },
      LOOK_UP: {
        KEY: "lookup",
        REQUIRED: false,
      },
      SCALE: {
        KEY: "scale",
        REQUIRED: false,
      },
    },
    COLUMN_PRIMARY_SETTINGS_TYPE: {
      FIXED: "fixed",
      SINGLE: "single",
      MULTI: "multi",
    },
  },
  ALPHA_NUMERIC_PATTERNS: "^[ A-Za-z0-9",
  USER: "user",
  DEFAULT_TYPE: "default",
  LOCATION_ERROR_LIMIT: {
    SHARED_LOCATION: "sharedLocation",
    S3_PROTOCOL: "s3://",
    LOCAL_DRIVE: "localDrive",
    RECURRING: "recurring",
    NOW_OR_LATER: "nowOrLater",
    ONETIME: "onetime",
    UPLOAD_IMMEDIATE: "upload",
    NOW: "now",
    SELECT_DATE: "selectDate",
    NONE: 0,
    MODERATE: 50,
    STRICT: 80,
  },
  HOUR_RANGE: {
    MIN: 1,
    MAX: 24,
  },
  MINUTE_RANGE: {
    MIN: 10,
    MAX: 59,
  },
  DAY_RANGE: {
    MIN: 1,
    MAX: 30,
  },
  WEEK_RANGE: {
    MIN: 1,
    MAX: 4,
  },
  ERROR_LIMIT_OPTION: {
    NONE: 1,
    MODERATE: 2,
    STRICT: 3,
  },
  FORM_CONTROL_TYPE: {
    RADIO: "radio",
    TEXT_BOX: "textBox",
    DROPDOWN: "dropdown",
  },
  MONTHS_NAME: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  WEEK_LIST: [
    {
      key: "Mon",
      value: "mon",
    },
    {
      key: "Tue",
      value: "tue",
    },
    {
      key: "Wed",
      value: "wed",
    },
    {
      key: "Thu",
      value: "thu",
    },
    {
      key: "Fri",
      value: "fri",
    },
    {
      key: "Sat",
      value: "sat",
    },
    {
      key: "Sun",
      value: "sun",
    },
  ],
  RECURRING_REPEAT_INTERVAL: {
    OCCURRENCE: {
      hourly: "hourly",
      daily: "daily",
      weekly: "weekly",
    },
    hourly: {
      hour: "Hr",
      minute: "Min",
    },
    daily: "days",
    weekly: "weeks",
  },
  BATCH_UPLOAD_TYPE: {
    ONE_TIME: "Onetime",
    RECURRING: "Recurring",
  },
  EVENT_UPLOAD: {
    EVENT: "event",
  },
  FAILED: "failed",
  SUCCESS: "success",
  WARNING: "warning",
  GOOD: "good",
  SCHEDULED: "scheduled",
  SAVED: "saved",
  RUNNING: "running",
  MOBILE_PUSH_RANGE: {
    MIN: 1,
    MAX: 5,
  },
  TAG_PARAMETER_FIELDS: {
    MIN: 1,
    MAX: 10,
  },
  TAB_LABELS: {
    active: "Active",
    draft: "Draft",
    inactive: "Inactive",
    favourite: "Favorite",
    qaTest: "QA",
  },
  ACTION_LABELS: {
    deactivateTag: "Deactivate active content",
    activateTag: "Activate active content",
    viewPerformance: "View performance",
    edit: "Edit",
    delete: "Delete",
    activate: "Activate",
    viewTags: "View tags",
  },
  COLUMN_LABELS: {
    tagName: "Tag name",
    favorites: "Favorite",
    activationDate: "Activation date",
    associatedCampaigns: "Associated campaigns",
    creationDate: "Creation date",
    deActivationDate: "Deactivation date",
    actions: "Actions",
    status: "Status",
    // Add more columns as needed
  },
  TIME_PERIOD_OPTIONS: {
    LAST_7_DAYS: "Last 7 days",
    LAST_30_DAYS: "Last 30 days",
    LAST_60_DAYS: "Last 60 days",
    CUSTOM_DATE_RANGE: "Custom date range",
  },
  PTAG_DASHBOARD: {
    // Personalized Dashboard API
    GET_PTAG_DASHBOARD_API: "/pTagDashboard/loadAllPTags?",
    GET_TAG_PERFORMANCE_DATA_API: "/pTagDashboard/loadPTagPerformance?",
    GET_PTAG_ENABLE_DISABLE_API: "/personalizationTags/enableDisable?",
  },
  INLINEJS: {
    GET_INLINEJS_SCRIPT_URL_API: "/inlineJs/inlineJsFilePath",
    LIST_OF_ALL_FUNCTIONS: "/inlineJs/listAllJs",
    DEACTIVATE_FUNCTION: "/inlineJs/deactivate",
  },
  "MERGE_TAG_INJECTION": {
    GET_MERGE_TAGS: "/triggerPromo/getMergeTags?promoKey=",
    SAVE_MERGE_TAGS: "/triggerPromo/saveMergeTags?promoKey=",
    DELETE_MERGE_TAGS: "/triggerPromo/deleteMergeTags?promoKey="
  }
};
