import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  NgZone,
  Output,
  EventEmitter,
} from "@angular/core";
import { DataService } from "@app/core/services/data.service";
import { HttpService } from "@app/core/services/http.service";
import { AppConstants } from "@app/app.constants";
import { environment } from "@env/environment";
import { BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-ptag-details",
  templateUrl: "./ptag-details.component.html",
  styleUrls: ["./ptag-details.component.scss"],
})
export class PtagDetailsComponent implements OnInit {
  @ViewChild("previewArea", { static: false }) previewArea!: ElementRef;
  tagId!: number;
  tagDetails: any;
  tagParams: any;
  selectedTab: "fragment" | "full"  = "fragment";
  tagName: string | undefined;
  tagParamMap: any;
  showUrlPath: any;
  ptagSimulateUrlBasePath: any;
  getTagHashId: any;
  fragmentsContentIframe: any;
  tagSimulateURL: string | undefined;
  concactStrArry: any;
  fragmentTagSimulateURL: string | undefined;
  CLOUD_FRONT_URL: any = environment.CLOUD_FRONT_URL;
  fullImgPath: any;
  fullImageSimulateUrl: string = "";
  simulationState:any;
  isLoading = false;
  isFragmentLoading = false;

  @Output() onAdd = new EventEmitter<any>();
  doc: Document | undefined;

  constructor(
    private dataService: DataService,
    private httpService: HttpService,
    private ngZone: NgZone,
    private bsModalRef: BsModalRef
  ) {}
  @Output() backToDashboard = new EventEmitter<void>();

  ngOnInit(): void {
    this.tagDetails = this.dataService.getTag();
    this.tagId = this.tagDetails?.tagId;
    this.tagName = this.tagDetails?.tagName;   
    this.simulationState = this.dataService.getSimulationState();
    if(this.tagId === this.simulationState.selectedTagId){
      this.selectedTab = this.simulationState.simulateMethod || 'full'; 
      this.onSimulate();    
    }

    this.httpService
      .post(
        `${AppConstants.API_END_POINTS.GET_TAG_PARAMETERS_API}?tagKey=${this.tagId}`
      )
      .subscribe({
        next: (res) => {
          const rawTagParams = res.response.tagParams;
          this.tagParamMap = {}; // ✅ initialize here
          try {
            const parsed = JSON.parse(rawTagParams);
            const params = parsed.params || [];

            this.tagParams = params.map((p: any) => {
              const name = p.name;
              const fieldValue = p.fieldValue || "";
              this.tagParamMap[name] = fieldValue; // ✅ populate the map
              return { name };
            });
          } catch (e) {
            console.error("Failed to parse tagParams:", e);
            this.tagParams = [];
            this.tagParamMap = {};
          }
        },
        error: (err) => console.error("Failed to load tag details", err),
      });
  }

  switchTab(tab: "full" | "fragment"): void {
    this.selectedTab = tab;

    // Clear both on tab switch
    this.clearImage();
    this.clearIframe();
  }
  clearIframe(): void {
    const container = this.previewArea.nativeElement.querySelector(
      ".fragment-iframe-container"
    );
    if (container) container.innerHTML = ""; // ✅ Clean iframe HTML
  }

  clearImage(): void {
    this.fullImageSimulateUrl = ""; // ✅ Reset image src
  }

  goBack(): void {
    // this.location.back(); // Navigate to previous page
    this.backToDashboard.emit();
  }

