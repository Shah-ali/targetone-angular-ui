import {
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  Renderer2,
  TemplateRef,
  ChangeDetectorRef,
} from "@angular/core";
import { SharedataService } from "@app/core/services/sharedata.service";
import { BsModalRef } from "ngx-bootstrap/modal";
import { DataService } from "@app/core/services/data.service";
import { HttpService } from "@app/core/services/http.service";
import { AppConstants } from "@app/app.constants";
import { Router } from "@angular/router";
import { GlobalConstants } from "../common/globalConstants";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-active-content",
  templateUrl: "./active-content.component.html",
  styleUrls: ["./active-content.component.scss"],
})
export class ActiveContentComponent implements OnInit {
  activeTab: "active" | "favourite" = "active";
  searchText = "";
  ptags: any[] = [];
  filteredPTags: any[] = [];
  isLoading: boolean = false;
  selectedTagId: number = -1;
  tagMap: { [key: number]: any } = {};
  sortAsc: boolean = false; // false = descending by default

  currentTemplate!: TemplateRef<any>;

  @ViewChild("ptagDashboard", { static: true })
  ptagDashboardTpl!: TemplateRef<any>;
  @ViewChild("ptagDetails", { static: true }) ptagDetailsTpl!: TemplateRef<any>;

  @Output() onAdd = new EventEmitter<any>();
  savedState = {};

  constructor(
    private bsModalRef: BsModalRef,
    private dataService: DataService,
    private httpService: HttpService,
    private shareService: SharedataService,
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadPTags();
    this.currentTemplate = this.ptagDashboardTpl;
    GlobalConstants.parentComponentName = "ActiveContentComponent";
    this.subscribeToSavedAddOnsJSON();

    this.dataService.data$.subscribe(({ message, tab, fromState }) => {
      if (message && Object.keys(message).length > 0 && fromState) {
        this.insertData(message, tab);
      }
    });
  }

  switchTab(tab: "active" | "favourite"): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.searchText = ""; // Reset search input
      this.filteredPTags = []; // Reset visible list
      this.loadPTags(); // Reload based on tab
    }
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = "assets/images/personalization-default.svg";
  }

  subscribeToSavedAddOnsJSON(): void {
    this.shareService.savedAddOnsJSON.subscribe((res: any) => {
      const savedState = res.savedState || {};
      if (!savedState || Object.keys(savedState).length === 0) return;
      this.activeTab = savedState.activeTab;
      this.selectedTagId = savedState.selectedTagId;
      this.dataService.setSimulationState(savedState);
    });
  }

  loadPTags(): void {
    console.log("inside loadPTags");
    const type = this.activeTab;
    this.httpService.get(`${AppConstants.PTAG_DASHBOARD.GET_PTAG_DASHBOARD_API}type=${type}`).subscribe({
      next: (res) => {
        const result = res?.body.response || [];
        this.ptags = result.filter((ptag) => {
          const isActive = ptag.status === "active";
          if (isActive) {
            this.tagMap[ptag.tagId] = ptag;
          }
          return isActive;
        });
        this.filteredPTags = [...this.ptags];
        // this.filteredPTags = result;
        this.isLoading = false;
        const retainedId = this.dataService.getSelectedTagId();
        // if (retainedId) {
        //   this.selectedTagId = retainedId;
        // }
        this.cdRef.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;

        console.error("API error:", err);
        // Optionally show error message on UI
      },
    });
  }

  filterPtags(): void {
    const search = this.searchText.toLowerCase();
    this.filteredPTags = this.ptags.filter((ptag) => ptag.tagName.toLowerCase().includes(search));
  }

  onTagSelect(tagId: number): void {
    this.selectedTagId = tagId;
  }

  toggleSort(): void {
    this.sortAsc = !this.sortAsc;

    this.filteredPTags.sort((a, b) => {
      const dateA = new Date(a.activationDate || a.creationDate);
      const dateB = new Date(b.activationDate || b.creationDate);

      return this.sortAsc ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
  }
  onViewDetails(): void {
    if (this.selectedTagId !== -1) {
      this.dataService.setTag(this.tagMap[this.selectedTagId]);
      this.dataService.setSelectedTagId(this.selectedTagId);

      // Switch to details view
      this.currentTemplate = this.ptagDetailsTpl;
    } else {
      Swal.fire({
        icon: "warning",
        title: this.translate.instant("activeContentAddons.DASHBOARD.noActiveContentSelected"),
        text: this.translate.instant("activeContentAddons.DASHBOARD.selectAnActiveContent"),
        confirmButtonText: "OK",
      });
      this.currentTemplate = this.ptagDashboardTpl; // Stay on dashboard if no tag is selected
    }
  }

  showDashboard(): void {
    this.currentTemplate = this.ptagDashboardTpl;
  }

  insertData(html: string, tab: string): void {
    let finalHTML = "";
    if (tab === "full") {
      finalHTML = `<img src="${html}">`;
    } else if (tab === "fragment") {
      finalHTML = JSON.parse(html);
    }
    this.savedState = {
      activeTab: this.activeTab,
      selectedTagId: this.selectedTagId,
      simulateMethod: tab,
    };

    const valHtml = {
      type: "html",
      componentName: "active-content-addon",

      value: {
        html: finalHTML,
        savedState: this.savedState,
      },
    };

    this.onClose();
    this.onAdd.emit(valHtml);
  }

  onClose(): void {
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
  }
}
