import { Component, HostListener, NgZone, OnInit } from "@angular/core";
import { TREE_DATA } from "./data-json";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { LoaderService } from "@app/core/services/loader.service";
import { TagResponseParamtersComponent } from "@app/personalization-tags/tag-response-paramters/tag-response-paramters.component";
import { SharedataService } from "@app/core/services/sharedata.service";

interface TreeNode {
  name: string;
  input?: TreeNode[];
  expanded?: boolean;
  showActions?: boolean;
  metadata?: any;
}

@Component({
  selector: "app-data-layer",
  templateUrl: "./data-layer.component.html",
  styleUrls: ["./data-layer.component.scss"],
})
export class DataLayerComponent implements OnInit {
  treeData: TreeNode[] = [];
  menuPosition = { top: 0, left: 0 };
  bsModalRef: any = BsModalRef;
  modalRef?: BsModalRef;
  tagParamsArryObj: any = [];

  constructor(
    private modalService: BsModalService,
    private ngZone: NgZone,
    private loader: LoaderService,
    private shareService: SharedataService
  ) {
    this.shareService.tagParametersObjArry.subscribe((res) => {
      if (res !== undefined) {
        this.tagParamsArryObj = res;
      }

      const paramsArray = Array.isArray(this.tagParamsArryObj?.params)
        ? this.tagParamsArryObj.params
        : Array.isArray(this.tagParamsArryObj)
        ? this.tagParamsArryObj
        : [];

      this.treeData = TREE_DATA as TreeNode[];
      const tagParameterNode = this.treeData.find((node) => node.name === "TagParameter");
      if (tagParameterNode && tagParameterNode.input) {
        if (paramsArray.length > 0) {
          tagParameterNode.input = []; // Clear existing inputs to avoid duplicates
          paramsArray.forEach((tagParam) => {
            tagParameterNode.input?.push({
              name: tagParam.name,
              metadata: { type: "childLabel", edit: true, fallback: true },
            });
          });
        }
      }
    });
  }

  ngOnInit(): void {}

  toggleChildren(node: TreeNode): void {
    if (node.input) {
      node.expanded = !node.expanded;
    }
  }
  showActions(node: TreeNode, event: MouseEvent): void {
    event.stopPropagation(); // Prevent click from propagating

    // Close all open action menus
    this.treeData.forEach((treeNode) => {
      treeNode.showActions = false;
      if (treeNode.input) {
        this.hideChildActions(treeNode.input);
      }
    });

    // Open the action menu for the clicked node
    node.showActions = true;

    // Calculate the position of the action menu
    const menuHeight = 150; // Approximate height of the action menu
    const menuWidth = 200; // Approximate width of the action menu
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let top = event.clientY;
    let left = event.clientX;

    // Adjust if the menu goes beyond the bottom of the viewport
    if (top + menuHeight > viewportHeight) {
      top = viewportHeight - menuHeight - 10; // Add some padding
    }

    // Adjust if the menu goes beyond the right of the viewport
    if (left + menuWidth > viewportWidth) {
      left = viewportWidth - menuWidth - 10; // Add some padding
    }

    this.menuPosition = { top, left };
  }

  hideActions(node: TreeNode) {
    node.showActions = false;
  }

  performAction(node: TreeNode, action: string): void {
    console.log(`Performing action '${action}' on node '${node.name}'`);

    // Add the new API data layer as a child of the node
    const newAPILayer = {
      name: "RR_offer_new",
      expanded: false,
      type: "api",
      metadata: { type: "parentLabel", fallback: true, transform: true },
      input: [{ name: "offer_name_1" }, { name: "offer_url_1" }, { name: "offer_click_1" }, { name: "offer_price" }],
    };

    // Ensure the node has a children array
    if (!node.input) {
      node.input = [];
    }

    // Add the new API data layer to the node's children
    node.input.push(newAPILayer);

    node.showActions = false; // Hide actions after performing
  }

  // Listen for clicks outside the action-menu
  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    this.treeData.forEach((node) => {
      if (node.showActions) {
        node.showActions = false;
      }
      if (node.input) {
        this.hideChildActions(node.input);
      }
    });
  }

  // Recursive method to hide actions for child nodes
  private hideChildActions(children: any[]): void {
    children.forEach((child) => {
      child.showActions = false;
      if (child.children) {
        this.hideChildActions(child.children);
      }
    });
  }

  addAPIDataLayer() {
    const newAPILayer = {
      name: "RR_new_offer",
      expanded: false,
      type: "api",
      count: 8,
      objType: "single",
      metadata: {
        type: "parentLabel",
        edit: true,
        fallback: true,
        transform: true,
        delete: true,
        addDME: true,
        addAPI: true,
      },
      input: [{ name: "offer_name" }, { name: "offer_url" }, { name: "offer_click" }, { name: "offer_price" }],
    };

    // Add the new API data layer to the root of the treeData
    this.treeData.push(newAPILayer);
  }

  addTagParams() {
    this.callPopupComponent(TagResponseParamtersComponent, "tagParameterCss");
  }

  callPopupComponent(modalTemplate, classCss) {
    this.modalRef = this.modalService.show(modalTemplate, {
      class: "modal-dialog-centered " + classCss,
      backdrop: "static",
      keyboard: false,
    });
    this.removeLoader();
  }

  removeLoader() {
    this.ngZone.run(() => {
      this.loader.loadCount = 0;
      this.loader.HideLoader();
    });
  }
}
