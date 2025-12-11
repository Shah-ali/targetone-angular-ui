export const environment = {
  production: true,
  //BASE_URL: "https://rcdptone-ui-qa.algonomy.com", // For QA Server
  BASE_URL: "https://api-dev.algonomy.com/rcdptoneui", // For Cloud front
  STATIC_JSON_URL: "./assets/JSON/",
  HELP_URL: "https://api-dev.algonomy.com/rcdpolh",
  HELP_CONTENT: "/resources/rcdp_OLH/index.htm",
  CLOUD_FRONT_URL: "https://d14536pdzp3mcg.cloudfront.net", // Static resources folder, currenly it is dev instance url mentioned
  
  /* For QA instance */
  //BEE_ClIENT_ID: "beff30fb-0bf9-477f-850c-b86c0173163a",
  //BEE_CLIENT_SECRET: "8XxpKVAT3BlK3Y5LAvus4cb2cx6ORYNmcw3dUv4DrQdHY8fvdDOo",

  /* For Dev instance */
  BEE_ClIENT_ID: "947131b8-ef34-45f3-9a9b-04c4e6d3683b",
  BEE_CLIENT_SECRET: "kzAK1assn94tyl1rs6QXpIFrSup7p95uOxDIuTCp9SEjPNxdsnRx",

  //BASE_PTAGS_URL: "https://api-dev.algonomy.com/trigger", // For Personalization fragment
  BASE_PTAGS_URL: "https://api-dev.algonomy.com/ptag", // For Personalization fragment

  // FONT_URL based on deployment sepecific
  FONT_URL:"https://d3c470qwf9yxzj.cloudfront.net"
};
