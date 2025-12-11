import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { AppConstants } from '@app/app.constants';
import { HttpService } from '@app/core/services/http.service';
import { SharedataService } from '@app/core/services/sharedata.service';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';
import { dataTool } from 'echarts';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Key, promise } from 'protractor';
import Swal from 'sweetalert2';
import lodash, { drop, findIndex, last, take, uniq } from "lodash";
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-convert-json-to-grid-view',
  templateUrl: './convert-json-to-grid-view.component.html',
  styleUrls: ['./convert-json-to-grid-view.component.scss']
})
export class ConvertJsonToGridViewComponent implements OnInit {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  @ViewChild('nestedInnerChildContentToTablesData') innerChildJsonDataContent!: ElementRef;
  @ViewChild('nestedInnerChildContent') nestedInnerChildContent!: ElementRef;
  @ViewChild('childTableViewContent') childTableViewContent!: ElementRef;
  @ViewChild('plushMinusIconElement') plushMinusIconElement!: ElementRef;
  @ViewChild('useThisArrayFocusOn') useThisArrayFocusOn!: ElementRef;
  @ViewChild('fieldsSelectedPathSection') fieldsSelectedPathSection!: ElementRef;
  @Input() apiBasedUrl = "";  
  @Input() APITestingUrl = ""; 
  @Input() isEditMode: boolean = false;
  @Input() multiArrayPath:boolean = false;
  @Input() singleOrMultiVal:any;
  @Input() isRestApiEnable:any;
  collectParams:any;
  @Output() showloader = new EventEmitter<any>();
  rowDataArry:any = [];
  headerArry:any = [];
  myFilter:any ="";
  hideArrayStructure:boolean = false;
   myContext:any = [];  
  generatedSampleJson: any;
  objectKeys = Object.keys;
  innerChildEnable: any;
  showChildDivFlag: boolean = false;
  keyValueObjArry: any = [];
  expandedValFor: any;
  checkIfObjectArry: any = [];
  showPlus:any;
  fillNewData: any = {};
  appendChildHtml: any = [];
  childViewContent: any;
  expandedObjs: any;
  previousExpandedObj: any;
  pathForExpanded: any = [];
  selectedCheckedInput: any = [];
  plusIconEnabled: boolean = true;
  indexOfPlusIcon: any;
  pathofCurrentArrayObj: any;
  parentPath: any;
  parentPathofMainObjectSelected: any= {};
  expandedPathEachLevelArry: any = [];
  expandedPathForEachExpandObj:any = {}
  usedArrayPathSelected: any = "";
  keyValuePairSavedObj:any = {};
  headerInfoObj: any = {};
  usedArraySelected: boolean = false;
  useThisArraySelectedName: any;
  hasPropertyInUsedArray: any = [];
  useThisArrayNested: any = [];
  showAccordionPanelgrid:boolean = true;
  accordPanelGridOnOff:number = 1;
  showAccordionPanelTable: boolean = false;
  accordPanelTableOnOff: number = 1;
  defaultMsgForTableView:boolean = true;
  indexPathOfSelectedJson:any = {};
  appendinnerChildHtml: any = [];
  responseDatalength: number = 0;
  arrayElement:string = "0";  
  selectedElementFromJson: any;
  JsonStringify:any = JSON.stringify;
  childIndex:any = 'child';
  parentIndex:any = 'parent'
  uuidOnload: string = "";
  pathofExpandedItemJson: any = [];
  expandedValForTempSave: any;
  useArrayJsonOnloadEnabled: boolean = false;
  arrayElementPathSelectedObj: any;
  uuidCount: number = 0;
  newUuidOnload: string = "";
  simplyfiedGeneratedSampleJson: any;
  fromHtmlTemplate:any = 'fromHtmlTemplate'
  clickFromInput: boolean = false;
  selectedArrayPathIndexPosition: any;
  collectionOfSelectedFields: any = {};
  useArrayBtnClicked: boolean = false;
  showAddFieldsManualPopup: boolean = false;
  manualFieldNameAdded: any = "";
  fieldManualAddedCount: any = 0;
  constructor(public bsModalRef: BsModalRef,private shareService:SharedataService,private httpService:HttpService,private translate: TranslateService,
    private cd:ChangeDetectorRef, private ngZone:NgZone
   ) {
    this.headerArry = [this.translate.instant('apiPersonalization.nameApiLbl'),this.translate.instant('apiPersonalization.pathApiLbl'), this.translate.instant('apiPersonalization.actionApiLbl')]
   }
  
//    @HostListener("window:message",["$event"]) 
//    onPostMessage($event) {  
//       if($event.data !== undefined){
//         let dataSplit = $event.data.split(',');
//         if(dataSplit !== undefined){
//           if (dataSplit[0] === 'plus'){
//             console.log('plus');
//             //this.callCopyMethod(dataSplit);
//           }else if(dataSplit[0] === 'minus'){
//             //this.callPreviewMethod(dataSplit);
//           }else if(dataSplit[0] === 'useThisArray'){
//             //this.cancelPopupFragment(dataSplit);
//           }
//         }    
//   }
//   return;
//  }
addManualFieldsMethod(){  
  this.manualFieldNameAdded = "";
  this.showAddFieldsManualPopup = !this.showAddFieldsManualPopup;
}
addFieldsInExistingArrayMethod(){
 if(this.manualFieldNameAdded.trim() === ""){
    Swal.fire({
      title: this.translate.instant('apiPersonalization.attributePathCannotBeEmptyLbl'),
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: true,
      confirmButtonText: this.translate.instant('designEditor.okBtn'),
    });
    return;
 }
 if(this.generatedSampleJson === undefined){
  this.addManualFieldsMethod();
  Swal.fire({
    title: this.translate.instant('apiPersonalization.sampleJsonNotGeneratedErrorLbl'),
    allowEscapeKey: false,
    allowOutsideClick: false,
    showConfirmButton: true,
    confirmButtonText: this.translate.instant('designEditor.okBtn'),
  });
  return;
}
 let splitByDot = this.manualFieldNameAdded.split('.');
 let getFieldName = last(splitByDot);
  this.fieldManualAddedCount++;
  let obj = {
    id:  "manaulField_"+this.fieldManualAddedCount,
  selectedName:getFieldName,
  fieldId:uuidv4(),
  path:this.manualFieldNameAdded,
  type:this.typeOf(this.manualFieldNameAdded),
  fieldIndexParent:null,
  fromPath:this.manualFieldNameAdded,//parentPath,
  fieldVal : this.manualFieldNameAdded,
  fieldKey:''
  } 
  this.rowDataArry.splice(this.rowDataArry.length,0,obj);
  this.showfieldsSectionMethod();
  this.addManualFieldsMethod();
}
  switchAccordPanelMethod(switchType){
    if(switchType == 1){
      this.showAccordionPanelgrid = false;
      this.accordPanelGridOnOff = 0;
    }else{
      this.showAccordionPanelgrid = true;
      this.accordPanelGridOnOff = 1;
      setTimeout(() => {
        this.showSelectedCheckedInput(this.rowDataArry,'','',false);
      }, 1000);
    }
  }
  switchAccordPanelTableMethod(type){
    if(type == 1){      
      this.showAccordionPanelTable = false;
      this.accordPanelTableOnOff = 0;
    }else{
      this.showAccordionPanelTable = true;
      this.accordPanelTableOnOff = 1;
      this.showfieldsSectionMethod();
    }
    
  }
  showfieldsSectionMethod(){
    if(this.rowDataArry.length > 0){
      this.defaultMsgForTableView = false;
      this.showAccordionPanelTable = true;
    }else{
      this.defaultMsgForTableView = true;
      this.showAccordionPanelTable = false;
    }
  }
   expandObjectArrayDataMethod(evt,key,expandForChildData,index,parentExpandedFrom,useArrayEanble,takeArrayIindexEnabled,childIndex,multiArrayElementEnbaled,orginExpand){
   let valObj = this.searchObjectByKey(evt,key,expandForChildData,index,parentExpandedFrom,takeArrayIindexEnabled,childIndex,multiArrayElementEnbaled);
    let arrayOfFristItem;
    let fromHtmlTemplate = evt.target.getAttribute('data-fromHtmlTemplate');
    // let checkAttributeIsPresentInExpanedArry = this.expandedPathForEachExpandObj[parentExpandedFrom].includes(key);
    // if(checkAttributeIsPresentInExpanedArry && this.usedArraySelected){
    //   useArrayEanble = true;
    // }else{
    //   useArrayEanble = false;
    // }
    let filterValueObj;
    let innerValueIsArray:boolean = false;
      if(this.usedArraySelected){
        if(this.useThisArraySelectedName == this.splitIdMethod(key)){
          let checkIftrue = this.checkIfArrayOrObjMethod(valObj);
          
          if(checkIftrue){
            filterValueObj = valObj[0]; 
            if(filterValueObj !== undefined){
              if(typeof(filterValueObj) !=="object"){
                innerValueIsArray  = true; 
              } 
            }
           
           // key = this.splitIdMethod(key);
            key = key+"|0";
            // if(fromHtmlTemplate === "fromHtmlTemplate"){
            //   index = 0;
            //   parentExpandedFrom = this.splitIdMethod(key);
            // }
          }else{
            filterValueObj = valObj;
            innerValueIsArray  = false; 
          }    
        }else{
          filterValueObj = valObj;
          innerValueIsArray  = false
        }         
      }else{
        filterValueObj = valObj;
        innerValueIsArray  = false
      }
      this.expandInnerChildObj(evt,filterValueObj,key,index,parentExpandedFrom,useArrayEanble,childIndex,takeArrayIindexEnabled,multiArrayElementEnbaled,orginExpand,innerValueIsArray);
      setTimeout(() => {
        let filterRowDataArry;
        if(takeArrayIindexEnabled){
          filterRowDataArry = lodash.filter(this.rowDataArry,{'fromPath':parentExpandedFrom});
        }else{
          filterRowDataArry = lodash.filter(this.rowDataArry,{'fromPath':parentExpandedFrom});
        }        
        //filterRowDataArry = lodash.filter(this.rowDataArry,{'fromPath':key)});
        this.showSelectedCheckedInput(this.rowDataArry,key,parentExpandedFrom,takeArrayIindexEnabled);
      }, 1000);
   }
   @HostListener('document:click', ['$event'])
  clickout(event) {
    if (event.target.classList.contains('plusIconClick')) {
      let splitClassNames = event.target.classList[0].split('|');
      let index = splitClassNames[1];
      let childIndex = splitClassNames[3]; 
      let key = event.target.getAttribute('data-expandedName');
      let innerArrayItems = event.target.getAttribute('data-arryLoopIndex');
      let takeIndex;
      let multiArrayElementEnbaled = event.target.classList.contains('multiArrayOfObject');
      let expandForChildData;
      let valObj;
      let orginExpand = event.target.getAttribute('data-originExpand');
      this.useArrayBtnClicked = false;
      if(lodash.startsWith(orginExpand,this.splitArrayFirstItemMethod(key))){
        orginExpand = lodash.merge([orginExpand],[this.splitIdMethod(key)])[0];
      }
      let icon = event.target.className;
      if(icon.includes('fa-plus')){
        let plusIcon =  event.target.className.replace('fa-plus','fa-minus').replace('plusIconClick','minusIconClick');
        event.target.className = plusIcon;
       }
      // let plusIcon =  event.target.className.replace('plusIconClick','minusIconClick');
      // event.target.className = plusIcon;
      if(this.expandedObjs !== undefined){     
        expandForChildData = this.generatedSampleJson;
      }else{
        expandForChildData = this.generatedSampleJson;        
      }
      let sptIndx;
      if(innerArrayItems !== null){
        sptIndx = innerArrayItems.split('|');
        if(sptIndx[2] === undefined){
          takeIndex = true;
          childIndex = innerArrayItems;
        }else{
          takeIndex = true;
          childIndex = sptIndx[2];
        }
      }else{
        takeIndex = false;
        childIndex = index;
      }
      this.indexOfPlusIcon  = index;
      this.plusIconEnabled = false;
      let parentExpandedFrom;
      
      if(this.multiArrayPath){
        // false mean disabled checkbox
        if(multiArrayElementEnbaled){
          parentExpandedFrom = event.target.getAttribute('data-parentexpandedname');
        }else{
          parentExpandedFrom = event.target.getAttribute('name');
        }        
        //parentExpandedFrom = event.target.getAttribute('data-parentexpandedname');
        if(this.usedArrayPathSelected !== ""){
          let useArrySplit = this.usedArrayPathSelected.split('.');
          let selectedAseArry = lodash.findLast(useArrySplit);
          this.useThisArraySelectedName = selectedAseArry;
          if(this.useArrayJsonOnloadEnabled){ // on load array items are used, so use button and useArraypath set a response by default.
            this.useThisArraySelectedName = key;
            this.expandObjectArrayDataMethod(event,key,expandForChildData,index,parentExpandedFrom,true,takeIndex,childIndex,multiArrayElementEnbaled,orginExpand);
          }else{
            let arrayElemtpathInput = useArrySplit;
            arrayElemtpathInput.splice(0,1);
            let isObjWithinUsedArray:any = this.filterPathFromSelectedInputMethod(event,parentExpandedFrom,index,key,expandForChildData);
            let findLastElemt = lodash.findLast(isObjWithinUsedArray);
            let splitFindLastElemt;
            if(findLastElemt !== undefined){
              splitFindLastElemt = findLastElemt.split('[');
            }                      
           // if(Array.isArray(this.arrayElementPathSelectedObj))
            //isObjWithinUsedArray.splice(lodash.findLastIndex(isObjWithinUsedArray),1,splitFindLastElemt[0]);
           
            if(multiArrayElementEnbaled){
              let getParentElementId = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('name');
              let splitParentId = getParentElementId.split('|');
              let combinSplitId = this.splitIdMethod(getParentElementId);
             let presentOrNotObj;             
             if(selectedAseArry == this.splitIdMethod(key)){
              let selObj = this.makeArrayValObjMethod(event,parentExpandedFrom,key,index,index,childIndex,multiArrayElementEnbaled);
              if(Array.isArray(selObj)){
                this.arrayElementPathSelectedObj = selObj[0];
                this.pathofCurrentArrayObj = selObj[0];
                //presentOrNotObj = true;
              }
              let checkIndexParent = parentExpandedFrom.split('|');
              let matchIfSame:any;
              if(checkIndexParent !== undefined){
                let caseCheck = checkIndexParent[1];
                if(caseCheck !== undefined){
                  matchIfSame = checkIndexParent[0]+'['+checkIndexParent[1]+']';
                }
              }
              if(selectedAseArry == this.splitIdMethod(key)){
                // if(this.selectedArrayPathIndexPosition === undefined){
                //   let positionInx = event.target.getAttribute('data-arryLoopIndex').split("|");
                //   this.selectedArrayPathIndexPosition = positionInx[0]+'_'+positionInx[2];
                //   if(this.selectedArrayPathIndexPosition == index+'_'+childIndex){
                //     presentOrNotObj = true;
                //   }else{
                //     presentOrNotObj = false;
                //   }
                // }else{
                //   if(this.selectedArrayPathIndexPosition == index+'_'+childIndex){
                //     presentOrNotObj = true;
                //   }else{
                //     presentOrNotObj = false;
                //   }
                // }
                let itratePath = this.usedArrayPathSelected.split('.').slice(0,this.usedArrayPathSelected.split('.').length - 1).join('.');
                let parentElemId = event.target.parentElement.getAttribute("data-multipleArrayIndex");               
                let xfilter = this.getJsonFromGeneratedJsonMethod(itratePath); 
                let evtPathelement = 'response.'+event.target.getAttribute("data-uniquepathid");
                let flag = this.checkIfPropertyPresentinObjMethod(xfilter,this.splitArrayFirstItemMethod(key));
                if(flag){
                  if(this.usedArrayPathSelected.includes(this.splitIdMethod(parentElemId))){
                    if(this.usedArrayPathSelected === evtPathelement){
                      presentOrNotObj = true;
                    }else{
                      presentOrNotObj = false;
                    }
                    
                  }else{
                    presentOrNotObj = false;
                  }                  
                }else{
                  presentOrNotObj = false;
                }
              }              
              else if(matchIfSame !== undefined){
                let useArrElCheck = this.usedArrayPathSelected.split('.').join('.');
                if(useArrElCheck !== undefined){
                  let filterX = this.getJsonFromGeneratedJsonMethod(this.usedArrayPathSelected);                  
                  //let finalCheck = filterX.indexOf(matchIfSame);
                  let campareFrist = this.splitIdMethod(event.target.getAttribute('data-parentexpandedname'));
                  if(useArrElCheck.includes(matchIfSame)){
                    
                    if(lodash.findLast(this.usedArrayPathSelected.split('.')) === matchIfSame){
                      if(this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key))){
                        presentOrNotObj = true;
                      }else{
                        presentOrNotObj = false;
                      }
                    }else{
                      if(lodash.findLast(this.usedArrayPathSelected.split('.')) === this.splitArrayFirstItemMethod(key)){
                        presentOrNotObj = this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key));
                      }else{
                        presentOrNotObj = false;       
                      }
                    }
                    
                  }else if(campareFrist === this.usedArrayPathSelected.split('.')[1]){
                    if(this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key))){
                      presentOrNotObj = true;
                    }else{
                      presentOrNotObj = false;
                    }
                  }else{
                     presentOrNotObj = this.findPropertyInObjMethod(this.arrayElementPathSelectedObj,this.splitArrayFirstItemMethod(key));
                  } 
                  
                                                 
                }
              }else{
                presentOrNotObj = true;
              }             

            } else if(this.usedArrayPathSelected.split('.').includes(combinSplitId)){
              let xamp = this.getJsonFromGeneratedJsonMethod(this.usedArrayPathSelected);
              presentOrNotObj = this.checkIfPropertyPresentinObjMethod(xamp,this.splitArrayFirstItemMethod(key));
              
             }else{
              // if(selectedAseArry == splitFindLastElemt[0]){
              //   presentOrNotObj = true;
              // }else{
              //   if(this.parentPathofMainObjectSelected[selectedAseArry+'[0]'] !== undefined){
              //     if(this.parentPathofMainObjectSelected[selectedAseArry+'[0]'].hasOwnProperty(sptIndx[1])){
              //       presentOrNotObj = true;
              //     }else{
              //       if(this.parentPathofMainObjectSelected[combinSplitId].hasOwnProperty(sptIndx[1])){
              //         presentOrNotObj = true;
              //       }else{
              //         if(lodash.findKey(this.parentPathofMainObjectSelected[combinSplitId],sptIndx[1])){
              //           presentOrNotObj = true;
              //         }else{
              //           presentOrNotObj = false;
              //         }
                      
              //       }                  
              //     }
              //   }else{
              //     let findInxFromParent = useArrySplit.findIndex(x => x == findLastElemt);
              //     if(findInxFromParent != -1){
              //       presentOrNotObj = true;
              //     }else{
              //       presentOrNotObj = false;
              //     }
                  
              //   }
                
                
              // }  
              
              let checkIndexParent = parentExpandedFrom.split('|');
              let matchIfSame:any;
              if(checkIndexParent !== undefined){
                let caseCheck = checkIndexParent[1];
                if(caseCheck !== undefined){
                  matchIfSame = checkIndexParent[0]+'['+checkIndexParent[1]+']';
                }
              }
              if(matchIfSame !== undefined){
                let useArrElCheck = this.usedArrayPathSelected.split('.').join('.');
                
                if(useArrElCheck !== undefined){
                  let initialZero = this.usedArrayPathSelected.split('.')[1].split('[');
                  let useValAfter:any;
                  if(initialZero[1] === undefined){
                    useValAfter = initialZero[0]+'[0]';
                  }else{
                  useValAfter = this.usedArrayPathSelected.split('.')[1];
                  }
                  let filterX = this.getJsonFromGeneratedJsonMethod(this.usedArrayPathSelected);
                  //let finalCheck = filterX.indexOf(matchIfSame);
                  let campareFrist = this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key));// this.splitIdMethod(event.target.getAttribute('data-parentexpandedname'));
                  if(useArrElCheck.includes(matchIfSame)){
                    if(lodash.findLast(this.usedArrayPathSelected.split('.')) === matchIfSame){
                      if(this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key))){
                        presentOrNotObj = true;
                      }else{
                        presentOrNotObj = false;
                      }
                    }else{
                      if(lodash.findLast(this.usedArrayPathSelected.split('.')) === this.splitArrayFirstItemMethod(key)){
                        presentOrNotObj = this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key));
                      }else{
                        presentOrNotObj = false;       
                      }
                      
                    }
                    
                    
                  }
                  else if(campareFrist){

                    let flag = this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key));
                    // if(flag){
                    //   // if(this.usedArrayPathSelected.includes(this.splitIdMethod(pindex))){
                    //   //   presentOrNotObj = true;
                    //   // }else{
                    //   //   presentOrNotObj = false;
                    //   // }
                    //   presentOrNotObj = flag;
                    // }else{
                    //   presentOrNotObj = false;
                    // }
                    if(flag){
                      presentOrNotObj = true;
                    }else{
                      presentOrNotObj = false;
                    }
                    // if(this.usedArrayPathSelected.includes(this.splitArrayFirstItemMethod(key))){
                    //   presentOrNotObj = this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key));
                    // }else{
                    //   presentOrNotObj = false;
                    // }
                    
                  }else{
                    if(lodash.includes(this.usedArrayPathSelected.split('.'),this.splitIdMethod(key))){
                      presentOrNotObj = this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key));
                    }else{
                      presentOrNotObj = false;
                    }
                     
                  } 
                  
                                                 
                }
              }else{
                presentOrNotObj = this.findPropertyInObjMethod(this.arrayElementPathSelectedObj,sptIndx[1]);
              }    
              
              //presentOrNotObj = this.findPropertyInObjMethod(this.arrayElementPathSelectedObj,sptIndx[1]);
             }
              if(presentOrNotObj){
                  this.expandObjectArrayDataMethod(event,key,expandForChildData,index,parentExpandedFrom,true,takeIndex,childIndex,multiArrayElementEnbaled,orginExpand);
                }else{
                  this.expandObjectArrayDataMethod(event,key,expandForChildData,index,parentExpandedFrom,false,takeIndex,childIndex,multiArrayElementEnbaled,orginExpand);
                }
            }else{
              // let  findObjLastSelected= selectedAseArry+'[0]';
              // let findUsedArrayLastSelectObj = this.parentPathofMainObjectSelected[findObjLastSelected];
              // if(Array.isArray(findUsedArrayLastSelectObj)){
              //   let presentOrNotObj = findUsedArrayLastSelectObj[0].hasOwnProperty(sptIndx[1]);
              //   if(presentOrNotObj){
              //     this.expandObjectArrayDataMethod(event,key,expandForChildData,index,parentExpandedFrom,true,takeIndex,childIndex,multiArrayElementEnbaled);
              //   }else{
              //     this.expandObjectArrayDataMethod(event,key,expandForChildData,index,parentExpandedFrom,false,takeIndex,childIndex,multiArrayElementEnbaled);
              //   }
              // }else{
              //   let presentOrNotObj = findUsedArrayLastSelectObj.hasOwnProperty(sptIndx[1]);
              //   if(presentOrNotObj){
              //     this.expandObjectArrayDataMethod(event,key,expandForChildData,index,parentExpandedFrom,true,takeIndex,childIndex,multiArrayElementEnbaled);
              //   }else{
              //     this.expandObjectArrayDataMethod(event,key,expandForChildData,index,parentExpandedFrom,false,takeIndex,childIndex,multiArrayElementEnbaled);
              //   }
              // }

              // let presentOrNotObj;
              // if(this.pathofCurrentArrayObj.hasOwnProperty(sptIndx[1])){
              //   presentOrNotObj = true;
              //  }else{
              //   presentOrNotObj = false;
              //  }
              let presentOrNotObj;
              if(selectedAseArry == this.splitIdMethod(key)){
                let selObj = this.makeArrayValObjMethod(event,parentExpandedFrom,key,index,index,childIndex,multiArrayElementEnbaled);
                if(Array.isArray(selObj)){
                  this.arrayElementPathSelectedObj = selObj[0];
                  this.pathofCurrentArrayObj = selObj[0];
                }
                
                let checkIndexParent = parentExpandedFrom.split('|');
              let matchIfSame:any;
              if(checkIndexParent !== undefined){
                let caseCheck = checkIndexParent[1];
                if(caseCheck !== undefined){
                  matchIfSame = checkIndexParent[0]+'['+checkIndexParent[1]+']';
                }
              }
              if(matchIfSame !== undefined){
                let useArrElCheck = this.usedArrayPathSelected.split('.').join('.');
                let inPathitsPresent = this.usedArrayPathSelected.split('.');
                if(useArrElCheck !== undefined){
                  let filterX = this.getJsonFromGeneratedJsonMethod(this.usedArrayPathSelected);                  
                  let campareFrist = this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key));//this.splitIdMethod(event.target.getAttribute('data-parentexpandedname'));
                  if(!(inPathitsPresent[1] === orginExpand)){                   
                    presentOrNotObj = false;                      
                  }else if(useArrElCheck.includes(matchIfSame)){                    
                    if(inPathitsPresent[1] === orginExpand){
                      presentOrNotObj = true;
                      // if(this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key))){
                      //   presentOrNotObj = true;
                      // }else{
                      //   presentOrNotObj = false;
                      // }
                    }else{
                      if(lodash.findLast(this.usedArrayPathSelected.split('.')) === this.splitArrayFirstItemMethod(key)){
                        presentOrNotObj = this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key));
                      }else{
                        presentOrNotObj = false;       
                      }
                    }
                    
                  }else if(campareFrist){
                    if(this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key))){
                      presentOrNotObj = true;
                    }else{
                      presentOrNotObj = false;
                    }
                  }else{
                    if(lodash.includes(this.usedArrayPathSelected.split('.'),this.splitIdMethod(key))){
                      let originExpnd = event.target.getAttribute('data-uniquepathid');
                      if(this.usedArrayPathSelected.includes(orginExpand)){
                        let xamp = this.getJsonFromGeneratedJsonMethod(this.usedArrayPathSelected);
                        presentOrNotObj = this.checkIfPropertyPresentinObjMethod(xamp,this.splitArrayFirstItemMethod(key));
                        // if(this.checkIfPropertyPresentinObjMethod(xamp,this.splitArrayFirstItemMethod(key))){
                        //   presentOrNotObj = this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key));
                        // }else{
                        //   presentOrNotObj = false;
                        // }
                      }else{
                        let xamp = this.getJsonFromGeneratedJsonMethod(this.usedArrayPathSelected);
                        presentOrNotObj = this.checkIfPropertyPresentinObjMethod(xamp,this.splitArrayFirstItemMethod(key));
                      }
                      
                    }else{
                      presentOrNotObj = false;
                    }
                  } 
                  
                                                 
                }
              }else{
                if(selectedAseArry == this.splitIdMethod(key)){
                  let inPathitsPresent = this.usedArrayPathSelected.split('.');
                  if(inPathitsPresent[1] === orginExpand){
                    presentOrNotObj = true;
                  }else{
                    presentOrNotObj = false;
                  }
                  
                }else{
                  let xamp = this.getJsonFromGeneratedJsonMethod(this.usedArrayPathSelected);
                  presentOrNotObj = this.checkIfPropertyPresentinObjMethod(xamp,this.splitArrayFirstItemMethod(key)); 
                }
                //let orignExp = event.target.getAttribute('data-originExpand');
                          
                
              } 
                //presentOrNotObj = true;
              }else{ // multiRow not equal
                let checkIndexParent = parentExpandedFrom.split('|');
              let matchIfSame:any;
              if(checkIndexParent !== undefined){
                let caseCheck = checkIndexParent[1];
                if(caseCheck !== undefined){
                  matchIfSame = checkIndexParent[0]+'['+checkIndexParent[1]+']';
                }
              }
              if(matchIfSame !== undefined){
                let useArrElCheck = this.usedArrayPathSelected.split('.').join('.');
                if(useArrElCheck !== undefined){
                  let initialZero = this.usedArrayPathSelected.split('.')[1].split('[');
                  let useValAfter:any;
                  if(initialZero[1] === undefined){
                    useValAfter = initialZero[0]+'[0]';
                  }else{
                  useValAfter = this.usedArrayPathSelected.split('.')[1];
                  }
                  let filterX = this.getJsonFromGeneratedJsonMethod(this.usedArrayPathSelected);                  
                  //let filterX = JSON.stringify(this.arrayElementPathSelectedObj);
                  //let finalCheck = filterX.includes(matchIfSame);
                  let campareFrist = this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key));
                  if(useArrElCheck.includes(matchIfSame)){
                    if(lodash.findLast(this.usedArrayPathSelected.split('.')) === matchIfSame){
                      if(this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key))){
                        presentOrNotObj = true;
                      }else{
                        presentOrNotObj = false;
                      }
                    }else{
                      if(this.usedArrayPathSelected.includes(this.splitArrayFirstItemMethod(key))){
                        let itratePath = this.usedArrayPathSelected.split('.').slice(0,this.usedArrayPathSelected.split('.').length - 1).join('.');
                        let xfilter = this.getJsonFromGeneratedJsonMethod(itratePath);   
                        presentOrNotObj = this.checkIfPropertyPresentinObjMethod(xfilter,this.splitArrayFirstItemMethod(key));
                      }else{
                        if(useArrElCheck.includes(matchIfSame)){
                          presentOrNotObj = this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key)); 
                        }else{
                          presentOrNotObj = false;
                        }
                              
                      }
                    }
                    
                  }else if(campareFrist){                    
                    if(!useArrElCheck.includes(matchIfSame)){
                      let eventpathfrom = event.target.getAttribute('data-uniquepathid').split(".");
                      let indx = eventpathfrom.findIndex(x => x == key);
                      let takeArray = take(eventpathfrom,indx);
                      let withResp = "response."+takeArray.join('.');
                      if(this.usedArrayPathSelected === withResp){
                        if(this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key))){
                          presentOrNotObj = true;
                        }else{
                          presentOrNotObj = false;
                        }   
                      }else{
                        let usedArrayMatchWithEventSelect = withResp.substring(0,this.usedArrayPathSelected.length);
                        if(usedArrayMatchWithEventSelect === this.usedArrayPathSelected){
                          if(this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key))){
                            presentOrNotObj = true;
                          }else{
                            presentOrNotObj = false;
                          }
                        }
                      }
                                          
                    }else{
                      presentOrNotObj = this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key));
                    }
                  }else{
                    if(filterX.includes(this.splitArrayFirstItemMethod(key))){
                      if(useArrElCheck.includes(matchIfSame)){
                        presentOrNotObj = this.checkIfPropertyPresentinObjMethod(filterX,this.splitArrayFirstItemMethod(key));
                      }else{
                        presentOrNotObj = false;
                      }                      
                    }
                  } 
                  
                                                 
                }
              }else{
                // let itratePath = this.usedArrayPathSelected.split('.').slice(0,this.usedArrayPathSelected.split('.').length - 1).join('.');
                let xamp = this.getJsonFromGeneratedJsonMethod(this.usedArrayPathSelected);
                // presentOrNotObj = this.checkIfPropertyPresentinObjMethod(xamp,this.splitArrayFirstItemMethod(key));
                let eventpathfrom = event.target.getAttribute('data-uniquepathid').split(".");
                    let indx = eventpathfrom.findIndex(x => x == key);
                    let takeArray = take(eventpathfrom,indx);
                    let withResp = "response."+takeArray.join('.');
                    if(this.usedArrayPathSelected === withResp){
                      if(this.checkIfPropertyPresentinObjMethod(xamp,this.splitArrayFirstItemMethod(key))){
                        presentOrNotObj = true;
                      }else{
                        presentOrNotObj = false;
                      }   
                    }else{                      
                      let usedArrayMatchWithEventSelect = withResp.substring(0,this.usedArrayPathSelected.length);
                      if(usedArrayMatchWithEventSelect === this.usedArrayPathSelected){
                        if(this.checkIfPropertyPresentinObjMethod(xamp,this.splitArrayFirstItemMethod(key))){
                          presentOrNotObj = true;
                        }else{
                          presentOrNotObj = false;
                        }
                      }
                    }
              } 
                //presentOrNotObj = this.findPropertyInObjMethod(this.arrayElementPathSelectedObj,key);
              }

            //   let findKeyObj:any = lodash.findKey(this.parentPathofMainObjectSelected,selectedAseArry);
            // let filterObj = this.parentPathofMainObjectSelected[findKeyObj];
            // let presentOrNotObj = filterObj.hasOwnProperty(splitFindLastElemt);
              if(presentOrNotObj){
                this.expandObjectArrayDataMethod(event,key,expandForChildData,index,parentExpandedFrom,true,takeIndex,childIndex,multiArrayElementEnbaled,orginExpand);
              }else{
                this.expandObjectArrayDataMethod(event,key,expandForChildData,index,parentExpandedFrom,false,takeIndex,childIndex,multiArrayElementEnbaled,orginExpand);
              }
              // let isObjWithinUsedArray = this.filterPathFromSelectedInputMethod(event,parentExpandedFrom,index,key,expandForChildData);
              // if(isObjWithinUsedArray.length > 0){
              //   this.expandObjectArrayDataMethod(event,key,expandForChildData,index,parentExpandedFrom,true,takeIndex,childIndex,multiArrayElementEnbaled);
              // }else{
              //   this.expandObjectArrayDataMethod(event,key,expandForChildData,index,parentExpandedFrom,false,takeIndex,childIndex,multiArrayElementEnbaled);
              // }                      
            }    
          }
            
        }else{
          this.expandObjectArrayDataMethod(event,key,expandForChildData,index,parentExpandedFrom,false,takeIndex,childIndex,multiArrayElementEnbaled,orginExpand);
        }
        
      }else{
        //true means enable checkbox
        parentExpandedFrom = event.target.getAttribute('name');
        this.expandObjectArrayDataMethod(event,key,expandForChildData,index,parentExpandedFrom,true,takeIndex,childIndex,multiArrayElementEnbaled,orginExpand);
      } 
      
    }else if(event.target.classList.contains('minusIconClick')){
      let splitClassNames = event.target.classList[0].split('|');
      let index = splitClassNames[1];
      let key = event.target.getAttribute('data-expandedName');      
      this.indexOfPlusIcon  = index;
      this.plusIconEnabled = true; // show minus icon
      let parentExpandedFrom = event.target.getAttribute('name');     
      let icon = event.target.className;
      if(icon.includes('fa-minus')){
      let plusIcon =  event.target.className.replace('minus','plus').replace('minusIconClick','plusIconClick');      
      event.target.className = plusIcon;
      }
      let collapseEle = this.innerChildJsonDataContent.nativeElement;
      let isFirstLevel = collapseEle.getAttribute('id');
      let innerArrayItems = event.target.getAttribute('data-arryLoopIndex');
      let takeIndex,childIndex;
      let multiArrayElementEnbaled = event.target.classList.contains('multiArrayOfObject');
      let sptIndx;
      let hideContentUuid = event.target.getAttribute('data-uuid');
      this.useArrayBtnClicked = false;
      if(innerArrayItems !== null){
        sptIndx = innerArrayItems.split('|');
        if(sptIndx[2] === undefined){
          takeIndex = true;
          childIndex = innerArrayItems;
        }else{
          takeIndex = true;
          childIndex = sptIndx[2];
        }
      }else{
        takeIndex = false;
        childIndex = index;
      }
      // if(takeIndex){
      //   if(collapseEle.getElementsByClassName('childTableView_'+index+'_'+key+'_'+parentExpandedFrom)[0] === undefined){
      //     if(isFirstLevel === 'levelOneChildView'){
      //       collapseEle.innerHTML = "";
      //     }
      //   }
      // }else{
      //   let currEle = collapseEle.getElementsByClassName('childTableView_'+index+'_'+key)[0];
      //   currEle.innerHTML = "";
      // }
      let iconEleuuid = event.target.getAttribute('data-uuid');
      let arrayelements;
      if(multiArrayElementEnbaled){
        //arrayelements = collapseEle.querySelectorAll('.childTableView|'+index+'|'+key+'|'+childIndex);
        //arrayelements = collapseEle.getElementsByClassName('childTableView|'+index+'|'+key);
        arrayelements = collapseEle.getElementsByClassName('childView|'+hideContentUuid);
      }else{
        //arrayelements = collapseEle.querySelectorAll('.childTableView|'+index+'|'+key+'|'+childIndex);
        //arrayelements = collapseEle.getElementsByClassName('childTableView|'+index+'|'+key+'|'+childIndex);
        arrayelements = collapseEle.getElementsByClassName('childView|'+hideContentUuid);
      }
      
      let hideContentElement = this.checkForMultipleOccurrenceMethod(iconEleuuid,arrayelements,index,key,childIndex);
      if(hideContentElement !== undefined){
        hideContentElement.innerHTML = "";
      }
      // if(collapseEle.getElementsByClassName('childTableView_'+index+'_'+key+'_'+childIndex)[0] === undefined){
      //   if(isFirstLevel === 'levelOneChildView_'+key){
      //     collapseEle.innerHTML = "";
      //   }else{
      //     collapseEle.innerHTML = "";
      //   }
      // }else{
      //   let currEle = collapseEle.getElementsByClassName('childTableView_'+index+'_'+key+'_'+childIndex)[0];
      //   currEle.innerHTML = "";
      // }
      let keyCombine;
      if(sptIndx !== undefined){
        if(sptIndx[2] !== undefined){
          keyCombine = sptIndx[1]+'['+sptIndx[2]+']';
        }else{
         keyCombine = sptIndx[1];
        }
      }     
       
      delete this.parentPathofMainObjectSelected[keyCombine];
    }else if(event.target.classList.contains('useArrayBtn')){
      let splitClassNames = event.target.classList[0].split('|');
      let parentClassName = event.target.classList[0];//.replaceAll('|','_');
      let parentElePlusIcon = event.target.parentElement.getElementsByClassName(parentClassName)[0];
      this.useArrayBtnClicked = true;
      if(parentElePlusIcon !== undefined){
        parentElePlusIcon.className = parentElePlusIcon.className.replace('fa-plus','fa-minus').replace('plusIconClick','minusIconClick');;
      }      
      let index = splitClassNames[1];
      let key = splitClassNames[2];
      let entryIndex = splitClassNames[3];
      let parentExpandedFrom = event.target.getAttribute('name');
      let orginExpand = event.target.getAttribute('data-originExpand');
      let innerArrayItems = event.target.getAttribute('data-arryLoopIndex');
      let takeIndex,childIndex;
      let checkboxEle = this.innerChildJsonDataContent.nativeElement.getElementsByClassName('checkInput');
      let multiArrayElementEnbaled = event.target.classList.contains('multiArrayOfObject');
      this.usedArraySelected = true;
      this.clickFromInput = false;
      let splitParentId = parentExpandedFrom.split('|');
      let parentExpandedSplitId = "";
      this.selectedArrayPathIndexPosition = index+'_'+entryIndex;
      if(splitParentId[1] !== undefined){
        parentExpandedSplitId = splitParentId[0]+'['+splitParentId[1]+']';
        if(lodash.startsWith(orginExpand,this.splitArrayFirstItemMethod(parentExpandedFrom))){
          if(this.usedArraySelected && this.multiArrayPath){
            orginExpand = this.splitIdMethod(parentExpandedFrom);
          }else{
            orginExpand = lodash.merge([orginExpand],[this.splitIdMethod(parentExpandedFrom)])[0];
          }
          
        }
      }
      // else{
      //   parentExpandedSplitId = splitParentId[0];
      // }
      lodash.map(checkboxEle,this.disableAllCheckboxForMultiObjectMethod);
      this.rowDataArry = [];
      
      this.useThisArraySelectedName = key;
      if(innerArrayItems !== null){
        let sptIndx = innerArrayItems.split('|');
        if(sptIndx[2] === undefined){
          takeIndex = true;
          childIndex = innerArrayItems;
        }else{
          takeIndex = true;
          childIndex = sptIndx[2];
        }
        
      }else{
        takeIndex = false;
        childIndex = index;
      }
      this.expandObjectArrayDataMethod(event,key,this.generatedSampleJson,index,parentExpandedFrom,true,takeIndex,childIndex,multiArrayElementEnbaled,orginExpand);
      let valObj = this.searchObjectByKey(event,key,this.generatedSampleJson,index,parentExpandedFrom,takeIndex,childIndex,multiArrayElementEnbaled);
      let filterPath:any = this.filterPathFromSelectedInputMethod(event,parentExpandedFrom,index,key,valObj);
      let fromHtmlTemplate = event.target.getAttribute('data-fromHtmlTemplate');
      if(valObj !== undefined){
        let filterValueObj;
        if(this.usedArraySelected){
          let checkIftrue = this.checkIfArrayOrObjMethod(valObj);
          if(checkIftrue){
            filterValueObj = valObj[0];
            // if(fromHtmlTemplate === "fromHtmlTemplate"){
            //   index = 0;
            //   parentExpandedFrom = key+'|'+index;
            // }
            //key = key+'|'+childIndex;
          }else{
            filterValueObj = valObj;
          }       
        }else{
          filterValueObj = valObj;
        }
        this.arrayElementPathSelectedObj = filterValueObj;
      }
      let finalPullArry = filterPath;
      
      //let concatChild;
      // if(Array.isArray(valObj)){
      //   //finalPullArry = finalPullArry.splice(finalPullArry.length-1,1,key);
      //   concatChild = [key];
      // }else{
      //   concatChild = finalPullArry.concat(key);
      // }
      //finalPullArry.splice(finalPullArry.length-1,1,key);
      //let concatChild;
      // if(this.usedArraySelected){
      //   concatChild = finalPullArry.concat(key);  
      // }else{
      //   concatChild = [key];    
      // }

      // if(this.usedArraySelected){
      //   let x = lodash.unionBy(finalPullArry,parentExpandedSplitId,parentExpandedSplitId);
      //   let indxfilt = lodash.indexOf(finalPullArry,x[0]);
      //   let xValSplit = x[0].split('[');
      //   if(xValSplit[1] === undefined){
      //     finalPullArry[indxfilt] = x[0];
      //   }else{
      //     finalPullArry[indxfilt] = parentExpandedSplitId;
      //   }
        
      // }
      let concatChild:any;
      if(lodash.startsWith(finalPullArry.toString(),parentExpandedFrom)){
        if(fromHtmlTemplate === "fromHtmlTemplate"){
          let newVal = this.splitIdMethod(key);
          // let splinewVal = newVal.split('')
          // if(newVal[1] === undefined){
          //   newVal = newVal+'[0]';
          // }
          concatChild = [newVal];
        }else{
          concatChild = finalPullArry;
          let newKey;
            if(this.multiArrayPath){
              if(key.split('|')[1] === undefined){
                newKey = key;
                if(finalPullArry.includes(key)){
                  let inx = finalPullArry.indexOf(key);
                  finalPullArry.splice(inx,1,newKey);
                  concatChild = finalPullArry;
                }else{
                  concatChild = finalPullArry;
                }
              }
            }else{
              //newKey = key;
              concatChild = finalPullArry;
            }  
        }
        
      }else{
        let newKey;
        if(this.multiArrayPath){
          if(key.split('|')[1] === undefined){
            newKey = key;
            if(finalPullArry.includes(key)){
              let inx = finalPullArry.indexOf(key);
              finalPullArry.splice(inx,1,newKey);
              concatChild = finalPullArry;
            }else{
              concatChild = finalPullArry.concat(newKey);
            }
          }
        }else{
          newKey = key;
          concatChild = finalPullArry.concat(newKey);
        }        
        
      }
      
      let uniqSortedPath = lodash.uniq(concatChild);      
      let pathSelectJson = "response."+uniqSortedPath.join('.');
      let uniquePathFromUseArrayBtn = "response."+event.target.getAttribute('data-uniquepathid');
      // if(Object.keys(this.indexPathOfSelectedJson).length > 0){
      //   Object.keys(this.indexPathOfSelectedJson).forEach((item,i) => {
      //     if(pathSelectJson.includes(item)){
      //       pathSelectJson = pathSelectJson.replace(item,item+'['+this.indexPathOfSelectedJson[item]+']');
      //     }               
      //   });            
      // }  
      this.usedArrayPathSelected = uniquePathFromUseArrayBtn;//pathSelectJson;      
      this.useThisArrayFocusOn.nativeElement.focus();
    }
    this.selectPathFromJson(event);
  }
  
  findPropertyInObjMethod(useArrayObj,selectedArryName){
    let flag = false;let filterObj;let rsObj;   
    if(useArrayObj !== undefined){
      let objString = JSON.stringify(useArrayObj);
      if(objString.indexOf(selectedArryName) > -1){
        rsObj = true;
      }else{
        rsObj = false;
      }
    }else{
      rsObj = false;
    }    
    //rsObj = this.filterPropertyFromObjMethod(useArrayObj,selectedArryName);
    if(rsObj){
      flag = true;
    }else{
      flag = false;
    }
    return flag;
    
  }
  checkIfPropertyPresentinObjMethod(useArrayObj,selectedArryName){
    let flag = false;let filterObj;let rsObj;   
    if(useArrayObj !== undefined){
      let objString = useArrayObj;
      if(objString.indexOf(selectedArryName) > -1){
        rsObj = true;
      }else{
        rsObj = false;
      }
    }else{
      rsObj = false;
    }    
    return rsObj;
    
  }
  checkIfPropertiesPresentInUsedArrayMethod(useArryPath,selectedArrt){
    let flag = false;let filterObj;let rsObj;
     if(this.parentPathofMainObjectSelected[this.useThisArraySelectedName] !== undefined){
    //   filterObj = lodash.findKey(this.parentPathofMainObjectSelected,selectedArrt);
    //   rsObj = this.parentPathofMainObjectSelected[filterObj].hasOwnProperty(selectedArrt);
       
    // }else{
    //   filterObj = lodash.findKey(this.parentPathofMainObjectSelected,selectedArrt);
    //   rsObj = this.parentPathofMainObjectSelected[filterObj].hasOwnProperty(selectedArrt);

     rsObj = this.parentPathofMainObjectSelected[this.useThisArraySelectedName].hasOwnProperty(selectedArrt);
    }
        
    if(rsObj){
      //this.useThisArrayNested.push(filterObj,selectedArrt);
      flag = true;
    }else{
      flag = false;
    }
    return flag;
    
  }
  disableAllCheckboxForMultiObjectMethod(arrayObj){    
    arrayObj.disabled = true;   
    arrayObj.checked = false; 
  }
  enableAllCheckboxForMultiObjectMethod(arrayObj){    
    arrayObj.disabled = false;    
  }
  checkValueWhatTypeOfMethod(key,val){
    let result:any;
    let typeofvalCheck = typeof(val);
    result = [typeofvalCheck];
    return result;
  }
  selectPathFromJson(event){
    if(event.target.classList.contains('checkInput')){
      let splitClassNames = event.target.className.split('|');
      let index = splitClassNames[1];
      let key = splitClassNames[2]; 
      let value = splitClassNames[3];
      let path = this.pathForExpanded;
      let nameKey = event.target.getAttribute('name');
      if(this.usedArraySelected){
        this.selectedPathMethod(event,key,index,path,value);
      }else{
        this.selectedPathMethod(event,key,index,path,value);
      }
      
    }
  }

