import { Component, OnInit,ViewChild, AfterViewInit, Input, ElementRef, Output, EventEmitter} from '@angular/core';
//import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-cdk-drag-drop',
  templateUrl: './cdk-drag-drop.component.html',
  styleUrls: ['./cdk-drag-drop.component.scss']
})
export class CdkDragDropComponent implements OnInit {
  @ViewChild('designLayoutStructure') designLayoutStructure!: ElementRef;
  @Input() layoutCount:any = [1,2,3,4,5,6,7,8];
  @Output() inserHtmlCustomLayout: EventEmitter<any> = new EventEmitter();
  htmlDesignStructure:any;
  @Input() productAttArryObj:any;
  @Input() addCustomLayout:any;
  @Input() customLayoutEnabled:any;
  @Input() maxCountLayout:any;
  htmlTagDesign:any;
  @ViewChild('previewTabContent') previewTabContent!: ElementRef; 
  objectKey = Object.keys;
  // htmlContent = '';
  // config: AngularEditorConfig = {
  //   editable: true,
  //   spellcheck: true,
  //   height: '15rem',
  //   minHeight: '5rem',
  //   placeholder: 'Enter text here...',
  //   translate: 'no',
  //   defaultParagraphSeparator: 'p',
  //   defaultFontName: 'Arial',
  //   toolbarHiddenButtons: [
  //     ['bold']
  //     ],
  //   customClasses: [
  //     {
  //       name: "quote",
  //       class: "quote",
  //     },
  //     {
  //       name: 'redText',
  //       class: 'redText'
  //     },
  //     {
  //       name: "titleText",
  //       class: "titleText",
  //       tag: "h1",
  //     },
  //   ]
  // };
  gridView = true;

todo:any = [
  
];


done:any = [
   
];
//arry:any = [];
tabsNameArry:any = [];
productLayoutTabEnable:any = true;
editorTabEnable:any = false;
previewTabEnable:any = false;
selectedActiveLi: any = 'productTab';
  structureDesignHtml: any;
  previewHtml: any;
  placementObjDragged: any;
  previewCounter: any = [];
  constructor(private translate:TranslateService) { 
    this.tabsNameArry = [{id:'productTab',value:this.translate.instant('recommendationComponent.productLayoutLbl')},{id:'previewTab',value:this.translate.instant('recommendationComponent.previewLbl')}];
  }
// Initialize the boolean to change between grid view and 1 column 
counterUpdatePreview(i: any) {
  let obj:any = []
  for (let j = 0; j < parseInt(i); j++) {
    obj.push(j);
  }
  this.previewCounter = obj;
}

selectActiveTab(tabType,evt){ 
  this.selectedActiveLi = tabType;
  if(tabType === 'productTab') {
    this.productLayoutTabEnable = true;
    this.editorTabEnable = false;
    this.previewTabEnable = false;
    
  }else if(tabType === 'previewTab'){
    this.productLayoutTabEnable = false;
    this.editorTabEnable = false;
    this.previewTabEnable = true;
    this.counterUpdatePreview(this.maxCountLayout);
    this.htmlDesignStructure = this.htmlTagDesign;
    
    
    // this.layoutCount.forEach(element => {
    //   this.previewTabContent.nativeElement.innerHTML = this.myEditor.val();
    // });
    
    this.previewHtml = this.htmlTagDesign;
    this.inserHtmlCustomLayout.emit(this.htmlDesignStructure);
    //this.resetEditSection.emit();
  }
}
cretaeHtmlStructureUsingAttributes(htmlObjArry){
  if(htmlObjArry !== undefined){
    //this.resetEditSection.emit();
    let obj:any = [];
    let objPlacement:any = [];
    // htmlObjArry.forEach(element => {     
    //   obj.push('<div class="col">'+element.innerHTML+'</div>');
    // });
    for (let i=0; i < htmlObjArry.length; i++){
      obj.push('<div class="col " style="font-size: 14px;padding: 15px;border: 1px dotted #ddd;margin: 1px auto;width: calc(100vh - 100px);text-align: center;">{'+htmlObjArry[i].innerHTML.trim()+'}</div>');
      objPlacement.push('P'+(i+1));
      this.placementObjDragged = objPlacement;
    }
    //this.palcementArry.emit({html:obj,placementId:objPlacement});
    //this.addCustomLayout.nativeElement.innerHTML = htmlObjArry;
    this.htmlDesignStructure = obj.toString().replaceAll(',',"");
    this.inserHtmlCustomLayout.emit(this.htmlDesignStructure);
    return this.htmlDesignStructure;
  }
}
// Method to change the ngIf directive Value 
gridViewChange() {
  this.gridView = !this.gridView;
}
getWidth() : any {
  if (document.body.offsetWidth < 850) {
    return '90%';
  }
  
  return 850;
}
droppoint(event) {
  var data = event.dataTransfer.getData("Text");
  event.target.appendChild(document.getElementById(data));
  event.preventDefault();
}
allowDropOption(event) {
  event.preventDefault();
  
}
dragpoint(event) {
  event.dataTransfer.setData("Text", '{'+event.target.id+'}');
}
  ngOnInit(): void {
  }
  
}