  async getTagUrlPathMethod() {
    let endpoint =
      AppConstants.API_END_POINTS.GET_SIMULATE_URL_API + this.tagId;
    const result = await this.httpService.post(endpoint).toPromise();
    if (result.status == "SUCCESS") {
      this.ngZone.run(() => {
        this.showUrlPath = result.response.finalUrl;
        this.ptagSimulateUrlBasePath = result.response.simulateUrlBasePath;
        this.fullImgPath = result.response.simulateUrl;
        const queryParams = Object.entries(this.tagParamMap)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
          )
          .join("&");

        this.tagSimulateURL = `${this.showUrlPath}?${queryParams}`;
      });
    }
  }

  async loadFragmentHtmlIntoIframeMethod(simulate) {
    let params;
    const queryParams = Object.entries(this.tagParamMap)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join("&");
    // params = this.concactStrArry;
    // let enCodeParams = params.join('');
    // if (enCodeParams !== undefined) {
    //   enCodeParams = enCodeParams.replaceAll('|', '%7C');
    // }
    //let endpoint = this.basePTagUrl+AppConstants.API_END_POINTS.GET_FRAGMENT_SIMULATE_API+this.tagkey+'.html'+"?"+params.join('');
    let endpoint =
      this.ptagSimulateUrlBasePath +
      AppConstants.API_END_POINTS.GET_FRAGMENT_SIMULATE_API +
      this.tagId +
      ".html" +
      "?" +
      queryParams;
    // enCodeParams;
    // this.fragmentHtmlContentToIframe = endpoint;

    try {
      const jsonData = await this.httpService
        .getFragmentSimulate(endpoint)
        .toPromise();
      this.fragmentTagSimulateURL = decodeURIComponent(
        jsonData.body.response.htmlUrl
      );

       let filterRemoveSimulaterFlag = jsonData.body.response.html
      .replaceAll('%7B', '{')
      .replaceAll('%7D', '}')
      .replaceAll('&amp;simulation=true', '')
      .replaceAll('&simulation=true', '')
      .replaceAll('|', '%7C')
      .replaceAll('&amp;', '&')

      this.addDynamicIframeMethod(filterRemoveSimulaterFlag);
      //this.getDownloadHtmlFromResponseMethod(jsonData.body.response.html); // New changes from 16-10-2024 as p0
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  addDynamicIframeMethod(htmlFragments: string): void {
    const container = this.previewArea.nativeElement.querySelector(
      ".fragment-iframe-container"
    );

    let iframe = container.querySelector("iframe");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.className = "fragmentIframeSection";
      iframe.setAttribute("allowfullscreen", "");
      iframe.style.border = "none";
      iframe.style.width = "100%";
      iframe.style.height = "calc(100vh - 266px)";
      container.appendChild(iframe);
    }

    iframe.onload = async () => {
      const sanitizedHtml = htmlFragments.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
      );

      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (doc) {
        doc.open();
        doc.write(sanitizedHtml);
        doc.close();

        // Inject AngularJS script if required
        //  this.addScriptMethod(iframe);

        // Wait for the DOM inside iframe to fully render before attaching click listeners
        await this.waitForBlocksToRender(doc);
        this.injectBlockSelectionStyles(doc); // inject styles into iframe
        this.attachBlockClickHandlers(doc); //  handle selection and copy
      }

      this.isFragmentLoading = false;
    };

    iframe.src = "about:blank"; // Triggers iframe load and injects HTML
  }

  private injectBlockSelectionStyles(doc: Document): void {
    const style = doc.createElement("style");
    style.textContent = `
      .selectable-block {
        border: 1px solid transparent;
        cursor: pointer;
      }
      .selected-block {
        border: 2px solid #007BFF !important;
      }
    `;
    doc.head.appendChild(style);
  }

  /**
   * Waits for 'table.row' and 'div.fragment-type' blocks to appear in the iframe DOM.
   */
  private waitForBlocksToRender(doc: Document): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const blocks = doc.querySelectorAll("table.row, div.fragment-type");
        if (blocks.length > 0) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 10);
    });
  }

  /**
   * Adds data-block-id and click handlers to highlight and copy blocks inside iframe.
   */
  private attachBlockClickHandlers(doc: Document): void {
    const blocks = doc.querySelectorAll<HTMLElement>(
      "table.row, div.fragment-type"
    );

    blocks.forEach((block, index) => {
      block.setAttribute("data-block-id", `block-${index + 1}`);
      block.classList.add("selectable-block");

      block.addEventListener("click", (e: MouseEvent) => {
        e.stopPropagation();

        blocks.forEach((b) => b.classList.remove("selected-block"));
        block.classList.add("selected-block");

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = block.outerHTML;
        e.preventDefault();
        console.log(`Copied block-${index + 1} to clipboard`);
      });
    });
  }

  addScriptMethod(ele) {
    const iframeDoc = ele.contentDocument;
    // Check if AngularJS is already loaded
    const angularScript = iframeDoc.createElement("script");
    angularScript.src = `${this.CLOUD_FRONT_URL}/resources/js/masterJS-BEE.js`;
    iframeDoc.onload = function (e) {
      // Initialize AngularJS module and controller after AngularJS is loaded
      const initScript = iframeDoc.createElement("script");
      initScript.textContent = `angular.module("pTagApp", []).controller("pTagController", function($scope){});`;
      iframeDoc.documentElement.appendChild(initScript);
    };
    iframeDoc.documentElement.appendChild(angularScript);
  }

  async onSimulate(): Promise<void> {
    if (this.selectedTab === "fragment") {
      this.isFragmentLoading = true;
      this.isLoading = false;
      await this.getTagUrlPathMethod(); // Gets base URL
      this.loadFragmentHtmlIntoIframeMethod(true);
    } else if (this.selectedTab === "full") {
      this.isFragmentLoading = false;
      this.isLoading = true;
      await this.getTagUrlPathMethod(); // Also needed for fullImageSimulateUrl
      this.simulateFullImage();
    }
  }

  async simulateFullImage() {
    try {
      const queryParams = Object.entries(this.tagParamMap)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        )
        .join("&");

      // Assume you already have the base simulate path from earlier API call
      this.fullImageSimulateUrl = `${this.fullImgPath}?${queryParams}`;
      console.log("✅ Final Image URL:", this.fullImageSimulateUrl); // add this
    } catch (error) {
      console.error("Failed to simulate full image:", error);
    }
  }

  onInsert(): void {
    let valHtml;
    if (this.selectedTab === "full") {
      const fullImageContainer = this.tagSimulateURL;
      if (fullImageContainer) {
        const finalHTML = fullImageContainer;
        this.dataService.callInsertData(finalHTML, this.selectedTab, true);
      }
    } else if (this.selectedTab === "fragment") {
      let htmlToSend = "";
      // Fragment Mode
      const iframe: HTMLIFrameElement =
        this.previewArea.nativeElement.querySelector(
          ".fragment-iframe-container iframe"
        );

      if (iframe?.contentDocument) {
        this.doc = iframe.contentDocument;
        const selected = this.doc.querySelector(".selected-block");

        if (selected) {
          // Only selected block
          htmlToSend = selected.outerHTML;
        } else {
          // All selectable blocks wrapped in a container
          const allBlocks = this.doc.querySelectorAll(
            "table.row, div.fragment-type"
          );
          const container = this.doc.createElement("div");
          allBlocks.forEach((block) =>
            container.appendChild(block.cloneNode(true))
          );
          htmlToSend = container.innerHTML;
        }
      }

      this.dataService.callInsertData(
        JSON.stringify(htmlToSend),
        this.selectedTab,
        true
      );
    }
  }

  onClose(): void {
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
  }

  onImageLoad() {
    this.isLoading = false;
  }

  onImageError() {
    this.isLoading = false;
    console.error("Image failed to load");
  }
}
