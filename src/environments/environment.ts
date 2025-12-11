// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BASE_URL: "http://localhost:8080/targetone",
  CORS_URL: "http://localhost:8080/targetone",
  CLOUD_FRONT_URL: "https://d14536pdzp3mcg.cloudfront.net", // Static resources folder

  STATIC_JSON_URL: "./assets/JSON/",
  HELP_URL: "https://rcdp-qa.algonomy.com/olh",
  HELP_CONTENT: "/resources/rcdp_OLH/index.htm",

  BEE_ClIENT_ID: "947131b8-ef34-45f3-9a9b-04c4e6d3683b",
  BEE_CLIENT_SECRET: "kzAK1assn94tyl1rs6QXpIFrSup7p95uOxDIuTCp9SEjPNxdsnRx",
  BASE_PTAGS_URL: "http://localhost:8080/targetone", //For Personalization fragment

  // FONT_URL based on deployment sepecific
  FONT_URL:"https://d3c470qwf9yxzj.cloudfront.net"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