searchObjectByKey(evt,nameKey,myArray,indx,parentExpFrom,takeArrayIindexEnabled,childIndex,multiArrayElementEnbaled){
  let valObj:any; 
  
  //Object.keys(myArray).forEach((Key,i) => {
    if(nameKey === 'arrays'){
      nameKey = indx;
    }
   //let isDataPresent = myArray[nameKey];
   if(Object.keys(this.parentPathofMainObjectSelected).length > 0){
    if(this.parentPathofMainObjectSelected[nameKey+'['+childIndex+']'] !== undefined){      
      if(this.parentPathofMainObjectSelected[nameKey+'['+childIndex+']'].hasOwnProperty(nameKey)){
        if(this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom] === undefined){
          this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom] = [];
          this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom] = this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom].concat(nameKey);
        }else{
          this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom] = this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom].concat(nameKey);
        }
        valObj = this.parentObjectSimplification(evt,myArray,parentExpFrom,nameKey,indx,takeArrayIindexEnabled,childIndex,multiArrayElementEnbaled);
        
      }else{
        if(this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom] === undefined){
          this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom] = [];
          this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom] = this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom].concat(nameKey);
        }else{
          this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom] = this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom].concat(nameKey);
        }
        valObj = this.parentObjectSimplification(evt,myArray,parentExpFrom,nameKey,indx,takeArrayIindexEnabled,childIndex,multiArrayElementEnbaled);
      }
    }else{
      if(this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom] === undefined){
        this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom] = [];
        this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom] = this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom].concat(nameKey);
      }else{
        this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom] = this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom].concat(nameKey);
      }
      valObj = this.parentObjectSimplification(evt,myArray,parentExpFrom,nameKey,indx,takeArrayIindexEnabled,childIndex,multiArrayElementEnbaled);
    }  
  }else{
    if(this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom] === undefined){
      this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom] = [];
      this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom] = this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom].concat(nameKey);
    }else{
      this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom] =this.expandedPathForEachExpandObj[nameKey+'|'+parentExpFrom].concat(nameKey);
    }
    
    valObj = this.parentObjectSimplification(evt,myArray,parentExpFrom,nameKey,indx,takeArrayIindexEnabled,childIndex,multiArrayElementEnbaled);
   }
    

  //});



  // if(this.parentPathofMainObjectSelected[nameKey+'_'+indx] == undefined){  
  //   let findObj = lodash.pick(myArray,nameKey);
  //   if(findObj === undefined){
  //     this.parentPathofMainObjectSelected[nameKey+'_'+indx] = myArray[nameKey];
  //   }else if(myArray[nameKey][parentExpFrom] !== undefined){
  //     this.parentPathofMainObjectSelected[nameKey+'_'+indx] = myArray[nameKey][indx];
  //   }else{
  //     this.parentPathofMainObjectSelected[nameKey+'_'+indx] = myArray[nameKey][indx];
  //   }
  // }
  // valObj = this.parentObjectSimplification(evt,myArray,parentExpFrom,nameKey,indx,takeArrayIindexEnabled,childIndex);
  
