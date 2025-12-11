import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GrapesJsCanvasService {
  public blockTypes = [
    { id: "canvas-block", label: "Canvas Area", icon: "fal fa-database" },
    { id: "draggable-0", label: "Text Block", icon: "fas fa-font" },
    { id: "draggable-1", label: "Image Block", icon: "fas fa-image" },
    { id: "draggable-2", label: "HTML Block", icon: "fas fa-code" },
  ];
  generateRandomClass = () => `random-class-${Math.random().toString(36).substr(2, 8)}`;

  constructor() {}

  addBlocks(editor: any): void {
    if (!editor || !editor.BlockManager) {
      console.error("Editor is not initialized yet");
      return;
    }

    this.addDataBlockType(editor);
    this.addCanvasBlock(editor);
    this.addDraggableBlocks(editor);
    this.setupComponentAddHandler(editor);
    this.setupCanvasDragHandler(editor);
    //this.setupComponentDragEndHandler(editor);
    this.setupExportTemplateHandler(editor);
  }

  private addDataBlockType(editor: any): void {
    editor.DomComponents.addType("Data Block", {
      model: {
        defaults: {
          tagName: "div",
          draggable: true,
          droppable: true,
          resizable: true,
          attributes: { class: "data-block" },
        },
      },
      view: {
        onRender() {
          //this.el.style.position = "absolute";
        },
      },
    });
  }

  private addCanvasBlock(editor: any): void {
    editor.BlockManager.add("canvas-block", {
      label: "Canvas Area",
      media: `
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M2 20h20V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1Z"></path>
        </svg>`,
      content: `<style>
        .canvas-area { background:#efefef; border:1px solid black; width:100%; height:300px; position:relative; overflow:hidden; }
      </style><div style="position:static"><div class="canvas-area"></div></div>`,
      attributes: { class: "" },
      category: "Containers",
    });
  }

  private addDraggableBlocks(editor: any): void {
    const blockTypes = [
    { label: "Text Block", content: "<div>Draggable text</div>", type: "text" },
    { label: "Image Block", content: '<div><img src="../assets/images/img-icon.png" style="width:100px; height:auto" /></div>', type: "" },
    { label: "HTML Block", content: '<div style="background:#ddd;"><h3>My Custom HTML</h3></div>', type: "custom-code" },
  ];

    blockTypes.forEach((block, index) => {
      editor.BlockManager.add(`draggable-${index}`, {
        label: block.label,
        category: "Containers",
        content: () => {
          const randomClass = this.generateRandomClass();
          return {
            type: block.type,
            classes: ["draggable", randomClass],
            components: block.content,
            style: { position: "absolute", cursor: "move", padding:"5px", display: "flex", "align-items": "center","justify-content": "center"},
            resizable: {
              tl: 1, tc: 1, tr: 1, cl: 1, cr: 1, bl: 1, bc: 1, br: 1,
              keyWidth: "width", keyHeight: "height", currentUnit: "px",
            },
          };
        },
        attributes: { class: "fa fa-square" },
      });
    });
  }

  private setupComponentAddHandler(editor: any): void {
    editor.on("component:add", (model) => {
      if (!model.getClasses().includes("draggable")) return;

      const parentCanvas = model.closest(".canvas-area");
      if (!parentCanvas) {
        model.remove();
        console.warn("Draggable blocks can only be added inside the canvas-area.");
        return;
      }

      model.set({ draggable: ".canvas-area" });
      setTimeout(() => this.addRotationHandle(model), 0);
    });
  }

  addRotationHandle(model: any): void {
    const el = model.view?.el;
    if (!el || el.querySelector(".rotation-handle")) return;

    const handle = document.createElement("div");
    Object.assign(handle, {
      className: "rotation-handle",
      title: "Rotate",
    });
    Object.assign(handle.style, {
      position: "absolute",
      right: "-15px",
      top: "50%",
      transform: "translateY(-50%)",
      width: "20px",
      height: "20px",
      background: "#2196f3",
      borderRadius: "50%",
      cursor: "grab",
      border: "2px solid #fff",
      boxShadow: "0 0 2px #333",
    });

    el.appendChild(handle);

    let isRotating = false, startAngle = 0, center = { x: 0, y: 0 };

    handle.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      e.preventDefault();
      isRotating = true;
      const rect = el.getBoundingClientRect();
      center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      startAngle = parseFloat(el.getAttribute("data-angle") || "0");
      document.body.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isRotating) return;
      const dx = e.clientX - center.x;
      const dy = e.clientY - center.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      el.style.transform = `rotate(${angle}deg)`;
      el.setAttribute("data-angle", angle.toString());
    });

    window.addEventListener("mouseup", () => {
      if (isRotating) {
        isRotating = false;
        document.body.style.cursor = "";
      }
    });
  }

  private setupCanvasDragHandler(editor: any): void {
    const canvasDocument = editor.Canvas.getDocument();

    canvasDocument.addEventListener("mousedown", (e) => {
      const target = (e.target as HTMLElement).closest(".draggable");
      if (!target) return;

      e.preventDefault();

      const canvas = target.closest(".canvas-area") as HTMLElement;
      if (!canvas) return;

      let startX = e.clientX, startY = e.clientY;
      let rect = target.getBoundingClientRect();
      let canvasRect = canvas.getBoundingClientRect();
      let initialLeft = rect.left - canvasRect.left;
      let initialTop = rect.top - canvasRect.top;

      const onMouseMove = (event: MouseEvent) => {
        let deltaX = event.clientX - startX;
        let deltaY = event.clientY - startY;
        let newLeft = initialLeft + deltaX;
        let newTop = initialTop + deltaY;
        let maxX = canvas.clientWidth - target.clientWidth;
        let maxY = canvas.clientHeight - target.clientHeight;

        (target as HTMLElement).style.left = `${Math.max(0, Math.min(newLeft, maxX))}px`;
        (target as HTMLElement).style.top = `${Math.max(0, Math.min(newTop, maxY))}px`;
      };

      const onMouseUp = () => {
        canvasDocument.removeEventListener("mousemove", onMouseMove);
        canvasDocument.removeEventListener("mouseup", onMouseUp);

        const targetElement = target as HTMLElement; // Explicitly cast to HTMLElement
          const offsetTop = `${targetElement.offsetTop}px`;
          const offsetLeft = `${targetElement.offsetLeft}px`;

        if (target.classList.contains("draggable")) {
          const top = offsetTop;
          const left = offsetLeft;
          const id = target.id;
          const component = editor.getWrapper().find(`#${id}`)[0];
          if (!component) {
            console.error(`No component found with ID: ${id}`);
            return;
          }
          const existingStyles = component.getStyle() || {};
          component.setStyle({ ...existingStyles, top, left });
        }
      };

      canvasDocument.addEventListener("mousemove", onMouseMove);
      canvasDocument.addEventListener("mouseup", onMouseUp, { once: true });
    });
  }

  private setupComponentDragEndHandler(editor: any): void {
    editor.on("component:drag:end", (model) => {
      if (!model.getClasses().includes("draggable")) return;
      const el = model.target.view.el;
      const existingStyles = model.target.getStyle() || {};
      model.target.setStyle({
        ...existingStyles,
        top: `${el.offsetTop}px`,
        left: `${el.offsetLeft}px`,
      });
    });
  }

  private setupExportTemplateHandler(editor: any): void {
    editor.on("run:export-template", () => {
      editor.getWrapper().find(".draggable").forEach((model) => {
        const el = model.view.el;
        const existingStyles = model.getStyle() || {};
        model.setStyle({
          ...existingStyles,
          top: `${el.offsetTop}px`,
          left: `${el.offsetLeft}px`,
        });
      });
    });
  }
}