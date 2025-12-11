import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit } from "@angular/core";
import { GlobalConstants } from "@app/design-channels/common/globalConstants";
import { GrapesJsBlocksService } from "../services/grapesjs-blocks.service";
import { GrapesJsCanvasService } from "../services/grapesjs-canvas.service";
import { OpenMenuService } from "../services/grapesjs-menu.service";
import { ScriptLoaderService } from "@app/core/services/script-loader.service";
import { GrapesJsStyleManagerService } from "../services/grapesjs-style-manager.service";
import { AppConstants } from "@app/app.constants";
import { DataService } from "@app/core/services/data.service";
declare var grapesjs: any;
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";
import { SharedataService } from "@app/core/services/sharedata.service";
import { HttpService } from "@app/core/services/http.service";
import { LoaderService } from "@app/core/services/loader.service";
import { environment } from "@env/environment";

@Component({
  selector: "app-grapesjs",
  templateUrl: "./grapesjs.component.html",
  styleUrls: ["./grapesjs.component.scss"],
})
export class GrapesjsComponent implements AfterViewInit {
  private BASE_URL = environment.BASE_URL;
  blockTypes = this.grpCanvasService.blockTypes;
  editor: any;
  tagKey: any;
  isDataLayerVisible = true;
  isPtagNameSaved: boolean = false;
  tagParamsArryObj: any = [];
  isPersonalizationPublish: boolean = false;
  htmlTemplate: any;
  editModeJsonObj: any;
  isTagParameterEnabled: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    private scriptLoader: ScriptLoaderService,
    private grpBlocksService: GrapesJsBlocksService,
    private grpCanvasService: GrapesJsCanvasService,
    private openMenuService: OpenMenuService,
    private styleManagerService: GrapesJsStyleManagerService,
    private dataService: DataService,
    private translate: TranslateService,
    private shareService: SharedataService,
    private httpService: HttpService,
    private ngZone: NgZone,
    private loader: LoaderService
  ) {
    this.shareService.tagParametersObjArry.subscribe((res) => {
      if (res !== undefined) {
        this.tagParamsArryObj = res;
      }
    });
    this.shareService.tagParameterDefinedStatus.subscribe((res: any) => {
      if (res !== undefined) {
        this.isTagParameterEnabled = res;
      }
    });
    this.getTagKeyMethod();

    this.htmlTemplate = `
      <div class="container" style="padding: 20px;">
        <h1>Hello, GrapesJS!</h1>
        <p>This is a custom HTML template loaded into the editor.</p>
      </div>
    `;

    this.editPersonalizationTag();
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();

    // Load scripts dynamically
    this.scriptLoader
      .loadScript("assets/js/grapes.min.js")
      .then(() => this.scriptLoader.loadScript("assets/js/grapesjs-preset-webpage.js"))
      .then(() => this.scriptLoader.loadScript("assets/js/grapesjs-blocks-basic.js"))
      .then(() => this.scriptLoader.loadScript("assets/js/grapesjs-custom-code.js"))
      .then(() => {
        console.log("All scripts loaded successfully");
        this.initializeGrapesJS();
      })
      .catch((error) => console.error("Error loading scripts:", error));
  }

  private initializeGrapesJS(): void {
    // Ensure the container exists before initializing GrapesJS
    const container = document.querySelector("#gjs");
    if (!container) {
      console.error("GrapesJS container not found!");
      return;
    }

    this.editor = grapesjs.init({
      container: "#gjs",
      height: "98vh",
      width: "100%",
      fromElement: false,
      storageManager: false,
      components: this.htmlTemplate,
      telemetry: false,
      autorender: true,
      showOffsets: true,
      //plugins: ['gjs-blocks-basic','grapesjs-preset-newsletter'],
      plugins: ["grapesjs-preset-webpage", "gjs-blocks-basic", "grapesjs-custom-code"],
      pluginsOpts: {
        "gjs-blocks-basic": {
          blocks: ["text"], // Specify only the blocks you want
          flexGrid: false, // Disable flex grid if not needed
        },
      },
      canvas: {
        styles: ["assets/fonts/fonts/fonts.css"],
        scripts: ["assets/js/angularjs.js"],
      },

      /* pluginsOpts: {
        'gjs-preset-newsletter': {
          modalLabelImport: 'Paste all your code here below and click import',
          modalLabelExport: 'Copy the code and use it wherever you want',
          codeViewerTheme: 'material',
          importPlaceholder: '<table class="table"><tr><td class="cell">Hello world!</td></tr></table>',
          cellStyle: {
            'font-size': '12px',
            'font-weight': 300,
            'vertical-align': 'top',
            color: 'rgb(74, 219, 34)',
            margin: 0,
            padding: 0,
          },
        },
      }, */
    });

    if (!this.editor) {
      console.error("GrapesJS failed to initialize!");
      return;
    }

    this.editor.Panels.getButton("views", "open-blocks").set("active", true);
    this.editor.Panels.getButton("options", "sw-visibility").set("active", true);

    /* const bm = this.editor.BlockManager;
    bm.getAll().forEach((block) => {
      if (!block.get('category')) {
        block.set({ category: 'Basic' });
      }
    });

    if (!bm.getCategories('My Components')) {
      bm.addCategory('My Components', { label: 'My Components' });
    } */

    const pn = this.editor.Panels;

    this.editor.BlockManager.add("custom-image", {
      label: "Image",
      category: "Basic",
      media: `<svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M21,3H3C2,3 1,4 1,5V19A2,2 0 0,0 3,21H21C22,21 23,20 23,19V5C23,4 22,3 21,3M5,17L8.5,12.5L11,15.5L14.5,11L19,17H5Z"></path>
      </svg>`,
      content: {
        type: "image",
        src: "https://via.placeholder.com/300x200",
      },
    });

    this.editor.DomComponents.addType("image", {
      model: {
        defaults: {
          tagName: "img",
          traits: [
            {
              type: "text",
              label: "Src",
              name: "src",
              changeProp: 1,
            },
            {
              type: "text",
              label: "Alt Text",
              name: "alt",
              changeProp: 1,
            },
          ],
        },
      },
    });

    const newSizePanel = pn.addPanel({
      id: "size-panel",
      visible: true,
      buttons: [
        {
          id: "dropdown-2",
          className: "custom-dropdown",
          attributes: { title: "Dropdown 2" },
          label: `
            <span>Aspect Ratio:</span>
            <select>
              <option value="16:9">16:9</option>
              <option value="4:3">4:3</option>
              <option value="1:1">1:1</option>
            </select>
          `,
        },
        {
          id: "dropdown-1",
          className: "custom-dropdown",
          attributes: { title: "Dropdown 1" },
          /* command: function () {
            alert('Dropdown 1 selected');
          }, */
          label: `
            <span>Template Size:</span>
            <select>
              <option value="1920X1080">1920 x 1080</option>
              <option value="375X667">375 x 667</option>
            </select>
          `,
        },
      ],
    });

    const self = this;
    pn.addButton("options", [
      {
        id: "save",
        className: "btn buttonCss", // Optional: Add a custom class for styling
        command: function (editor, sender) {
          self.loader.ShowLoader();
          if (sender) sender.set("active", false);
          const templateCSS = `<style>${editor.getCss()}</style>`;
          let templateHTML = editor.getHtml();
          let getHtml = editor.Canvas.getDocument();
          let getFullDocumentHtml = getHtml.documentElement.getHTML();
          self.getTagKeyMethod();
          console.log("Tag Key:", self.tagKey);

          const parser = new DOMParser();
          const doc = parser.parseFromString(getFullDocumentHtml, "text/html");
          const headTag = doc.head.outerHTML;

          const combinedHeadBody = headTag + templateCSS;

          let finalHtml = "<!DOCTYPE html><html>" + combinedHeadBody + templateHTML + "</html>";

          const endpoint = AppConstants.API_END_POINTS.GET_SAVE_PTAGGRP_TAG;
          /*  this.shareService.onPublishEnableForPersonalization.subscribe((res) => {
            if (res !== undefined) {
              this.isPersonalizationPublish = res;
            }
          }); */
          const payload = {
            tagKey: parseInt(self.tagKey),
            templateText: finalHtml,
            activeEdit: 0,
            cacheControl: 0,
            currentStep: "1",
            status: "1",
            publish: false,
            editorType: GlobalConstants.editorType,
          };

          if (self.isPtagNameSaved) {
            self.callEditSaveMethod(endpoint, payload, self.tagParamsArryObj);
          } else {
            self.callSaveMethod(endpoint, payload, self.tagParamsArryObj);
          }

          //editor.store();
          //alert("Template Saved Successfully !");
        },
        attributes: {
          title: "Save template",
          "data-tooltip-pos": "bottom",
        },
        label: "Save", // Replace the icon with text
      },
    ]);

    pn.addButton("options", [
      {
        id: "test-whatsapp",
        className: "btn buttonCss ml-2", // Optional: Add a custom class for styling
        command: function (editor, sender) {
          if (sender) sender.set("active", false);
          editor.store();
          alert("Template Saved Successfully !");
        },
        attributes: {
          title: "Test WhatsApp",
          "data-tooltip-pos": "bottom",
        },
        label: "Test WhatsApp", // Replace the icon with text
      },
    ]);

    pn.addButton("options", [
      {
        id: "simulate",
        className: "btn buttonCss ml-2", // Optional: Add a custom class for styling
        command: function (editor, sender) {
          if (sender) sender.set("active", false);
          editor.store();
          alert("Template Saved Successfully !");
        },
        attributes: {
          title: "Simulate",
          "data-tooltip-pos": "bottom",
        },
        label: "Simulate", // Replace the icon with text
      },
    ]);

    pn.removeButton("views", "open-layers");
    pn.removeButton("options", "preview");
    pn.removeButton("options", "canvas-clear");

    /* let editPanel: HTMLDivElement | null = null;
    pn.addButton("views", {
      id: "editMenu",
      attributes: { class: "far fa-address-card", title: "Edit Menu" },
      active: false,
      command: {
        run: function (editor) {
          if (editPanel == null) {
            const editMenuDiv = document.createElement("div");
            editMenuDiv.innerHTML = `
                <div id="your-content">
                  Input: <input/>
                  <button>Button</button> 
                </div>
              `;
            const panels = pn.getPanel("views-container");
            panels.set("appendContent", editMenuDiv).trigger("change:appendContent");
            editPanel = editMenuDiv;
          }
          editPanel.style.display = "block";
        },
        stop: function (editor) {
          if (editPanel != null) {
            editPanel.style.display = "none";
          }
        },
      },
    }); */

    /* this.editor.on('component:selected', () => {
      const commandToAdd = 'open-info';
      const commandIcon = 'fa fa-gear';

      const selectedComponent = this.editor.getSelected();
      const defaultToolbar = selectedComponent.get('toolbar');

      // check if this command already exists on this component toolbar
      const commandExists = defaultToolbar.some((item) => item.command === commandToAdd);

      // if it doesn't already exist, add it
      if (!commandExists) {
        selectedComponent.set({
          toolbar: [...defaultToolbar, { attributes: { class: commandIcon }, command: commandToAdd }],
        });
      }
    });

    const modal = this.editor.Modal;
    const infoContainer = document.getElementById('panel-shortcuts');
    this.editor.Commands.add('open-info', (editor, sender, options = {}) => {
      const selectedModel = options; // Access the data passed through commandOptions
      const traitsSector = `<div class="gjs-sm-sector no-select">
          <div class="gjs-sm-title"><span class="icon-settings fa fa-cog"></span> Settings</div>
          <div class="gjs-sm-properties">
            <p>Selected Model ID: ${selectedModel ? selectedModel : 'No model selected'}</p>
          </div>
        </div>`;
      infoContainer.style.display = 'block';
      modal.setTitle('Shortcuts');
      infoContainer.innerHTML = traitsSector;
      modal.setContent(infoContainer);
      modal.open();
      modal.getModel().once('change:open', () => {
        //mdlDialog.className = mdlDialog.className.replace('gjs-mdl-dialog-sm', '');
      });
    }); */

    this.styleManagerService.initializeStyleManager(this.editor);
    // Ensure `on` method exists before calling it
    if (this.editor.on) {
      this.editor.on("load", () => {
        let styleManager = this.editor.StyleManager;
        const fontProperty = this.editor.StyleManager.getProperty("typography", "font-family");
        let list: any;
        //fontProperty.set('list', list);
        list = [
          fontProperty.addOption({ value: "'ConduitBold'", name: "ConduitBold" }),
          fontProperty.addOption({ value: "ConduitExtraBold", name: "ConduitExtraBold" }),
        ];
        fontProperty.set("list", list);
        styleManager.render();

        const blockManager = this.editor.BlockManager;

        // List of unwanted blocks to remove
        const unwantedBlocks = ["quote", "link-block", "text-basic"];
        unwantedBlocks.forEach((blockId) => {
          const block = blockManager.get(blockId);
          if (block) {
            blockManager.remove(blockId);
          }
        });

        this.editor.Commands.run("core:component-outline");
        console.log("GrapesJS Editor is ready");
        this.grpBlocksService.addBlocks(this.editor);
        this.grpCanvasService.addBlocks(this.editor);
        this.openMenuService.initialize(this.editor);

        this.editor
          .getWrapper()
          .find(".draggable")
          .forEach((model) => {
            const isResizable = model.get("resizable");
            if (!isResizable) {
              model.set("resizable", {
                tl: 1,
                tc: 1,
                tr: 1,
                cl: 1,
                cr: 1,
                bl: 1,
                bc: 1,
                br: 1,
                keyWidth: "width",
                keyHeight: "height",
                currentUnit: "px",
              });
            }
            setTimeout(() => this.grpCanvasService.addRotationHandle(model), 0);
          });
      });
    }

    // Add floating toolbar block drag support for all blocks
    setTimeout(() => {
      this.blockTypes.forEach((block) => {
        const el = document.getElementById(block.id);
        if (el) {
          el.addEventListener("mousedown", (e) => {
            e.preventDefault();
            if (this.editor && this.editor.BlockManager) {
              const bmBlock = this.editor.BlockManager.get(block.id);
              if (bmBlock) {
                this.editor.BlockManager.startDrag(bmBlock);
              }
            }
          });
        }
      });
    }, 0);
  }

  onSizeChange(event: any) {
    const [width, height] = event.target.value.split("x");
    const canvas = this.editor.Canvas.getBody().parentElement as HTMLElement;
    canvas.removeAttribute("style");

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.margin = "0 auto";
  }

  onAspectRatioChange(event: any) {
    const [w, h] = event.target.value.split(":");
    const canvas = this.editor.Canvas.getBody().parentElement as HTMLElement;

    const width = canvas.offsetWidth;
    const height = `${width * (parseInt(h) / parseInt(w))}px`;

    const mainContainer = canvas.querySelector("#mainContainer") as HTMLElement;
    if (mainContainer && mainContainer.parentElement) {
      const parentDiv = mainContainer.parentElement as HTMLElement;
      parentDiv.removeAttribute("style");

      parentDiv.style.minHeight = height;
    }
  }

  toggleDataLayer() {
    this.isDataLayerVisible = !this.isDataLayerVisible;
  }

  async callSaveMethod(endpoint, payload, tagParamObj) {
    let journeyNameIsEdited = this.dataService.activeContentPtagName;
    if (journeyNameIsEdited === "Personalization_Untitle" || journeyNameIsEdited == null) {
      this.loader.ShowLoader();
      Swal.fire({
        // title: this.translate.instant('dataServicesTs.areYouSureAlertMsgLbl'),
        titleText: this.translate.instant("beeEditorGlobalComponent.confirmMessageForNameSavingLbl"),
        html:
          `<input type="text" id="tagName" class="swal2-input" maxlength="200" placeholder="` +
          this.translate.instant("beeEditorGlobalComponent.enterNameTagLbl") +
          `">`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#026FE9",
        cancelButtonColor: "#FFF",
        confirmButtonText: this.translate.instant("yes"),
        cancelButtonText: this.translate.instant("cancel"),
        allowEscapeKey: false,
        allowOutsideClick: false,
        customClass: {
          cancelButton: "buttonCssStyle",
          confirmButton: "buttonCssStyle",
        },

        focusConfirm: true,
        preConfirm: () => {
          let tagName: any = Swal.getPopup();

          tagName = tagName.querySelector("#tagName").value;

          if (tagName == "") {
            this.isPtagNameSaved = false;
            Swal.showValidationMessage(this.translate.instant("beeEditorGlobalComponent.enterNameTagLblValidation"));
          }
          return { tagName: tagName };
        },
      }).then(async (result: any) => {
        if (result.isConfirmed) {
          this.commonSaveCallMethod(endpoint, payload, tagParamObj, result?.value.tagName);
        }
      });
    } else {
      this.commonSaveCallMethod(endpoint, payload, tagParamObj, journeyNameIsEdited);
    }
  }

  async commonSaveCallMethod(endpoint, payload, tagParamObj, resultTagName) {
    if (Object.keys(tagParamObj).length === 0) {
      this.isPersonalizationPublish = false;
      this.validateTagParams(tagParamObj);
    } else {
      this.isPersonalizationPublish = false;
      payload.name = resultTagName;

      const res = await this.httpService.post(endpoint, payload).toPromise();
      if (res.status == "SUCCESS") {
        //localStorage.setItem("tagKeyPersonalization",JSON.stringify(res.response.tagKey));
        //localStorage.setItem("tagNamePersonalization",JSON.stringify(payload.name));
        this.dataService.setSharedActiveContentName = payload.name;
        this.ngZone.run(() => {
          this.shareService.journeyNameFromBeeEditorPtag.next(payload.name);
        });
        this.tagKey = res.response.tagKey;
        this.isPtagNameSaved = true;
        Swal.fire({
          title: res.message,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant("designEditor.okBtn"),
        });
        this.removeLoader();
      } else {
        Swal.fire({
          title: res.message,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant("designEditor.okBtn"),
        });
        this.removeLoader();
      }
    }
  }

  async callEditSaveMethod(endpoint, payload, tagParamObj) {
    console.log(tagParamObj);
  }

  validateTagParams(tagParamsArry) {
    Swal.fire({
      title: this.translate.instant("beeEditorGlobalComponent.tagParametersAreMandatoryBeforeSaveValidationLbl"),
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: true,
      confirmButtonText: this.translate.instant("designEditor.okBtn"),
    });
    this.removeLoader();
    return;
  }

  async getTagKeyMethod() {
    try {
      this.tagKey = this.dataService.activeContentTagKey;
    } catch (error) {
      this.removeLoader();
      console.error("An error occurred in getTagKeyMethod:", error);
    }
  }

  removeLoader() {
    this.ngZone.run(() => {
      this.loader.loadCount = 0;
      this.loader.HideLoader();
    });
  }

  editPersonalizationTag() {
    if (this.tagKey !== undefined && this.tagKey !== null) {
      let endpoint = AppConstants.API_END_POINTS.GET_EDIT_PTAGGRP_TAG + "?tagKey=" + this.tagKey;
      this.httpService.post(endpoint).subscribe((res) => {
        if (res !== undefined) {
          if (res.status == "SUCCESS") {
            this.editModeJsonObj = JSON.parse(res.response.jsonString);
            if (Object.keys(this.editModeJsonObj).length > 0) {
              this.dataService.setSharedActiveContentName = this.editModeJsonObj.name;
              this.htmlTemplate = this.editModeJsonObj.templateText;
              this.isTagParameterEnabled = true;
              if (this.editModeJsonObj.tagParams !== undefined) {
                this.shareService.tagParametersObjArry.next(JSON.parse(this.editModeJsonObj.tagParams));
              }
            }
          }
        }
      });
    } else {
      window.open(`${this.BASE_URL}/personalizationTags/loadPersonalizationTags`, "_parent");
    }
  }
}
