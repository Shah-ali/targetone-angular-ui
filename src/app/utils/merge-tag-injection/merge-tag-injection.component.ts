import { ChangeDetectorRef, Component, HostListener, Input, NgZone, OnInit } from "@angular/core";
import { Clipboard } from "@angular/cdk/clipboard";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ApiPersonalizationComponent } from "@app/personalization-tags/api-personalization/api-personalization.component";
import { SharedataService } from "@app/core/services/sharedata.service";
import { DataService } from "@app/core/services/data.service";
import { HttpService } from "@app/core/services/http.service";
import { DMENonCustomerComponent } from "@app/personalization-tags/dme-customer-noncustomer/dme-non-customer/dme-non-customer.component";
import { AppConstants } from "@app/app.constants";
import Swal from "sweetalert2";
import { response } from "express";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-merge-tag-injection",
  templateUrl: "./merge-tag-injection.component.html",
  styleUrls: ["./merge-tag-injection.component.scss"],
})
export class MergeTagInjectionComponent implements OnInit {
  @Input("dataFromParent") modalRef?: BsModalRef;
  @Input() jsonData: any;
  mergeTagJSONData: any = null;
  openStoredDataMap: { [key: string]: boolean } = {};
  selectedModel: any = null;
  modelFields: any = {};
  promotionKey: any;
  currentSplitId: any;
  channelType: any;
  commChannelKey: any;
  showLoader: boolean = false;
  tempSelectedModel: any = null;
  maxCountVal: number = 0;

  constructor(
    private bsModalRef: BsModalRef,
    private ngZone: NgZone,
    private clipboard: Clipboard,
    private cd: ChangeDetectorRef,
    private modalService: BsModalService,
    private shareService: SharedataService,
    private dataService: DataService,
    private http: HttpService,
    private translate: TranslateService
  ) {
    this.dataService.$sharedPromoKey.subscribe((result) => {
      this.promotionKey = this.promotionKey = result;
    });

    this.shareService.currentSelectedChannelObj.subscribe((res: any) => {
      this.channelType = res.channelType;
      this.currentSplitId = res.currentSplitId;
      this.commChannelKey = res.commChannelKey;
    });
  }

  ngAfterViewInit(): void {
    this.ngZone.run(() => {
      this.mergeTagJSONData = JSON.parse(this.jsonData);

      if (this.mergeTagJSONData?.length > 0) {
        /* const firstItem = this.mergeTagJSONData[0].name;
        this.openStoredDataMap[firstItem] = true; */
        this.mergeTagJSONData.forEach((item) => {
          this.openStoredDataMap[item.name] = true;
        });
        this.selectedModel = this.mergeTagJSONData[0].items[0];
        this.tempSelectedModel = this.selectedModel.input;
      }
    });
    this.cd.detectChanges();
  }

  ngOnInit(): void {}

  toggleStoredData(name: string): void {
    this.openStoredDataMap[name] = !this.openStoredDataMap[name];
  }

  selectModel(model: any) {
    this.selectedModel = model;
    this.tempSelectedModel = this.selectedModel.input;
  }

  copy(code: string) {
    navigator.clipboard.writeText(code);
  }

  addItems(event: MouseEvent, code) {
    event.stopPropagation();

    const isAPI = code.name === "apiData";
    const modalComponent: any = code.name === "apiData" ? ApiPersonalizationComponent : DMENonCustomerComponent;

    const modalConfig = {
      class: "modal-dialog-centered mergeTagInjectionModal",
      backdrop: "static",
      keyboard: false,
      initialState: {
        openedFrom: "mergeTagOffersDrawer",
      },
    } as const;

    this.modalRef = this.modalService.show(modalComponent, modalConfig);

    this.modalRef.content.onUpdateMergeTagInj.subscribe((receivedData: any) => {
      //console.log('promotionKey:', this.promotionKey);
      //console.log('currentSplitId:', this.currentSplitId);

      const payload = receivedData.selectedMergeTagData;
      this.maxCountVal = payload.maxCount || 0;
      //console.log('Selected API received from modal:', payload);

      this.showLoader = true;
      const urlString =
        AppConstants.MERGE_TAG_INJECTION.SAVE_MERGE_TAGS + this.promotionKey + "&splitId=" + this.currentSplitId;
      this.http.post(urlString, payload).subscribe((data) => {
        if (data.status === "FAIL") {
          Swal.fire({
            icon: "warning",
            text: data.message,
          });
        } else {
          this.mergeTagJSONData = JSON.parse(data.response);
        }
        this.showLoader = false;
        this.cd.detectChanges();
      });
    });
  }

  deleteMergeTag(type, selectedModelName) {
    Swal.fire({
      titleText: this.translate.instant("designEditor.offerDrawerComponent.deleteMergeTagComfirmationMsgLbl"),
      showCancelButton: true,
      confirmButtonText: this.translate.instant("yes"),
      cancelButtonText: this.translate.instant("cancel"),
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        cancelButton: "buttonCssStyle",
        confirmButton: "buttonCssStyle",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const urlString =
          AppConstants.MERGE_TAG_INJECTION.DELETE_MERGE_TAGS +
          this.promotionKey +
          "&type=" +
          type +
          "&name=" +
          encodeURIComponent(selectedModelName) +
          "&splitId=" +
          this.currentSplitId;
        this.http.post(urlString).subscribe((res) => {
          console.log("Delete res:", res);
          console.log("selectedModel:", this.selectedModel);

          this.mergeTagJSONData = JSON.parse(res.response);
          if (this.mergeTagJSONData?.length > 0) {
            this.selectedModel = this.mergeTagJSONData[0].items[0];
            this.tempSelectedModel = this.selectedModel.input;
          }
        });
      }
    });
  }

  onSearch(event: any): void {
    this.tempSelectedModel = this.selectedModel.input;
    if (event.target.value === "") {
      return;
    } else {
      this.tempSelectedModel = this.selectedModel.input.filter((item) => {
        return item.displayName.toLowerCase().indexOf(event.target.value.toLowerCase().trim()) > -1;
      });
    }
  }

  copyToPaste(tooltip, code: string) {
    const refEl = code;
    tooltip.show({ refEl });
    this.clipboard.copy(refEl);
    setTimeout(() => tooltip.hide(), 1000);
  }
}