return valObj;
}
parentObjectSimplification(evt,myArray,parentExpFrom,nameKey,indx,takeArrayIindexEnabled,childIndex,multiArrayElementEnbaled){
  let valObj;
  let resobjct = this.convertArrayElemToObjectMethod(evt,myArray,parentExpFrom,this.pathForExpanded,nameKey,indx,takeArrayIindexEnabled,childIndex,multiArrayElementEnbaled);
      if(Array.isArray(resobjct)){
        valObj = this.filterWithArrayElements(resobjct);
       // valObj =  resobjct[0];// frist array considered.
      }else{
       valObj = resobjct; 
      }
      return valObj;
}
filterWithArrayElements(arrObj){
  let valObj;
  if(Array.isArray(arrObj)){
     valObj =  arrObj;// frist array considered.
    }else if(this.typeOf(arrObj) === 'object'){
     valObj = arrObj; 
    }else{
      valObj = {0:arrObj} //if its is a string or vlaue single column, Make it as object
    }
    return valObj;
}
checkIfArrayOrObjMethod(jsonData){
  let flag = false;
  if(Array.isArray(jsonData)){
    this.responseDatalength = jsonData.length;
    flag = true;
  }else{
    flag = false;
  }
  return flag;
}
fetchObjectDataMethod(jsonObj){
  let responseObj:any;  
  let Xarray:any = [];
  let isResArray:any;
  if(jsonObj !== undefined){
    if(Array.isArray(jsonObj)){
      if(this.multiArrayPath){
        responseObj = jsonObj.slice(0,1); // first Element
      }else{
        responseObj = jsonObj;
      }
      
      //isResArray = jsonObj;
      for(let i=0; i < responseObj.length; i++){
        let obj:any = {};
        obj['key'] = i;
        obj['value'] = jsonObj[i];
        obj['uuid'] = uuidv4();
        Xarray.push(obj);
      }
    }else if(this.typeOf(jsonObj) === 'object'){
      responseObj = Object.keys(jsonObj);
      //isResArray = jsonObj;
      for(let i=0; i < responseObj.length; i++){
        let obj:any = {};
        obj['key'] = responseObj[i];
        obj['value'] = jsonObj[responseObj[i]];
        obj['uuid'] = uuidv4();
        Xarray.push(obj);
      }
    }
    
  }  
  return Xarray;
}
getIndexFromArrayPath(path,str){
  let inx = path.indexOf(str);
  let lengStr = str.length;
  let filterX = path.substr(inx+lengStr,3);
  let resultX = filterX.charAt(1);
  return resultX; 
}
getStrIndexFromArrayPath(path,str){
  let inx = path.indexOf(str);
  let lengStr = str.length;
  let filterX = path.substr(inx+lengStr,3);
  let fullX = str+filterX;
  return fullX; 
}
convertArrayElemToObjectMethod(evt,arrayObj,parentExpIndx,selectedPathArry,currtExpand,indx,takeArrayIindexEnabled,childIndex,multiArrayElementEnbaled){
  //this.pathofCurrentArrayObj;
  // selectedPathArry.forEach((element,i) => {
  //   this.pathofCurrentArrayObj = this.pathofCurrentArrayObj[element];   

  // });
  let resultObj;
  let findCurrObj:any = this.makeArrayValObjMethod(evt,arrayObj,currtExpand,parentExpIndx,indx,childIndex,multiArrayElementEnbaled);
  if(takeArrayIindexEnabled){    
    resultObj = findCurrObj;
    //this.parentPathofMainObjectSelected[currtExpand] = resultObj;
  //   if(Array.isArray(findCurrObj[currtExpand])){
  //     if(findCurrObj[currtExpand][childIndex] !== undefined){
  //       resultObj = findCurrObj[currtExpand][childIndex];
  //       let objchildIxdex = {};
  //       objchildIxdex[childIndex] = resultObj;
  //       this.parentPathofMainObjectSelected[currtExpand] = objchildIxdex;
  //     }
  //   }else{ // is object
  //     resultObj = findCurrObj[currtExpand];
      if(Array.isArray(resultObj)){
        let splitCurrId =  currtExpand.split('|');
        let newCurrId;
        let indexSaved = this.getIndexFromArrayPath(this.usedArrayPathSelected,currtExpand);
        if(splitCurrId[1] === undefined){
          newCurrId = currtExpand+'[0]';
        }else{
          newCurrId = currtExpand+'['+childIndex+']';
         // newCurrId = currtExpand+'[0]';
          // if(indexSaved == "" || indexSaved === undefined){
          //   indexSaved = "0";
          // }           
        }
        this.parentPathofMainObjectSelected[newCurrId] = resultObj[0];
        if(this.usedArrayPathSelected.includes(newCurrId)){
          this.pathofCurrentArrayObj = resultObj;
        }else{
          this.pathofCurrentArrayObj = resultObj;
        }
      }else{
        let idCurrt = currtExpand.split('|');
        let newID;
        if(idCurrt[1] !== undefined){
          newID = [idCurrt[0]+'['+idCurrt[1]+']'];
        }else{
          newID = idCurrt[0];
        }
        this.parentPathofMainObjectSelected[newID] = resultObj;
        this.pathofCurrentArrayObj = resultObj;
      }
      
    } 
      
  else{
      // let findCurrObj:any = lodash.pick(arrayObj,currtExpand);
      // if(Array.isArray(findCurrObj[currtExpand])){
      //     resultObj = findCurrObj[currtExpand];
      //   }else{
      //     resultObj = findCurrObj[currtExpand];
      //   }
      // if(findCurrObj[currtExpand][childIndex] !== undefined){
      //   resultObj = findCurrObj[currtExpand][childIndex];
      // }else{
      //   resultObj = findCurrObj[currtExpand];
      // }    
      resultObj = findCurrObj;
      let newCurrId;
      if(Array.isArray(resultObj)){
        let splitCurrId =  currtExpand.split('|');  
        let indexSaved = this.getIndexFromArrayPath(this.usedArrayPathSelected,currtExpand);      
        if(splitCurrId[1] === undefined){
          newCurrId = currtExpand+'[0]';
        }else{
          newCurrId = currtExpand+'['+childIndex+']';
          //newCurrId = currtExpand+'[0]';
          // if(indexSaved == "" || indexSaved === undefined){
          //   indexSaved = "0";
          // }  
        }
        this.parentPathofMainObjectSelected[newCurrId] = resultObj[0];
        if(this.typeOf(resultObj) === 'number' || this.typeOf(resultObj) === undefined || this.typeOf(resultObj) === null){
          this.pathofCurrentArrayObj = resultObj;
        }else{          
          if(this.usedArrayPathSelected.includes(newCurrId)){
            this.pathofCurrentArrayObj = resultObj;
          }else{
            this.pathofCurrentArrayObj = resultObj;
          }
        }
      }else{
        let idCurrt = currtExpand.split('|');
        let newID;
        if(idCurrt[1] !== undefined){
          newID = [idCurrt[0]+'['+idCurrt[1]+']'];
        }else{
          newID = idCurrt[0];
        }
        this.parentPathofMainObjectSelected[newID] = resultObj;
        this.pathofCurrentArrayObj = resultObj;
      }
   }  
  
  this.parentPath = currtExpand;
  return this.pathofCurrentArrayObj;
}
   deleteEntryMethod(evt,id,key,item){
    if(this.rowDataArry.length > 0){
      let index = this.rowDataArry.findIndex(x => x.fieldId == item.fieldId);
      this.rowDataArry.splice(index,1);
      if(this.innerChildJsonDataContent !== undefined){
        let checkboxEle = this.innerChildJsonDataContent.nativeElement;
        let combinUUid = 'uuid|'+item.fieldId;
        let inputCheckedEle = checkboxEle.getElementsByClassName("checkInput");
        let inputUniqueId = evt.target.getAttribute("data-uniquepathid");
        
        if(inputCheckedEle !== undefined){
          let filteredItem = [...inputCheckedEle].find(x => x.getAttribute("data-uniquepathid") === item.fromPath);
          if(filteredItem !== undefined){
            filteredItem.checked = false;
          }          
        }        
        // if(checkboxEle.getElementsByClassName('checked|'+key+'|'+item.fromPath+'|'+item.fieldIndexParent)[0] !== undefined){
        //   let inputCheckedEle = checkboxEle.getElementsByClassName('checked|'+key+'|'+item.fromPath+'|'+item.fieldIndexParent)[0].children[0];
        //   inputCheckedEle.checked = false;
        // }else if(checkboxEle.getElementsByClassName('checked|'+item.fromPath+'|'+item.fromPath+'|'+item.fieldIndexParent)[0] !== undefined){
        //   let inputCheckedEle = checkboxEle.getElementsByClassName('checked|'+item.fromPath+'|'+item.fromPath+'|'+item.fieldIndexParent)[0].children[0];
        //   inputCheckedEle.checked = false;
        // }              
      }
    }
   }
   typeOf(value) {
    return typeof value;
  }
  isArrayObj(value) {
    return Array.isArray(value);
  }
   checkTypeOf(key,val,i): any { 
    let flag = false;
    this.checkIfObjectArry = [];
      if(Array.isArray(val)){
        //let obj = {}
        flag = true;
        let obj = {};
        obj[key] = flag;
        this.checkIfObjectArry.push(obj);
      }else if(this.typeOf(val) === 'object'){
        flag = true;
        let obj = {};
        obj[key] = flag;
        this.checkIfObjectArry.push(obj);
      }else{
        flag = false;
        let obj = {};
        obj[key] = flag;
        this.checkIfObjectArry.push(obj);
      }
    return flag;
  }
  filterIfKeyValueInObject(objDataVal,objKey){
    let filterVal = "";
      this.expandedValFor = objKey;
      this.expandedValForTempSave = objKey;
      if(Array.isArray(objDataVal)){
        filterVal = 'array';
      }else{
        filterVal = this.typeOf(objDataVal);
      }
    return filterVal;
  }
  checkValidationForInputParamsMethod(paramsArryObj){
    let errorflag = false;
    if(paramsArryObj !== undefined){
      if(paramsArryObj.length > 0){
        lodash.map(paramsArryObj, function(obj,i){
          lodash.mapKeys(obj, function(value, key){
            if(value == ""){
              errorflag = true;
            }
          });          
        });
      }
    }
    return errorflag;
  }
  clearGeneratedJSONDataMethod(){
    this.generatedSampleJson = undefined;
    this.simplyfiedGeneratedSampleJson = [];
  }
  async getResponseJsonFromSampleJsonMethod(url){
    let urlPath:any = 
        {"url":url,
        "headers":JSON.stringify(this.headerInfoObj)
      }
      if(lodash.isEmpty(this.headerInfoObj)){
        delete urlPath.headers;
      }
      let endpoint = AppConstants.API_END_POINTS.GET_API_PROCESS_URL;
      const result = await this.httpService.post(endpoint,urlPath).toPromise();
      if (result.status == 'SUCCESS') {
          this.generatedSampleJson = JSON.parse(result.response);
          this.renderingApiResponseCommonMethod(this.generatedSampleJson);
      }else{
        this.showloader.emit({'showloaderEnabled':false,'successEnabled':false});
        Swal.fire({
          title: result.message,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: this.translate.instant('designEditor.okBtn'),
        });
      }
  }
  renderingApiResponseCommonMethod(sampleJSONGenerated){
    this.simplyfiedGeneratedSampleJson = this.fetchObjectDataMethod(sampleJSONGenerated);
          if(Array.isArray(sampleJSONGenerated)){
            if(this.multiArrayPath){
              this.usedArrayPathSelected = 'response';
              this.useArrayJsonOnloadEnabled = true;
              this.generatedSampleJson = this.generatedSampleJson.slice(0,1);
            }else{
              if(!this.isEditMode){
                this.clearAllGenerateJsonDataMethod();
              }
            }           
          }else{this.useArrayJsonOnloadEnabled = false;}
          this.uuidOnload = uuidv4();
          this.uuidCount = 0;
          this.showloader.emit({'showloaderEnabled':false,'successEnabled':true});
        if(this.isEditMode){
          this.showfieldsSectionMethod();           
          setTimeout(() => {
            this.showSelectedCheckedInput(this.rowDataArry,'','',false);
          }, 1000);
        }else{
          this.rowDataArry = [];
          this.clearAllGenerateJsonDataMethod();
          this.defaultMsgForTableView = true;
          this.showAccordionPanelTable = false;
          this.showloader.emit({'showloaderEnabled':false,'successEnabled':false});

        }
  }
  callConfrimBeforeGenerateSampleJsonFusionJsMethod(sampleJson){
    this.showloader.emit({'showloaderEnabled':false,'successEnabled':false});
    Swal.fire({
      title: this.translate.instant('apiPersonalization.generateSampleJsonOnEditmodeConfirmMsgLbl'),
      width: '60%',
      icon: 'warning',
      showCloseButton: false,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('designEditor.okBtn'),
      //confirmButtonColor: '#3366FF',
      cancelButtonText: this.translate.instant('designEditor.cancelBtn'),
      cancelButtonColor: '',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        cancelButton: 'buttonCssStyle',
        confirmButton: 'buttonCssStyle',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.rowDataArry = []; // clear all fields data
        this.clearAllGenerateJsonDataMethod();
        this.renderingApiResponseCommonMethod(sampleJson);
      } else {
        // go back savely
        
      }
    });
  }
  callConfrimBeforeGenerateSampleJsonMethod(url){
    this.showloader.emit({'showloaderEnabled':false,'successEnabled':false});
    Swal.fire({
      title: this.translate.instant('apiPersonalization.generateSampleJsonOnEditmodeConfirmMsgLbl'),
      width: '60%',
      icon: 'warning',
      showCloseButton: false,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('designEditor.okBtn'),
      //confirmButtonColor: '#3366FF',
      cancelButtonText: this.translate.instant('designEditor.cancelBtn'),
      cancelButtonColor: '',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        cancelButton: 'buttonCssStyle',
        confirmButton: 'buttonCssStyle',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.rowDataArry = []; // clear all fields data
        this.clearAllGenerateJsonDataMethod();
        this.getResponseJsonFromSampleJsonMethod(url);
      } else {
        // go back savely
        
      }
    });
  }
  async fusionJSGenerateSampleJSONForMethod(sampleJson,collectparamsJS){
    this.generatedSampleJson = sampleJson;
    //let errorflag = this.checkValidationForInputParamsMethod(collectparamsJS); 
    if(this.isEditMode){
      //this.clearAllGenerateJsonDataMethod();
      this.renderingApiResponseCommonMethod(this.generatedSampleJson);
    }else{
      if(this.rowDataArry.length > 0){        
        this.callConfrimBeforeGenerateSampleJsonFusionJsMethod(sampleJson);
      }else{             
        this.clearAllGenerateJsonDataMethod();
        this.renderingApiResponseCommonMethod(this.generatedSampleJson);
      }
    }  
      
     
    
  }
   async generateSmapleJSonMethod(url,keyvalueArry){
    //-------------- Serve Side Url Render JSON--------
    
    if(Object.keys(keyvalueArry).length > 0 ){
      this.headerInfoObj = keyvalueArry;
    }
    let errorflag = this.checkValidationForInputParamsMethod(this.collectParams);
    let confirmOnEditModeFlag = false;
    if(!errorflag){
      if(this.rowDataArry.length > 0){        
        this.callConfrimBeforeGenerateSampleJsonMethod(url);
      }else{
        // if(this.isEditMode && this.rowDataArry.length == 0){
        //   this.callConfrimBeforeGenerateSampleJsonMethod(url);
        // }else{
        //   this.getResponseJsonFromSampleJsonMethod(url);
        // }        
        this.clearAllGenerateJsonDataMethod();
        this.getResponseJsonFromSampleJsonMethod(url);
      }
      
    }else{
      this.showloader.emit({'showloaderEnabled':false,'successEnabled':false});
      Swal.fire({
        title: this.translate.instant('apiPersonalization.pleaseDefineTheAPInputParametersToContinueLbl'),
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: this.translate.instant('designEditor.okBtn'),
      });
    }
    

    //------------ Client Side Url Rendering JSON --------
    // if(url !== undefined){
    //   fetch(url).then(res => res.json())
    //   .then(jsonData => {
    //     this.generatedSampleJson = jsonData;
    //     //this.getInnerLevelData(jsonData);
    //     this.showloader.emit({'showloaderEnabled':false,'successEnabled':false});

    //     if(this.isEditMode){
    //       setTimeout(() => {
    //         this.showSelectedCheckedInput(this.rowDataArry,'');
    //         //this.addClickEventHandlerMethod();
    //       }, 600);
    //     }else{
    //       this.rowDataArry = [];
    //     }      
    //   });
    // }    
  }
  clearAllGenerateJsonDataMethod(){
    //this.rowDataArry = [];
              this.usedArrayPathSelected = ''; 
              this.useThisArraySelectedName = "";
              this.parentPathofMainObjectSelected = {};
              this.pathofExpandedItemJson = [];  
              this.usedArraySelected = false;
              this.useArrayJsonOnloadEnabled = false;
  }
  getJsonFromGeneratedJsonMethod(path){
    let iteratePath = path.split('.').slice(1);
    let obj = {};
    let result:any;
    if(iteratePath.length > 0){
      iteratePath.forEach((ele,ind) => {
        if(ind === 0){
          result =  this.getObjValMethod(this.generatedSampleJson,ele);
        }
        if(ind > 0){
          if(result !== undefined){
            result = this.getObjValMethod(result,ele);
          }
           }
        });
    }else{
      result = this.generatedSampleJson;
    }
     return JSON.stringify(result);
  }
  findObjInGenerateJsonMethod(path){
    let iteratePath = path.split('.');
    let obj = {};
    let result:any;
    iteratePath.forEach((ele,ind) => {
      if(ind === 0){
        result =  this.getObjValMethod(this.generatedSampleJson,ele);
      }
      if(ind > 0){
        if(result !== undefined){
          result = this.getObjValMethod(result,ele);
        }
         }
      });
     return JSON.stringify(result);
  }
  getObjValMethod(json,finditem){
    let obj:any;
    if(Array.isArray(json)){
      obj = lodash.map(json,finditem);
    }else{      
      obj = json[this.splitBySquareBracketMethod(finditem)];      
    }
    
    return obj;
  }
  getInnerLevelData(){
    let dataObj = this.generatedSampleJson;
    let innnerChildEle = this.innerChildJsonDataContent.nativeElement;
    let objectArry = Object.keys(dataObj);
    objectArry.forEach((Key,i) => {
      let isType = this.typeOf(dataObj[Key]);
     let data = {index:i,key:Key,value:dataObj[Key],type:isType};
     this.fillNewData = {...data};
     return this.fillNewData;

      //let templateToAppend = this.createGridJsonFromData(data);
      //innnerChildEle.innerHTML = templateToAppend;
    });
  }
  expandInnerChildObj(evt,innerObjVal,innerObjKey,index,parentExpanded,useArrayFlag,childIndex,isArrayExapanding,multiArrayElementEnbaled,orginExpand,innerValueIsArray){
    //let objVal
    this.expandedObjs = {};
    let showChildDiv = typeof(innerObjVal);
    let icon = evt.target.className;
    let uuidChildViewContent = evt.target.getAttribute('data-uuid');

    // if(icon.includes('fa-plus')){
    //  let plusIcon =  evt.target.className.replace('plus','minus');
    //  evt.target.className = plusIcon;
    // }else if(icon.includes('fa-minus')){
    //   let minusIcon = evt.target.className.replace('minus','plus');
    //   evt.target.className = minusIcon;
    //   //let currtExpandedData = evt.target.getElementsByClassName('childTableView_'+index+'_'+innerObjKey)[0];
    //   //let currtExpandedData = this.childTableViewContent.nativeElement.getElementsByClassName('childTableView_'+index+'_'+innerObjKey+'_'+childIndex)[0];

    //   let currtExpandedData = this.innerChildJsonDataContent.nativeElement.getElementsByClassName('childTableView_'+index+'_'+innerObjKey+'_'+childIndex)[0];
    //   currtExpandedData.style.display = 'none';
    // }
    // if(useArrayFlag){
    //   let iduseArrBnt = evt.target.classList[0].replace('|',"_");
    //   if(this.childTableViewContent !== undefined ){
    //     let plusElmIcon = this.childTableViewContent.nativeElement.getElementsByClassName(iduseArrBnt+' fa-plus')[0];
    //     plusElmIcon.className.replace('fa-plus','fa-minus');
    //   }
    // }
    let makepath = {};
    if(multiArrayElementEnbaled){
      makepath[innerObjKey] = innerObjVal;
      //parentExpanded = evt.target.getAttribute('data-parentexpandedName');
      parentExpanded = evt.target.getAttribute('data-parentexpandedName');
     // parentExpanded = evt.target.getAttribute('name');
    }else{
      makepath[innerObjKey+'|'+childIndex] = innerObjVal;
      parentExpanded = evt.target.getAttribute('name');
    }
    
    this.pathofExpandedItemJson.push(makepath);
      this.expandedValFor = innerObjKey;
      this.expandedValForTempSave - innerObjKey;
      this.changeDetectionMethod();
    
    //this.pathForExpanded.push(innerObjKey);
    this.expandedObjs = innerObjVal;
    //this.myContext = innerObjVal;
       
    let innerChildElement = this.nestedInnerChildContent.nativeElement;
    let parentOfChildElement = this.innerChildJsonDataContent.nativeElement;
    //this.childViewContent = this.childTableViewContent.nativeElement;
    
    //this.childTableViewContent = parentOfChildElement.querySelectorAll('.childTableView_'+index+'_'+innerObjKey+'_'+childIndex);
    
    
    this.appendChildHtml = []; // clear before insert.
    if(Array.isArray(innerObjVal)){
      innerObjVal.forEach((each,idx) => {
        //let ind_loop = index+'_'+idx;
        let appendHTML = this.createArrayIndexHtmlMethod(evt,innerObjVal,each,index,innerObjKey,parentExpanded,useArrayFlag,idx,multiArrayElementEnbaled,orginExpand);
        // Object.keys(each).forEach((keyInner,k) => {
        //   let appendHTML = this.createGridJsonFromData(each,keyInner,k,innerObjKey,parentExpanded,useArrayFlag,idx);
        //   this.appendChildHtml.push(appendHTML);
        // });        
        this.appendChildHtml.push(appendHTML);
      });
    }else{
      if(typeof(innerObjVal) == 'string' || typeof(innerObjVal) == 'number' || typeof(innerObjVal) === undefined || typeof(innerObjVal) === null){
          if(multiArrayElementEnbaled){
            let appendHTML = this.createGridJsonFromData(evt,innerObjVal,innerObjKey,index,innerObjKey,parentExpanded,index,useArrayFlag,childIndex,true,'singleValue',multiArrayElementEnbaled,orginExpand,innerValueIsArray); // true is if array of string
            this.appendChildHtml.push(appendHTML);
          }else{
            let appendHTML = this.createGridJsonFromData(evt,innerObjVal,innerObjKey,index,innerObjKey,parentExpanded,index,useArrayFlag,childIndex,false,'object',multiArrayElementEnbaled,orginExpand,innerValueIsArray);
            this.appendChildHtml.push(appendHTML);
          }
          
      }else if(typeof(innerObjVal) == 'object'){
        if(innerObjVal !== null){
          Object.keys(innerObjVal).forEach((key,j) => {
            if(Array.isArray(innerObjKey[key])){
              let arrayList = innerObjKey[key];
              if(arrayList.length > 0){
                arrayList.forEach((each,idxx) => {
                  let appendHTML = this.createGridJsonFromData(evt,each,key,j,innerObjKey,parentExpanded,index,useArrayFlag,idxx,false,'array',multiArrayElementEnbaled,orginExpand,innerValueIsArray);
                  this.appendChildHtml.push(appendHTML);
                });
              }
            }else{
              let appendHTML = this.createGridJsonFromData(evt,innerObjVal[key],key,j,innerObjKey,parentExpanded,index,useArrayFlag,childIndex,false,'object',multiArrayElementEnbaled,orginExpand,innerValueIsArray);
              this.appendChildHtml.push(appendHTML);
            }
            
          });
        }        
      }
      
    }
    let arrayelements;
    if(multiArrayElementEnbaled){
      //arrayelements = parentOfChildElement.querySelectorAll('.childTableView|'+index+'|'+innerObjKey);
      //arrayelements = parentOfChildElement.getElementsByClassName('childTableView|'+index+'|'+innerObjKey);childView|{{uuidOnload}}
      arrayelements = parentOfChildElement.getElementsByClassName('childView|'+uuidChildViewContent);
    }else{
      //arrayelements = parentOfChildElement.querySelectorAll('.childTableView|'+index+'|'+innerObjKey+'|'+childIndex);
      //arrayelements = parentOfChildElement.getElementsByClassName('childTableView|'+index+'|'+innerObjKey+'|'+childIndex);
      arrayelements = parentOfChildElement.getElementsByClassName('childView|'+uuidChildViewContent);
    }    
    let iconEleuuid = evt.target.getAttribute('data-uuid');
    let selectedElementFromJson = this.checkForMultipleOccurrenceMethod(iconEleuuid,arrayelements,index,innerObjKey,childIndex);
    
    let  currentChild;
    if(isArrayExapanding){
      currentChild = selectedElementFromJson;
    }else{
      currentChild = selectedElementFromJson;
    }
    
    currentChild.innerHTML = ""; //Clear and append
    currentChild.innerHTML = this.appendChildHtml.join('');
    //this.ngAfterViewInit(evt,innerObjVal,innerObjKey,index);
    //console.log(innnerChildEle);
    //this.innerChildEnable = innerObjVal;
    // setTimeout(() => {
    //   this.addClickEventHandlerMethod();
    // }, 500);
  }
  
  checkForMultipleOccurrenceMethod(iconEleId,arrayelements,index,innerObjKey,childIndex){
    let selectedElementFromJson;
    if(arrayelements !== undefined){
      let sameElementsAccuranceArray = [...arrayelements];
      for(let i=0; i < sameElementsAccuranceArray.length; i++){
        let findSelectedEle = sameElementsAccuranceArray[i].getAttribute('data-uuid');
        let keyVal = sameElementsAccuranceArray[i].getAttribute('name');
        let uuidIcon = iconEleId;
          if(uuidIcon == findSelectedEle){
            selectedElementFromJson = sameElementsAccuranceArray[i];
            break;
          } 
              


        // if(findSelectedEle.getAttribute('data-arryLoopIndex') !== null){
        //   let idArryLoop = +index+'_'+innerObjKey+'_'+childIndex;
        //   if(findSelectedEle.getAttribute('data-arryLoopIndex').split('_').length < 3){
        //     let cretId = +index+'_'+innerObjKey+'_'+childIndex;
        //     if(cretId == idArryLoop){
        //       selectedElementFromJson = findSelectedEle;
        //       break;
        //     }            
        //   }else{
        //     if(findSelectedEle.getAttribute('data-arryLoopIndex') == idArryLoop){
        //       let uuidIcon = iconEleId.getAttribute('data-uuid');
        //       if(uuidIcon == findSelectedEle.getAttribute('data-uuid')){
        //         selectedElementFromJson = findSelectedEle;
        //         break;
        //       }              
        //     }
        //   }
                    
        // }else{
        //   let uuidIcon = iconEleId.getAttribute('data-uuid');
        //       if(uuidIcon == findSelectedEle.getAttribute('data-uuid')){
        //         selectedElementFromJson = findSelectedEle;
        //         break;
        //       } 
        // }
      }
    
    }
    return selectedElementFromJson;
  }
  userThisArrayToShowData(key,indx){
    console.log(key,indx);
  }
  getLoopParams(arryIndx,loopindx){
    let flag;
    flag = arryIndx+'_'+loopindx+'_'+loopindx;
    return flag;
  }
  generateUUidMethod(index){  
    if(index !== undefined){
      if(index > 0){
        this.uuidOnload = uuidv4();
      }
    }     
    
    return [this.uuidOnload];    
  }
  getArrayPathofEachExpandedItemsMethod(event,key,arrayIndex){
    let path = this.newMakeArrayPathFromEventClickMethod(event,key);//this.makeArrayPathfromMethod(event,key,key);
    //let filterPath = uniq(path.concat(key));
    let joinpath = uniq(path).join('.');
    let finalPath = joinpath+'['+arrayIndex+']';
    return finalPath;
  }
  getObjectPathofEachExpandedItemsMethod(event,key,arrayIndex){
    let path = this.newMakeArrayPathFromEventClickMethod(event,key);//this.makeArrayPathfromMethod(event,key,key);
    let joinpath = path.join('.');
    let finalPath;
    let currentEventPath:any = "response."+joinpath;
    if(this.useArrayBtnClicked){
      finalPath = joinpath+'[0]';
    }else if(this.usedArrayPathSelected === currentEventPath){
      finalPath = joinpath+'[0]';
    }else{
      finalPath = joinpath;
    }
    return finalPath;
  }
  createGridJsonFromData(event,dataJson,key,i,expandedFrom,parentExpanded,loopIdxparentIndex,useArrayFlag,loopIdx,isarrayofString,typeofVal,multiArrayElementEnbaled,orginExpand,innerValueIsArray){
    let subTemp = ``;
    let checkTempInput = "";
    let labelInputEle = "";
    let dataJsonTypeOf = this.typeOf(dataJson);
    let multiObjectInputLabel = this.translate.instant('apiPersonalization.multiObjectOutputLbl');
    let useThisArrayLbl = this.translate.instant('apiPersonalization.usethisArrayLbl');
    let stringifyValforEachItem = this.getKeyValueOnClickMethod(dataJson)[0];
    let uuid = uuidv4();   
    let parentMultiIndex = event.target.getAttribute('data-originexpand');//event.target.parentElement.parentElement.parentElement.getAttribute('data-originexpand');
    let parentExpandMultiple = event.target.getAttribute('name');
    let parentIndexMulti = parentExpandMultiple.split('|')[1];
    let charCodeId = "";//this.convertCharCodeMethod(key,dataJson,'',i,loopIdxparentIndex,loopIdx);
    let pathOfEachExpanded = this.getObjectPathofEachExpandedItemsMethod(event,expandedFrom,i);
    let valueWithCondArry= `
          <div class="row col mt-2 loopIndex_`+loopIdx+` parentPath_`+parentExpanded+`">
            <div class="smallLabel aconPlusdiv|`+i+`|`+key+`|`+loopIdx+` ml-2 mt-2 align-middle level_`+key+`" #plushMinusIconElement>[ <i class="aconPlus|`+i+`|`+key+`|`+loopIdx+` far fa-plus fa-sm plusIconClick cursor-pointer useArrayList" name="`+parentExpanded+`" data-uniquePathId="`+pathOfEachExpanded+"."+key+`" data-parentExpandedName="`+parentExpanded+`" data-arryLoopIndex="`+i+`|`+key+`|`+loopIdx+`" data-expandedName="`+key+`" data-uuid="`+uuid+`" data-originExpand="`+orginExpand+`"></i> ]</div>
            <div class="smallLabel mt-2 ml-2 defaultPointer">`+key+`</div>
            <button type="button" class="aconPlus|`+i+`|`+key+`|`+loopIdx+` ml-2 mt-2 useArrayBtn" name="`+parentExpanded+`" data-uniquePathId="`+pathOfEachExpanded+"."+key+`" data-uuid="`+uuid+`" data-arryLoopIndex="`+i+`|`+key+`|`+loopIdx+`" data-parentExpandedName="`+parentExpanded+`" data-originExpand="`+orginExpand+`">`+useThisArrayLbl+`</button>
            <input type="hidden" class="hiddenVal|`+i+`|`+key+`|`+loopIdx+`" value="`+stringifyValforEachItem+`" data-uuid="`+uuid+`">
          </div>
            <div class="col childTableStyle childTableView|`+i+`|`+key+`|`+loopIdx+` mt-2 mb-2 ml-1 childView|`+uuid+`" #childTableViewContent *ngIf="expandedValFor == `+key+`" name="`+parentExpanded+`" data-uniquePathId="`+pathOfEachExpanded+`" data-arryLoopIndex="`+i+`|`+key+`|`+loopIdx+`" data-uuid="`+uuid+`" data-originExpand="`+orginExpand+`">
          </div>     
    `;
    let valueWithSingleArry= `
          <div class="row col mt-2 loopIndex_`+loopIdx+` parentPath_`+parentExpanded+`">
            <div class="smallLabel aconPlusdiv|`+i+`|`+key+`|`+loopIdx+` ml-2 mt-2 align-middle level_`+key+`" #plushMinusIconElement>[ <i class="aconPlus|`+i+`|`+key+`|`+loopIdx+` far fa-plus fa-sm plusIconClick cursor-pointer" name="`+parentExpanded+`" data-uniquePathId="`+pathOfEachExpanded+"."+key+`" data-parentExpandedName="`+parentExpanded+`" data-arryLoopIndex="`+i+`|`+key+`|`+loopIdx+`" data-expandedName="`+key+`" data-uuid="`+uuid+`" data-originExpand="`+orginExpand+`"></i> ]</div>
            <div class="smallLabel mt-2 ml-2 defaultPointer">`+key+`</div>  
            <input type="hidden" class="hiddenVal|`+i+`|`+key+`|`+loopIdx+`" value="`+stringifyValforEachItem+`" data-uuid="`+uuid+`">          
          </div>
            <div class="col childTableStyle childTableView|`+i+`|`+key+`|`+loopIdx+` mt-2 mb-2 ml-1 childView|`+uuid+`" #childTableViewContent *ngIf="expandedValFor == `+key+`" data-uniquePathId="`+pathOfEachExpanded+`" name="`+parentExpanded+`" data-arryLoopIndex="`+i+`|`+key+`|`+loopIdx+`" data-uuid="`+uuid+`" data-originExpand="`+orginExpand+`">
          </div>     
    `;
    
    let colorOfStr = "";
    if(dataJsonTypeOf == 'string'){
      colorOfStr = 'stringCss';
    }else if(dataJsonTypeOf == 'number'){
      colorOfStr = 'numberCss';
    }else if(dataJsonTypeOf == 'boolean'){
      colorOfStr = 'booleanCss';
    }
    let valueWithCond= `    
          <label class="smallLabel mt-2 ml-2 text-break defaultPointer `+colorOfStr+`" title="`+dataJsonTypeOf+`" >`+dataJson+`</label>      
    `;
    let valueWithEmptyArry= `    
          <label class="smallLabel mt-2 ml-2 text-break defaultPointer">Empty Array</label>      
    `;
    let valueWithEmptyObject= `    
          <label class="smallLabel mt-2 ml-2 text-break defaultPointer">Empty Object</label>      
    `;
    //let datavalStringify = JSON.stringify(dataJson);
    
    let valueWithCondObject = `
    <div class="row col loopIndex_`+loopIdx+` parentPath_`+parentExpanded+`" >
      <div class="smallLabel aconPlusdiv|`+i+`|`+key+`|`+loopIdx+` ml-2 mt-2 align-middle level_`+key+`" #plushMinusIconElement>[ <i class="aconPlus|`+i+`|`+key+`|`+loopIdx+` far fa-plus fa-sm plusIconClick cursor-pointer" name="`+parentExpanded+`" data-uniquePathId="`+pathOfEachExpanded+"."+key+`" data-parentExpandedName="`+parentExpanded+`" data-arryLoopIndex="`+i+`|`+key+`|`+loopIdx+`" data-expandedName="`+key+`" data-uuid="`+uuid+`" data-originExpand="`+orginExpand+`"></i> ]</div>
      <div class="smallLabel mt-2 ml-2 defaultPointer" >`+key+`</div>
      <input type="hidden" class="hiddenVal|`+i+`|`+key+`|`+loopIdx+`" value="`+stringifyValforEachItem+`" data-uuid="`+uuid+`" data-uniquePathId="`+pathOfEachExpanded+`">
    </div>
      <div class="col childTableStyle childTableView|`+i+`|`+key+`|`+loopIdx+` mt-2 mb-2 childView|`+uuid+`" #childTableViewContent *ngIf="expandedValFor == `+key+`" data-uniquePathId="`+pathOfEachExpanded+`" data-arryLoopIndex="`+i+`|`+key+`|`+loopIdx+`" name="`+parentExpanded+`" data-uuid="`+uuid+`" data-originExpand="`+orginExpand+`">
          
      </div>
    `;
    
    if(Array.isArray(dataJson)){
      if(dataJson.length > 0){
        if(this.multiArrayPath){ // show when multi object selected
          subTemp = valueWithCondArry;
        }else{ // when signle object selected
          subTemp = valueWithSingleArry;
        }  
      }else{
        subTemp = valueWithEmptyArry;
      }   
      checkTempInput = "";
    }else if(typeof(dataJson) === 'object'){
      if(dataJson !== null){
        // if(this.indexOfPlusIcon == i && this.plusIconEnabled){
        //   subTemp = valueWithCondObject1; // plus
        // }else{
        //   subTemp = valueWithCondObject1; // minus
        // }
        if(Object.keys(dataJson).length > 0){
          subTemp = valueWithCondObject;   
        }else{
          subTemp = valueWithEmptyObject;
        }
        checkTempInput = "";    
      }else{
        subTemp = valueWithCond;
        if(useArrayFlag){
          checkTempInput = `<input type="checkbox" class="checkInput checkInput|`+i+`|`+key+`|`+dataJsonTypeOf+` ml-2 checkValign" data-uniquePathId="`+pathOfEachExpanded+"."+key+`" data-arryLoopIndex="`+i+`|`+key+`|`+loopIdx+`" name="`+parentExpanded+`" data-parentExpandedName="`+expandedFrom+`" data-uuid="`+uuid+`" data-originExpand="`+orginExpand+`">`
        }else{
          checkTempInput = `<input type="checkbox" class="checkInput checkInput|`+i+`|`+key+`|`+dataJsonTypeOf+` ml-2 checkValign" data-uniquePathId="`+pathOfEachExpanded+"."+key+`" data-arryLoopIndex="`+i+`|`+key+`|`+loopIdx+`" name="`+parentExpanded+`" data-parentExpandedName="`+expandedFrom+`" disabled data-uuid="`+uuid+`" data-originExpand="`+orginExpand+`">`
        }
        
      }
      //checkTempInput = `<input type="checkbox" class="ml-2 align-middle" name="`+key+`" (click)="selectedPathMethod($event,`+key+`,`+dataJson+`,i,false);">`
      
    }else{
      subTemp = valueWithCond;
      if(useArrayFlag){
        if(typeofVal === 'singleValue'){
          checkTempInput = `<input type="checkbox" class="checkInput checkInput|`+i+`|`+key+`|`+dataJsonTypeOf+` ml-2 checkValign" data-uniquePathId="`+pathOfEachExpanded+"."+key+`" data-arryLoopIndex="`+i+`|`+key+`|`+loopIdx+`" name="`+parentExpanded+`" data-parentExpandedName="`+expandedFrom+`"  data-uuid="`+uuid+`" data-originExpand="`+orginExpand+`">`
        }else{
          if(innerValueIsArray){ // array of string or value
            checkTempInput = `<input type="checkbox" class="checkInput checkInput|`+i+`|`+key+`|`+dataJsonTypeOf+` ml-2 checkValign" data-uniquePathId="`+pathOfEachExpanded+`" data-arryLoopIndex="`+i+`|`+key+`|`+loopIdx+`" name="`+parentExpanded+`" data-parentExpandedName="`+expandedFrom+`"  data-uuid="`+uuid+`" data-originExpand="`+orginExpand+`">`
          }else{
            checkTempInput = `<input type="checkbox" class="checkInput checkInput|`+i+`|`+key+`|`+dataJsonTypeOf+` ml-2 checkValign" data-uniquePathId="`+pathOfEachExpanded+"."+key+`" data-arryLoopIndex="`+i+`|`+key+`|`+loopIdx+`" name="`+parentExpanded+`" data-parentExpandedName="`+expandedFrom+`"  data-uuid="`+uuid+`" data-originExpand="`+orginExpand+`">`
          }
          
        }        
      }else{
        checkTempInput = `<input type="checkbox" class="checkInput checkInput|`+i+`|`+key+`|`+dataJsonTypeOf+` ml-2 checkValign" data-uniquePathId="`+pathOfEachExpanded+"."+key+`" data-arryLoopIndex="`+i+`|`+key+`|`+loopIdx+`" name="`+parentExpanded+`" data-parentExpandedName="`+expandedFrom+`" disabled data-uuid="`+uuid+`" data-originExpand="`+orginExpand+`">`
      }      
    }
    if(multiArrayElementEnbaled && typeofVal === 'singleValue'){
     // labelInputEle = `<label class="smallLabel p-2 text-break"  title="`+loopIdx+`">`+loopIdx+`</label>`;
     labelInputEle = `<label class="smallLabel p-2 text-break"  title="`+key+`" data-uniquePathId="`+pathOfEachExpanded+`"></label>`
     if(useArrayFlag){
      checkTempInput = `<input type="checkbox" class="checkInput checkInput|`+i+`|`+key+`|`+dataJsonTypeOf+` ml-2 checkValign multiArrayOfObject" data-uniquePathId="`+pathOfEachExpanded+`" data-arryLoopIndex="`+i+`|`+key+`|`+loopIdx+`" name="`+parentExpanded+`" data-parentExpandedName="`+expandedFrom+`" data-isArrayOfItem="true" data-uuid="`+uuid+`" data-originExpand="`+orginExpand+`">`
     }else{
      checkTempInput = `<input type="checkbox" class="checkInput checkInput|`+i+`|`+key+`|`+dataJsonTypeOf+` ml-2 checkValign multiArrayOfObject" data-uniquePathId="`+pathOfEachExpanded+`" data-arryLoopIndex="`+i+`|`+key+`|`+loopIdx+`" name="`+parentExpanded+`" data-parentExpandedName="`+expandedFrom+`" data-isArrayOfItem="true" disabled data-uuid="`+uuid+`" data-originExpand="`+orginExpand+`">`
     }      
    }else{
      if(innerValueIsArray){ // its for array of string or value like ["123","456","test","url"]
        labelInputEle = `<label class="smallLabel p-2 text-break defaultPointer"  title="`+key+`" data-uniquePathId="`+pathOfEachExpanded+`"></label>`
      }else{
        labelInputEle = `<label class="smallLabel p-2 text-break defaultPointer"  title="`+key+`" data-uniquePathId="`+pathOfEachExpanded+"."+key+`">`+key+`</label>`
      }
      
    }
    let contentTemplate:any = 
     `
     <div class="row col p-0 tableViewFOrApiJson ml-1 `+orginExpand+`" data-uniquePathId="`+pathOfEachExpanded+`">
                <div class="col-2 p-0 jsonKeyName keyName|`+key+` checked|`+key+`|`+expandedFrom+`|`+parentExpanded+` uuid|`+uuid+`" uuid name="`+parentExpandMultiple+`" data-uniquePathId="`+pathOfEachExpanded+`" data-parentExpandedName="`+expandedFrom+`">
                    `+checkTempInput+`
                    `+labelInputEle+`
                </div>
                <div class="col p-0 jsonValName parentPath|`+key+`|`+expandedFrom+`|`+parentExpanded+`" uuid|`+uuid+`" data-originExpand="`+orginExpand+`" data-uniquePathId="`+pathOfEachExpanded+`">                
                    `+subTemp+`
                </div>

            </div>
    `;
      return contentTemplate;
    
   }
  //  innerObjectItrateMethod(eachObj,key,parentExpanded,parentIndex,useArrayFlag,idx){
  //   this.appendinnerChildHtml = [];
  //   Object.keys(eachObj).forEach((keyInner,k) => {
  //         let appendHTML = this.createGridJsonFromData(eachObj,keyInner,k,key,parentExpanded,parentIndex,useArrayFlag,idx,false,'object');
  //         this.appendinnerChildHtml.push(appendHTML);
  //       }); 
  //       return this.appendinnerChildHtml;
  //  }
   getKeyValueOnClickMethod(valObj){
    let resultObj;
    if(Array.isArray(valObj)){
      resultObj = encodeURIComponent(JSON.stringify(valObj));
    }else{
      if(valObj === null || valObj === undefined){
        resultObj = encodeURIComponent(JSON.stringify(valObj));
      }else{
        if(valObj.value === undefined){
          resultObj = encodeURIComponent(JSON.stringify(valObj));
        }else{
          resultObj = encodeURIComponent(JSON.stringify(valObj.value));
        }   
      }         
    }
    let obj = [resultObj]
    resultObj = obj;
    return resultObj;
   }
   createArrayIndexHtmlMethod(evt,arrayJson,eachObj,parentIndex,key,parentExpanded,useArrayFlag,childIndex,multiArrayElementEnbaled,orginExpand){
    let contentTemplate,subTemp;
   // let innerObjJsonOfArray = this.innerObjectItrateMethod(arrayJson[loopIdx],key,parentExpanded,useArrayFlag,loopIdx);
   let uuidChild = uuidv4();
    let stringifyValforEachItem = this.getKeyValueOnClickMethod(eachObj)[0];
    let parentSelectedId;
    let pathofEachArrayExpanded = this.getArrayPathofEachExpandedItemsMethod(evt,key,childIndex);
    // if(multiArrayElementEnbaled){
    //   parentSelectedId =  parentExpanded;
    // }else{
    //   parentSelectedId =  parentExpanded;
    // }
    let valueWithLoopArrayObj = `
      <div class="col mt-2 loopIndex_`+childIndex+` tableViewFOrApiJson" data-uniquePathId="`+pathofEachArrayExpanded+`">
        <div class="row col" data-multipleArrayIndex="`+parentExpanded+`" data-uniquePathId="`+pathofEachArrayExpanded+`">
          <div class="smallLabel aconPlusdiv|`+parentIndex+`|`+key+`|`+childIndex+` ml-2 mt-2 align-middle level_`+key+`" #plushMinusIconElement data-originExpand="`+parentIndex+`|`+key+`" data-multipleArrayIndex="`+parentExpanded+`">[ <i class="aconPlus|`+parentIndex+`|`+key+`|`+childIndex+` far fa-plus fa-sm plusIconClick cursor-pointer multiArrayOfObject" name="`+parentExpanded+`" data-uniquePathId="`+pathofEachArrayExpanded+`" data-parentExpandedName="`+key+`|`+childIndex+`" data-expandedName="`+key+`|`+childIndex+`" data-arryLoopIndex="`+parentIndex+`|`+key+`|`+childIndex+`" data-uuid="`+uuidChild+`" data-originExpand="`+orginExpand+`"></i> ]</div>
          <div class="smallLabel mt-2 ml-2 defaultPointer">`+key+`[`+childIndex+`]</div>  
          <input type="hidden" class="hiddenVal|`+parentIndex+`|`+key+`|`+childIndex+`" data-uniquePathId="`+pathofEachArrayExpanded+`" value="`+stringifyValforEachItem+`" data-uuid="`+uuidChild+`">          
        </div>
          <div class="col childTableStyle childTableView|`+parentIndex+`|`+key+`|`+childIndex+` m-1 mb-2 pl-1 childView|`+uuidChild+`" #childTableViewContent *ngIf="expandedValFor == `+key+`" name="`+key+`|`+childIndex+`" data-uniquePathId="`+pathofEachArrayExpanded+`" data-arryLoopIndex="`+parentIndex+`|`+key+`|`+childIndex+`" data-uuid="`+uuidChild+`" data-originExpand="`+orginExpand+`">
        </div>  
      </div>  
    `;
    if(Array.isArray(arrayJson)){
      subTemp = valueWithLoopArrayObj;  
    }else if(typeof(arrayJson) === 'object'){
      //subTemp = valueWithLoopArrayObj;  
    }else{
      //subTemp = valueWithLoopArrayObj;  
    }
    contentTemplate = subTemp;
    return contentTemplate;
   }
   
  checkInnerLevel(arryObj){
    if(Array.isArray(arryObj)){
      const result = {...arryObj};
      this.myFilter = result;
    }else{
      this.myFilter = arryObj;
    }
    return arryObj = this.myFilter;
   //console.log(arryObj); 
  }
  splitBySquareBracketMethod(id){
    let selName:any = "";
    if(id !== undefined && id !== null){
      let fltObj = id.split('[');     
      if(fltObj[1] !== undefined){
        selName = fltObj[0];
      }else{
        selName = fltObj[0];
      }
    }
    return selName;
  }
  splitIdMethod(id){
    let selectedIndx:any = "";
    if(id !== undefined && id !== null){
      let fltObj = id.split('|');     
      if(fltObj[1] !== undefined){
        selectedIndx = fltObj[0]+'['+fltObj[1]+']';
      }else{
        selectedIndx = fltObj[0];
      }
    }
    return selectedIndx;
  }
  splitArrayFirstItemMethod(id){
    let splitArry:any = "";
    if(id !== undefined && id !== null){
      let fltObj = id.split('|');     
      if(fltObj[1] !== undefined){
        splitArry = fltObj[0];
      }else{
        splitArry = fltObj[0];
      }
    }   
    return splitArry;
  }
  filterPathFromSelectedInputMethod(evt,nameKey,indx,fromParent,valObj){
    let mainObj = this.generatedSampleJson;
    let keysArry:any = [];
    let findparent:any = [];
    let allExpanedObj = this.parentPathofMainObjectSelected;
    let getParentElementId = evt.target.getAttribute('data-originExpand');
    let filterParentObj = this.getParentPathMethod(evt);
    let splitParentObj = filterParentObj.split('|');
    let fristParentObj; let selectedIndx;
    // if(getParentElementId === null){
    //   getParentElementId = evt.target.parentElement.parentElement.parentElement.parentElement.getAttribute('name');
    //   if(getParentElementId === null){
    //     getParentElementId = evt.target.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('name');
    //   }
    // }
    let clickedFrom = evt.target.getAttribute('name');
    let stopLooping:boolean = false;
    // if(getParentElementId !== undefined && getParentElementId !== null){
    //   let fltObj = getParentElementId.split('|');     
    //   if(fltObj[1] !== undefined){
    //     selectedIndx = fltObj[0]+'['+fltObj[1]+']';
    //   }else{
    //     selectedIndx = fltObj[0];
    //   }
    // }
    selectedIndx = this.splitIdMethod(getParentElementId);
    
    // if(splitParentObj[1] !== undefined){
    //   if(this.multiArrayPath){
    //     fristParentObj = splitParentObj[0];//+'['+splitParentObj[1]+']';
    //   }else{
    //     fristParentObj = splitParentObj[0]+'['+splitParentObj[1]+']';
    //   }
       
    // }else{
    //    fristParentObj = splitParentObj[0];
    // }
    
    // let parentExpandedObj = this.pathofExpandedItemJson;
    //for (let i=1; i<=30; i++) {
      //let level1 = lodash.findKey(allExpanedObj,nameKey);      
      //let level1 = lodash.findKey(lodash.pick(allExpanedObj,this.parentPath));
      this.indexPathOfSelectedJson = {};
      let curtSplit = fromParent.split('|');
      let startPoint;
      if(curtSplit[1] !== undefined){
        if(this.multiArrayPath){
          startPoint = curtSplit[0]+'['+curtSplit[1]+']';
        }else{
          startPoint = curtSplit[0]+'['+curtSplit[1]+']';
        }
       
      }else{
        startPoint = curtSplit[0];
        
       // 
      }      
      //let level1 = startPoint; // parent from selected find if any further childs are present
      let level1;let level2:any;
      if(splitParentObj[0] === nameKey){
        level1 = startPoint;
      }else{
        level1 = startPoint;
      }

      if(level1 !== undefined){
        if(getParentElementId === null){
          getParentElementId = evt.target.getAttribute('data-originexpand');
        }
        if(level1 === this.splitIdMethod(getParentElementId)){
          stopLooping = true;
        }else if(lodash.startsWith(level1,getParentElementId)){
          stopLooping = true;
        }else{
          findparent.push(level1);
        }
        
        //this.indexPathOfSelectedJson[startPoint] = curtSplit[1];
        for (let index = 0; index < findparent.length; index++) {
          // let multiOccuranceArry = lodash.pickBy(allExpanedObj,findparent[index]);
          // let mapItera = lodash.indexOf(multiOccuranceArry,selectedIndx);
          level2 = lodash.findKey(allExpanedObj,findparent[index]);
          let simplifyId;
          if(level2 !== undefined){
            level1 = undefined;
            let splitId = level2.split('|');
            if(splitId[1] !== undefined){
              level2 = splitId[0]+'['+splitId[1]+']';
            }else{
              //level2 = splitId[0];
            }
            if(getParentElementId !== undefined && getParentElementId !== null){
              let parentElemId;
              if(evt.target.className.includes('useArrayBtn')){
                parentElemId = evt.target.getAttribute('name');
              }else{
                parentElemId = evt.target.parentElement.getAttribute('name');
              }              
               let multiOccuranceArry:any = lodash.pickBy(allExpanedObj,findparent[index]);
               let keyfind = lodash.uniq(lodash.keys(multiOccuranceArry));
               if(keyfind.length > 1){
                //let indRemove = lodash.indexOf(keyfind,selectedIndx);
                let Xpathid = evt.target.getAttribute('data-uniquepathid').split('.');
                let currId:any = lodash.intersection(keyfind,Xpathid);                
                let indRemove = lodash.indexOf(keyfind,currId[0]);
                // if(indRemove == -1){
                //   let xyz = this.splitIdMethod(evt.target.getAttribute('data-originExpand'));
                //   indRemove = lodash.indexOf(keyfind,xyz);
                // }
                let pickCurrt = keyfind[indRemove];
                if(pickCurrt !== undefined){
                  if(level2 !== pickCurrt){
                    level2 = pickCurrt;
                  }
                }                
               }              
            }
           
            if(level2 !== undefined){
              if(level2 === this.splitIdMethod(getParentElementId)){
                stopLooping = true;
              }else if(lodash.startsWith(level2,getParentElementId)){
                stopLooping = true;
              }else{
                findparent.push(level2);
              }
              
            }            
            //this.indexPathOfSelectedJson[level2] = index;            
          }        
        }      
        if(stopLooping){
          if(level1 !== undefined){
            findparent.push(level1);
          }else{ // for level2
            //findparent.push(this.splitIdMethod(getParentElementId));
            findparent.push(level2);
          }
          
        }  
      }
    //}
    // let checkIfPathisIncluded;
    //   if(this.multiArrayPath){
    //    let splitUsePath =  this.usedArrayPathSelected.split('.');
    //    checkIfPathisIncluded = splitUsePath.includes(nameKey);
    //   }else{
    //     checkIfPathisIncluded = false;
    //   }
    //   if(checkIfPathisIncluded){
    //     findparent = '';
    //   }else{
    //    // findparent.splice(findparent.length-1,1,fristParentObj); //  replace last item to correct first parent item
    //   } 
    //findparent.splice(findparent.length-1,1,fristParentObj); //  replace last item to correct first parent item
    return lodash.reverse(lodash.uniq(findparent));
  }
  getParentPathMethod(evt){
    let isArrayOfItem = evt.target.getAttribute('data-isarrayofitem');
    //let isArrayOfItem = evt.target.getAttribute('data-arryloopindex');    
    let parentElemt; 
    if(isArrayOfItem){
      if(this.multiArrayPath){
        parentElemt = evt.target.parentElement.parentElement.parentElement.getAttribute('name');
      }else{
        //parentElemt = evt.target.getAttribute('data-parentexpandedName');
        parentElemt = evt.target.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('name');
      }
      
    }else{
      if(this.multiArrayPath){
        parentElemt = evt.target.getAttribute('name');
      }else{
        parentElemt = evt.target.getAttribute('data-parentexpandedName');
      }
      
    }
   return parentElemt;
  }
  getParenObjFromIdMethod(mainObj,arryOfIds){
    let finalObj;
    //for(let i=0; i < arryOfIds.length; i++){
      let obj:any = [];
      obj.push(mainObj[arryOfIds[0]]);
      if(Array.isArray(obj[0])){
        if(obj[0] !== undefined){
          if(obj[0][arryOfIds[1]] !== undefined){
            finalObj = obj[0][arryOfIds[1]];
          }          
        }        
      }else{
        if(obj !== undefined){
          finalObj = obj;
        }
      }
   // }
   return finalObj;
  }
  makeArrayPathfromMethod(evt,parentPath,key){ // Multi response exapand method.
    let mainObj = this.generatedSampleJson;
    let keysArry:any = [];
    let findparent:any = [];
    let allExpanedObj = this.parentPathofMainObjectSelected;
    let getParentElementId = evt.target.parentElement.parentElement.parentElement.getAttribute('data-originExpand');
    let getParentofParentElementId = evt.target.getAttribute('data-parentexpandedname');
    //let filterParentObj = this.getParentPathMethod(evt) ;
    //let splitParentObj = filterParentObj.split('|');
    let fristParentObj;
    let selectedIndx;
    let idParentSimplify:any;
    if(getParentElementId !== undefined && getParentElementId !== null){
      idParentSimplify = getParentElementId;
    }else if(getParentofParentElementId !== undefined && getParentofParentElementId !== null){
      idParentSimplify = getParentofParentElementId;
    }
    if(idParentSimplify !== undefined){
      let fltObj = idParentSimplify.split('|');     
      if(fltObj[1] !== undefined){
        selectedIndx = fltObj[0]+'['+fltObj[1]+']';
      }else{
        selectedIndx = fltObj[0];
      }
    }
    // if(splitParentObj[1] !== undefined){
    //   if(this.multiArrayPath){
    //     fristParentObj = splitParentObj[0];//+'['+splitParentObj[1]+']';
    //   }else{
    //     fristParentObj = splitParentObj[0]+'['+splitParentObj[1]+']';
    //   }       
    // }else{
    //    fristParentObj = splitParentObj[0];
    // }

    this.indexPathOfSelectedJson = {};
    let curtSplit = parentPath.split('|');
    let startPoint;
    let stopLooping:boolean = false;
    if(curtSplit[1] !== undefined){
      if(!this.multiArrayPath){
        startPoint= curtSplit[0]+'['+curtSplit[1]+']'
      }else{
        startPoint= curtSplit[0]+'['+curtSplit[1]+']';
      }  
      
    }else{
      startPoint= curtSplit[0];
    }
    
     // let level1 = lodash.findLastKey(allExpanedObj, key);
     //let level1 = startPoint; // this the selected level from this will be searching the parent -> forloop   
     let level1 = startPoint; let level2:any;
      if(level1 !== undefined){
        if(getParentElementId === null){
          getParentElementId = evt.target.getAttribute('data-originexpand');
        }
        if(level1 === this.splitIdMethod(getParentElementId)){
          stopLooping = true;
        }else if(lodash.startsWith(level1,getParentElementId)){
          stopLooping = true;
        }else{
          findparent.push(level1);
        }
       // this.indexPathOfSelectedJson[level1] = 0; 
        for (let index = 0; index < findparent.length; index++) {
          level2 = lodash.findKey(allExpanedObj,findparent[index]);
          if(level2 !== undefined){
            level1 = undefined;
            let splitId = level2.split('|');
            if(splitId[1] !== undefined){
              level2 = splitId[0]+'['+splitId[1]+']';
            }else{
              //level2 = splitId[0];
            }

            if(idParentSimplify !== undefined){
              let parentElemId;
              // if(evt.target.className.includes('useArrayBtn')){
              //   parentElemId = evt.target.getAttribute('name');
              // }else{
              //   parentElemId = evt.target.parentElement.getAttribute('name');
              // }
              parentElemId = evt.target.getAttribute('name');
              let isArrayExpanded = evt.target.className.includes('useArrayList');
              let uniqueId = evt.target.getAttribute("data-uniquepathid").split('.');
              let lastIndexId;
              let multiOccuranceArry:any = lodash.pickBy(allExpanedObj,findparent[index]);
              let keyfind = lodash.uniq(lodash.keys(multiOccuranceArry));
              if(keyfind.length > 1){
              // let indRemove = lodash.indexOf(keyfind,selectedIndx);
              //let currId = this.splitIdMethod(parentElemId);
              let currId:any = lodash.intersection(keyfind,uniqueId); 
              let indRemove = lodash.indexOf(keyfind,currId[0]);
               let pickCurrt = keyfind[indRemove];
               if(pickCurrt !== undefined){
                if(level2 !== pickCurrt){
                  level2 = pickCurrt;
                }
               }               
              }              
           }
           if(level2 !== undefined){
            if(level2 === this.splitIdMethod(getParentElementId)){
              stopLooping = true;
            }else if(lodash.startsWith(level2,getParentElementId)){
              stopLooping = true;
            }else{
              findparent.push(level2);
            }
           }            
           // this.indexPathOfSelectedJson[level2] = index;          
          }
        
        }    
        if(stopLooping){
          if(level1 !== undefined){
            findparent.push(level1);
          }else{ // for level2
            findparent.push(level2);
          }
          
        }
      }
      
      // let checkIfPathisIncluded;
      // if(this.multiArrayPath){
      //  let splitUsePath =  this.usedArrayPathSelected.split('.');
      //  checkIfPathisIncluded = splitUsePath.includes(fristParentObj);
      // }else{
      //   checkIfPathisIncluded = false;
      // }
      // if(checkIfPathisIncluded){
      //   findparent = '';
      // }else{
      //  // findparent.splice(findparent.length-1,1,fristParentObj); //  replace last item to correct first parent item
      // }  
      //findparent.splice(findparent.length-1,1,fristParentObj);


      // let parentElemId = evt.target.getAttribute("data-uniquepathid");
      // let finalMerge;
      // if(parentElemId !== null){
      //   finalMerge = lodash.merge(findparent,parentElemId.split('.'));
      // }else{
      //   finalMerge = findparent;
      // }
      return lodash.reverse(lodash.uniq(findparent));
  }

  newMakeArrayPathFromEventClickMethod(evt,key){
    let uniqueSelectedPath = evt.target.getAttribute("data-uniquePathId").split(".");
    //let usedAryhSelected = this.usedArrayPathSelected.split(".");
    let finalPath;
    // if(this.usedArrayPathSelected !== ""){ // multi response
    //   let dropRespionseItem = drop(usedAryhSelected,1);
    //   finalPath = drop(uniqueSelectedPath,dropRespionseItem.length);    
    // }else{ // single response
    //  finalPath = uniqueSelectedPath;   
    // }
    finalPath = uniqueSelectedPath;   
     
    return finalPath;
  }
  makeArrayValObjMethod(evt,arrayObj,parentPath,parentindex,index,childIndex,multiArrayElementEnbaled){
    //let mainObj = this.generatedSampleJson;
    let valsArry:any;
    //let findparent:any = [];
    let parentOfChildElement = this.innerChildJsonDataContent.nativeElement;
    //let parentEleFindChild = parentOfChildElement.getElementsByClassName('hiddenVal_'+index+'_'+parentPath+'_'+childIndex)[0].value;
    let parentEleFindChild;
    if(multiArrayElementEnbaled){
      parentEleFindChild = parentOfChildElement.getElementsByClassName('hiddenVal|'+index+'|'+parentPath);
    }else{
      parentEleFindChild = parentOfChildElement.getElementsByClassName('hiddenVal|'+index+'|'+parentPath+'|'+childIndex);
    } 
    
    let iconEleuuid = evt.target.getAttribute('data-uuid');    
    let findHiddenInputVal = this.checkForMultipleOccurrenceMethod(iconEleuuid,parentEleFindChild,index,parentPath,childIndex);
    valsArry = JSON.parse(decodeURIComponent(findHiddenInputVal.value));
    return valsArry;
  }
  selectedPathMethod(evt,key,indx,path,val){
    //let path = this.pathForExpanded;
    let parentPath:any;
    let xpandedName = evt.target.name;    
    let parentExapandedfrom = evt.target.getAttribute('data-parentexpandedName');
    let arrayIndex = evt.target.getAttribute('data-arryLoopIndex');
    let uuidForCheckboxInput = evt.target.getAttribute('data-uuid');
    let originExpand =  evt.target.getAttribute('data-originExpand');
    let takeIndex;
    if(arrayIndex.split('|')[2] !== undefined){
      takeIndex = arrayIndex.split('|')[2];
    }
    let valTypeSlipt:any = val.split(' ');
    let valTypeOf:any = "";
    if(valTypeSlipt !== undefined){
      let findTypeOfArryString = evt.target.parentElement.parentElement;
      if(findTypeOfArryString !== undefined){
        if(findTypeOfArryString.getElementsByClassName('stringCss')[0] !== undefined){
          valTypeOf = 'string';
        }else if(findTypeOfArryString.getElementsByClassName('numberCss')[0] !== undefined){
          if(findTypeOfArryString.getElementsByClassName('numberCss')[0].innerHTML.includes('.')){
            valTypeOf = 'float';
          }else{
            valTypeOf = 'number';
          }          
        }else if(findTypeOfArryString.getElementsByClassName('booleanCss')[0] !== undefined){
          valTypeOf = 'boolean';
        }else{
          valTypeOf = valTypeSlipt[0]; // default value changed on 09-01-2025
          //valTypeOf = valTypeSlipt[0]; // old changes  
        }
      }
      
    }
    let isArrayOfItems = evt.target.getAttribute('data-isArrayOfItem');
    let multiArrayElementEnbaled = evt.target.classList.contains('multiArrayOfObject');
    //let navigatePath = this.expandedPathForEachExpandObj[parentExapandedfrom];
    // let indxOfParent = lodash.indexOf(navigatePath,parentExapandedfrom);
    // let indxOfChild = lodash.indexOf(navigatePath,xpandedName);
    //let takeArry:any = lodash.flatMapDepth(this.expandedPathForEachExpandObj);
    
    //let pullArray:any = lodash.nth(navigatePath,indxOfParent);
    //let pullArray = takeArry.concat(xpandedName);
    
    //let takeArry:any = lodash.keys(this.parentPathofMainObjectSelected);
    let filterPath:any;
    if(this.usedArrayPathSelected !== '' && this.multiArrayPath){ // multi object path only selected from checkbox
      filterPath = [];
      let pullArray = filterPath;
    if(evt.target.checked){
      let keyFromTitle = evt.target.nextElementSibling.getAttribute('title');
       parentPath = xpandedName;
       this.clickFromInput = true;
       let checkDotPresent = this.checkDotIsPresentInSelectedPathMethod(key);
       //let finalPullArry = pullArray.concat(key);
      //  let inx = takeArry.findIndex(x => x == xpandedName);

      //  let finalPullArry = takeArry.slice(0,inx+1);
      //  let usedpath = this.usedArrayPathSelected.split('.');
      //  usedpath.splice(0,1);
      //  let differnsArry = lodash.difference(finalPullArry,usedpath);

      let makePathArray;
      if(this.useArrayJsonOnloadEnabled){
        makePathArray =  this.newMakeArrayPathFromEventClickMethod(evt,key);
      }else{
        makePathArray =  this.newMakeArrayPathFromEventClickMethod(evt,key);
      }      
        let pathSelectJson;
        let filMakeArry:any = [];
        this.collectionOfSelectedFields[parentPath] = makePathArray;
        //let filMakeArry = lodash.take(makePathArray,parentPath);
      //makePathArray.splice(0,1);
      let splitObj = parentPath.split('|');
      let splitCombineId;
      // if(this.multiArrayPath){
      //   if(multiArrayElementEnbaled){
      //     if(splitObj[1] !== undefined){
      //       splitCombineId = splitObj[0]+'['+splitObj[1]+']';
      //     }else{
      //       splitCombineId = splitObj[0];
      //     }
          
      //   }else{
      //     let useArryPathSplit = this.usedArrayPathSelected.split('.');
      //     useArryPathSplit.splice(0,1);
      //     let differenObj = lodash.difference(lodash.merge(makePathArray,useArryPathSplit),useArryPathSplit);
      //     let findStr = differenObj.join('.').includes(this.useThisArraySelectedName);
      //     if(findStr){
      //       let sepObj = lodash.unionBy(differenObj,this.useThisArraySelectedName,this.useThisArraySelectedName);
      //       let filtObj = lodash.xor(differenObj,sepObj);
      //       splitCombineId = filtObj;
      //     }else{
      //       splitCombineId = differenObj;
      //     }
      //     //splitCombineId = differenObj;
      //   }
             
      // }else{
      //   if(splitObj[1] !== undefined){
      //     splitCombineId = splitObj[0]+'['+splitObj[1]+']';
      //   }else{
      //     splitCombineId = splitObj[0];
      //   }
      // }
      
      
      // if(this.usedArrayPathSelected.includes(splitObj[0])){
      //   if(this.useThisArraySelectedName == splitObj[0]){
      //     let ind;
      //     if(splitObj[1] !== undefined){
      //        ind = makePathArray.findIndex(x => x == splitObj[0]+'['+splitObj[1]+']');
      //       filMakeArry = lodash.drop(makePathArray,ind+1);
      //     }else{
      //       ind = makePathArray.findIndex(x => x == splitObj[0]);
      //       filMakeArry = lodash.drop(makePathArray,ind+1);
      //     }
          
      //     //filMakeArry = filMakeArry.concat(splitObj[1]);
      //   }else{

      //   }
      // }else{
        
      //   if(multiArrayElementEnbaled){
      //     let useArryPathSplit = this.usedArrayPathSelected.split('.');
      //     useArryPathSplit.splice(0,1);
      //     let differenObj = lodash.difference(lodash.merge(makePathArray,useArryPathSplit),useArryPathSplit);
      //     let findStr = differenObj.join('.').includes(this.useThisArraySelectedName);
      //     if(findStr){
      //       let sepObj = lodash.unionBy(differenObj,this.useThisArraySelectedName,this.useThisArraySelectedName);
      //       let filtObj = lodash.xor(differenObj,sepObj);
      //       filMakeArry = filtObj;
      //     }else{
      //       filMakeArry = differenObj;
      //     }
          
          
      //   }else{
      //     let useArryPathSplit = this.usedArrayPathSelected.split('.');
      //     useArryPathSplit.splice(0,1);
      //     let differenObj = lodash.difference(lodash.merge(makePathArray,useArryPathSplit),useArryPathSplit);
      //     let findStr = differenObj.join('.').includes(this.useThisArraySelectedName);
      //     if(findStr){
      //       let sepObj = lodash.unionBy(differenObj,this.useThisArraySelectedName,this.useThisArraySelectedName);
      //       let filtObj = lodash.xor(differenObj,sepObj);
      //       filMakeArry = filtObj;
      //     }else{
      //       filMakeArry = differenObj;
      //     }
      //     //filMakeArry = differenObj;
      //     // let ind = makePathArray.findIndex(x => x == splitObj[0]+'['+splitObj[1]+']');
      //     // filMakeArry = makePathArray.slice(ind);
      //   }
      // }
      // delete first element of used This array has present
      // if(this.useArrayJsonOnloadEnabled){
      //   if(filMakeArry === undefined){
      //     filMakeArry
      //   }
      // }
      
      // if(filMakeArry.length == 0){
      //   let useArryPathSplit = this.usedArrayPathSelected.split('.');
      //   if(useArryPathSplit !== undefined){
      //     let checkValid = lodash.includes(useArryPathSplit,key);
      //       if(checkValid){
      //         if(splitObj[1] !== undefined){
      //           let arryelmKey = lodash.findLast(useArryPathSplit);
      //           if(arryelmKey === key){
      //             pathSelectJson = 0;
      //           }else{
      //             pathSelectJson = splitObj[1];
      //           }
                
      //         }else{
      //           let arryelmKey = lodash.findLast(useArryPathSplit);
      //           if(this.multiArrayPath){
      //             if(arryelmKey === key){
      //               pathSelectJson = 0;
      //             }else{
      //               pathSelectJson = key;
      //             }
      //           }
                
                
      //         }
              
      //       }else{              
      //         // let currtObj = JSON.parse(this.getJsonFromGeneratedJsonMethod(this.usedArrayPathSelected));
      //         // if(currtObj !== undefined){
      //         //   let flag = Array.isArray(currtObj[0]);
      //         //   if(flag){
      //         //     // dont show anything for array, because array has index.
      //         //     pathSelectJson = key;
      //         //   }else{
      //         //     if(typeof(currtObj[0]) === 'object'){
      //         //       if(this.useArrayJsonOnloadEnabled){
      //         //         pathSelectJson = splitCombineId.join('.');
      //         //       }else{
      //         //         pathSelectJson = key;
      //         //       }
                    
      //         //     }else{

      //         //     }
                  
      //         //   }
      //         // }else{
      //         //   if(multiArrayElementEnbaled){
      //         //     // no show
      //         //   }else{
      //         //     pathSelectJson = key;
      //         //   }
      //         // }
      //         // if(this.useArrayJsonOnloadEnabled){
      //         //   pathSelectJson = splitCombineId.join('.');
      //         // }else{
      //         //   pathSelectJson = key;
      //         // } 
      //         pathSelectJson = key;
      //       }
      //   }
        
      //  }else{
      //   if(isArrayOfItems){
      //     if(filMakeArry.length == 0){
      //       let indxOfArr = key.split('|');
      //         if(indxOfArr[1] !== undefined){
      //           pathSelectJson = indxOfArr[1];
      //         }else{
      //           pathSelectJson = key;
      //         }
      //     }else{
      //       let checkValid = filMakeArry.includes(key);
      //       if(checkValid){
      //         pathSelectJson = filMakeArry.join('.');
      //       }else{
      //        // pathSelectJson = filMakeArry.join('.')+'.'+key;
      //        pathSelectJson = filMakeArry.join('.');
      //       }
            
      //     }          
      //   }else{
      //     if(multiArrayElementEnbaled){
      //       pathSelectJson = filMakeArry.join('.');
      //     }else{
      //       if(filMakeArry.length == 0){              
      //         if(isArrayOfItems){
      //           pathSelectJson = takeIndex;
      //         }else{
      //           pathSelectJson = key;
      //         }
      //       }else{  
      //         let checkValid = filMakeArry.includes(key);
      //         if(checkValid){
      //           pathSelectJson = filMakeArry.join('.');
      //         }else{
      //           let finalFilterArry;
      //           if(lodash.isMatch(filMakeArry,makePathArray)){
      //             finalFilterArry = [];
      //           }else{
      //             finalFilterArry = lodash.uniq(filMakeArry);
      //           }
      //           if(finalFilterArry.length === 0){
      //             pathSelectJson = key;
      //           }else{
      //             pathSelectJson = finalFilterArry.join('.')+'.'+key;
      //           }        
      //         }
              

      //         // if(isArrayOfItems){
      //         //   pathSelectJson = filMakeArry.join('.')+'.'+key;
      //         // }else{
      //         //   pathSelectJson = filMakeArry.join('.');
      //         // }
      //       }            
      //     }
          
      //   }
      //  }
       //let pathSelectJson = finalPullArry.join('.');
      //  if(this.hasPropertyInUsedArray.length > 0){
      //   pathSelectJson = this.hasPropertyInUsedArray.join('.');
      //  }else{
        
      //  }
      let newIdpath;
      let fromPathSaved;
       if(this.multiArrayPath){ // multi response
          let newPath = evt.target.getAttribute('data-uniquepathid').split(".");
          let usedAryhSelected = this.usedArrayPathSelected.split(".");
          let dropRespionseItem = drop(usedAryhSelected,1);
          let finalPath = drop(newPath,dropRespionseItem.length);
          newIdpath = finalPath.join(".");
          fromPathSaved = newPath.join(".");
       }else{ //single response
        //pathSelectJson = 
       }
      let newDotPath = newIdpath.replace(checkDotPresent.replace('##$##','.'),checkDotPresent);
      let checkForDotExistInSelectedPath = newDotPath;
      let obj;
        if(this.isEditMode){
          if(this.rowDataArry.length > 0){
            obj = {
              id:uuidForCheckboxInput,
            selectedName:key,
            fieldId:uuidForCheckboxInput,
            path:newIdpath,//pathSelectJson,
            type:valTypeOf,
            fieldIndexParent:parentExapandedfrom,
            fromPath:fromPathSaved,//parentPath,
            fieldVal : val,
            fieldKey:keyFromTitle,
            fieldPathModified:checkForDotExistInSelectedPath
            }
          }else{
            obj = {
              id:uuidForCheckboxInput,
            selectedName:key,
            fieldId:uuidForCheckboxInput,
            path:newIdpath,
            type:valTypeOf,
            fieldIndexParent:parentExapandedfrom,
            fromPath:fromPathSaved,//parentPath,
            fieldVal : val,
            fieldKey:keyFromTitle,
            fieldPathModified:checkForDotExistInSelectedPath
            }     
          }     
        }else{
         obj = {
            id:uuidForCheckboxInput,
          selectedName:key,
          fieldId:uuidForCheckboxInput,
          path:newIdpath,
          type:valTypeOf,
          fieldIndexParent:parentExapandedfrom,
          fromPath:fromPathSaved,//parentPath,
          fieldVal : val,
          fieldKey:keyFromTitle,
          fieldPathModified:checkForDotExistInSelectedPath
          }          
        }  
        // if(Object.keys(this.indexPathOfSelectedJson).length > 0){
        //   Object.keys(this.indexPathOfSelectedJson).forEach((item,i) => {
        //     if(obj.path.includes(item)){
        //       obj.path = obj.path.replace(item,item+'['+this.indexPathOfSelectedJson[item]+']');
        //     }               
        //   });            
        // }  
        this.rowDataArry.push(obj);    
    }else{
      //fieldPathEle.getElementsByClassName('path_')
      let newPath = evt.target.getAttribute('data-uniquepathid');
      let indOf = this.rowDataArry.findIndex(x => x.fromPath === newPath);
      this.rowDataArry.splice(indOf,1);
    }
    }
    if(this.usedArrayPathSelected === '' && !this.multiArrayPath){ // single object path from parent
      filterPath = this.filterPathFromSelectedInputMethod(evt,key,indx,parentExapandedfrom,val);      
      let pullArray = filterPath;
      if(evt.target.checked){
        let keyFromTitle = evt.target.nextElementSibling.getAttribute('title');
         parentPath = xpandedName;
         let checkDotPresent = this.checkDotIsPresentInSelectedPathMethod(key);
         let indxOfArr = parentPath.split('|');
         let filterPathCorrected;
          if(indxOfArr[1] !== undefined){
            filterPathCorrected = indxOfArr[0]+'['+indxOfArr[1]+']';
          }else{
            filterPathCorrected = indxOfArr[0];
          }
         let finalPullArry;
         if(isArrayOfItems){
          // let findStr = pullArray.join('.').includes(key);
          // if(findStr){
          //   let sepObj = lodash.unionBy(pullArray,key,key);
          //   let filtObj = lodash.xor(pullArray,sepObj);
          //   finalPullArry = filtObj;
          // //finalPullArry = pullArray;
          // }
          finalPullArry = pullArray;
         }else{
          if(multiArrayElementEnbaled){
            finalPullArry = pullArray;
          }else{
            if(pullArray == key){
              finalPullArry = pullArray;
            }else{
              finalPullArry = pullArray.concat(key);
            }
            
          }          
         }
        
         let pathSelectJson = "response."+finalPullArry.join('.');
         let newIdpath = evt.target.getAttribute('data-uniquepathid');
         let newDotPath = newIdpath.replace(checkDotPresent.replace('##$##','.'),checkDotPresent);
         let checkForDotExistInSelectedPath = newDotPath;
        let obj;
          if(this.isEditMode){
            if(this.rowDataArry.length > 0){
              obj = {
                id:uuidForCheckboxInput,
              selectedName:key,
              fieldId:uuidForCheckboxInput,
              path:newIdpath,
              type:valTypeOf,
              fieldIndexParent:parentExapandedfrom,
              fromPath:newIdpath,
              fieldVal : val,
              fieldKey:keyFromTitle,
              fieldPathModified: checkForDotExistInSelectedPath
              }
            }else{
              obj = {
                id:uuidForCheckboxInput,
              selectedName:key,
              fieldId:uuidForCheckboxInput,
              path:newIdpath,
              type:valTypeOf,
              fieldIndexParent:parentExapandedfrom,
              fromPath:newIdpath,
              fieldVal : val,
              fieldKey:keyFromTitle,
              fieldPathModified: checkForDotExistInSelectedPath
              }     
            }     
          }else{
           obj = {
              id:uuidForCheckboxInput,
            selectedName:key,
            fieldId:uuidForCheckboxInput,
            path:newIdpath,
            type:valTypeOf,
            fieldIndexParent:parentExapandedfrom,
            fromPath:newIdpath,
            fieldVal : val,
            fieldKey:keyFromTitle,
            fieldPathModified: checkForDotExistInSelectedPath
            }          
          }
          // if(Object.keys(this.indexPathOfSelectedJson).length > 0){
          //   Object.keys(this.indexPathOfSelectedJson).forEach((item,i) => {
          //     if(obj.path.includes(item)){
          //       obj.path = obj.path.replace(item,item+'['+this.indexPathOfSelectedJson[item]+']');
          //     }               
          //   });            
          // }
          this.rowDataArry.push(obj);    
      }else{
        let newPath = evt.target.getAttribute('data-uniquepathid');
        let indOf = this.rowDataArry.findIndex(x => x.fromPath === newPath);
        this.rowDataArry.splice(indOf,1);
      }
    }
    this.showfieldsSectionMethod();
    
  }
  checkDotIsPresentInSelectedPathMethod(key){
    let resultObj;
    if(key !== undefined){
      if(key.includes('.')){
        resultObj = key.replaceAll('.','##$##');
      }else{
        resultObj = key;
      }
    }
    
    return resultObj;
  }
  getArrayIndexOfCheckedInputMethod(arrayIndex){
    let splitIndex = arrayIndex.split('|');
    if(splitIndex[1] !== undefined){

    }else{
      
    }    
  }
  collectDataApiListMethod(){  
    let arryObj:any = []; let pathArry:any = []; 

    if(this.rowDataArry.length > 0){ 
      this.rowDataArry.forEach((ele,inx) => {
        //pathArry.push("response."+ele.key);
        let pathstr = ele.path;
      let obj:any = {
        "fieldName": ele.selectedName,
        "fieldType": ele.type,
        "fieldPath": ele.path,
        "fieldId":ele.fieldId,
        "fromPath":ele.fromPath,
        "fieldVal" : ele.fieldVal,
        "fieldIndexParent":ele.fieldIndexParent,
        "fieldKey":ele.fieldKey,
        "fieldPathModified":ele.fieldPathModified
      }
      arryObj.push(obj);
      });
      
    }
    return arryObj;
  }
  
  showSelectedCheckedInput(arrayObj,xpandKey,parentExpandIndex,takeArrayEnable){
    let checkboxEle = this.innerChildJsonDataContent.nativeElement;
    let checkElementId;
    if(arrayObj.length > 0){
      arrayObj.forEach((ele,i) => {
        // if(xpandKey == "" && parentExpandIndex == ""){
        //   checkElementId = checkboxEle.getElementsByClassName('checked|'+ele.fieldId+'|'+ele.fromPath+'|'+ele.fieldIndexParent);
        // }else{
        //   if(takeArrayEnable){
        //     checkElementId = checkboxEle.getElementsByClassName('checked|'+ele.fromPath+'|'+xpandKey+'|'+parentExpandIndex);
        //   }else{
        //     checkElementId = checkboxEle.getElementsByClassName('checked|'+ele.fieldId+'|'+xpandKey+'|'+parentExpandIndex);
        //   }          
        // }
        let multiOccour = checkboxEle.getElementsByClassName('keyName|'+ele.fieldKey);
        [...multiOccour].forEach((element,i) => {
          let attrName = element.getAttribute('data-parentExpandedName');
          let InptEle = element.children[0].getAttribute('data-uuid');
          let currtElemt = element.getAttribute('name');
          let comparePathElement = element.children[0].getAttribute('data-uniquepathid');
          //comparePathElement = 'response.'+comparePathElement;
          if(InptEle === undefined){InptEle = ''};
         // if(InptEle == ele.fieldId){
            if(lodash.isMatch(ele.fromPath,comparePathElement)){
            //let combinUUid = 'uuid|'+ele.fieldId;
           // checkElementId = checkboxEle.getElementsByClassName(combinUUid);
           checkElementId = multiOccour[i];
           //if(ele.path.includes(this.splitIdMethod(currtElemt))){
            if(checkElementId !== undefined){
              let firstChildEle:any,ind;
              let eleArry = checkElementId;     
              if(!this.multiArrayPath){
                let splitArray = ele.path.split('.');
                ind = splitArray.indexOf(this.splitIdMethod(xpandKey));
                firstChildEle = splitArray[ind];            
              }else{            
                let splitArray = comparePathElement.split('.');
                ind = splitArray.indexOf(this.splitIdMethod(xpandKey));
                firstChildEle = splitArray[ind]; 
              }
              // if(!this.multiArrayPath){
              //   let parentElemIdMultiple = this.splitIdMethod(element.getAttribute('data-parentExpandedName'));
              //   let splitArray = ele.fromPath.split('.');
              //   //ind = splitArray.indexOf(parentElemIdMultiple);
              //   firstChildEle = splitArray[i];            
              // }else{
              //   let parentElemIdMultiple = this.splitIdMethod(element.getAttribute('name'));
              //   let combineBoth;
              //   if(ele.fromPath !== undefined){
              //     combineBoth = this.usedArrayPathSelected+'.'+ele.fromPath;
              //   }else{
              //     combineBoth = this.usedArrayPathSelected;
              //   }
                
              //   let splitArray = combineBoth.split('.');
              //   // ind = splitArray.include(parentElemIdMultiple);
              //   firstChildEle = splitArray[i]; 
              // }
              
              if(firstChildEle !== undefined){
                if(this.splitIdMethod(xpandKey) == firstChildEle){
                  //[...eleArry].forEach((ele,i) => {
                    //let splitArray = ele.path.split('.');
                    //if(splitArray.includes(this.splitIdMethod(xpandKey))){
                      let inputEle = eleArry.getElementsByTagName('input')[0];
                      if(inputEle !== undefined){
                        inputEle.checked= true;
                      }
                    //}
                    
                  //});
                  // let inputCheckedEle = checkboxEle.getElementsByClassName('checked|'+ele.fieldId)[0].children[0];
                  // inputCheckedEle.checked = true;
               } 
              }else{
                if(eleArry !== undefined){
                 // [...eleArry].forEach((ele,i) => {
                  //let splitArray = ele.path.split('.');
                  //if(splitArray.includes(this.splitIdMethod(xpandKey))){
                    let inputEle = eleArry.getElementsByTagName('input')[0];
                    if(inputEle !== undefined){
                      inputEle.checked= true;
                    }
                  //}                    
                  //});
                }
                
              //   // let inputCheckedEle = checkboxEle.getElementsByClassName('checked|'+ele.fieldId)[i].children[0];
              //   // inputCheckedEle.checked =true;
              // }          
              
              //inputCheckedEle.disabled = false;
            } 
           }        
          }
       // }
        });
        
        
      });
    }
  }


  ngOnInit(): void {
    // this.expandedValFor = "";
    //    this.cd.detectChanges();
    this.changeDetectionMethod();
  }
  ngAfterViewInit(){
    this.changeDetectionMethod();
  }

  changeDetectionMethod(){
    setTimeout(() => {      
      this.expandedValForTempSave = this.expandedValFor;
       this.cd.detectChanges();
    },0);
  }
  isPresent(obj,value){   
   let flag = false;
   for (const key in obj) {
    if(obj.hasOwnProperty(value)){
      flag = true;
    }
    
    //flag = this.filterPropertyFromObjMethod(obj[key],value);
    if(Array.isArray(obj[key])){
      //flag = this.isPresent(obj[key][0],value);
      if(obj[key].hasOwnProperty(value)){
        flag = true;
      }
      if(flag) break;
    }else if(typeof(obj[key]) === "object"){      
      if(obj[key].hasOwnProperty(value)){
        flag = true;
      }
      if(flag) break;
    }else{
      flag = this.isPresent(obj[key],value);
    }
    if(flag) break;
   }
   
    return flag;
   }
   
  presentIn1Level(arr, value){
    let flag = false;
   if(arr.hasOwnProperty(value)){
    flag = true;
   }else{

   }
   
   return flag;
   }
  
  filterPropertyFromObjMethod(obj,value){
       let flag = false;
    if(typeof obj !== "object" || obj === null){
      return false;
    }    
    let parentListobj = lodash.keys(this.parentPathofMainObjectSelected);
    let robj = parentListobj.find(x => x.split('[')[0] == value);
    if(obj.hasOwnProperty(value)){
      return flag = true;
    }else if(robj !== undefined){
      return flag =true;
    }
    else{
      for(const key in obj) {
        if(Array.isArray(obj[key])){
          flag = this.isPresent(obj[key][0],value);
          if(flag) break;
        }else if(typeof(obj[key]) === "object"){
          flag = this.isPresent(obj[key],value);
          if(flag) break;
        }
      }
    }
    
    
    //if the value is not fount in the object return false
    return flag;
    }
    convertCharCodeMethod(str,value,className,indx,paretInx,loopIdx) {
      let outputResult = '';
      let subStr = "";     
      let inptStr = str.toString();
      if(Array.isArray(value)){
        subStr = "";
        outputResult = str;
      }else if(typeof(value) === 'object'){
        subStr = "";
        outputResult = str;
      }else if(typeof(value) === 'string' || typeof(value) === 'number' || typeof(value) === 'boolean'){
        let valStr:any = value.toString();
        if(valStr !== undefined){
          subStr = indx+str+loopIdx+paretInx;//+valStr.slice(0,11);
          let input = subStr;
          // output.innerHTML = "";
          for (var i = 0; i < input.length; i++) {
            outputResult += input[i].charCodeAt(0);
          }
        }        
      }      
      else{
        subStr = "";
        outputResult = str;
      }
      if(className === 'cls'){
        outputResult = 'uuid|'+outputResult;
      }
      return [outputResult];
    }
}


