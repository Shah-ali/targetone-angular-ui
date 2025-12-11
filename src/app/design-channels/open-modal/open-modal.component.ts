import { HttpService } from '@app/core/services/http.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef} from '@angular/core';
import { BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { modalData } from "../modalInterface"
import data from 'assets/JSON/dataJson.json';
import imageData from 'assets/JSON/sample.json';
import { GlobalConstants } from '../common/globalConstants';

GlobalConstants.resolveFlag =false;
@Component({
  selector: 'open-modal',
  templateUrl:'./open-modal.component.html',
  styleUrls: ['./open-modal.component.scss']
})

export class OpenModalComponent implements OnInit {
  
  title: string | undefined; contenturl: string | undefined; buttonName: string | undefined;message:any;
  productDataJson: any;
  beeConfigInModal: any;
  productSelected: boolean = false;
  objCh:any = [];
  tempJoin: string[] = [];
  isAddonProduct: boolean = GlobalConstants.isAddOnProductList;
  
  //@Input() public resolveFlag = false;
  @Output() onAdd = new EventEmitter<any>();
  constructor(private bsModalRef: BsModalRef,private modalService: BsModalService, private http: HttpService) {
    // const objData = { title:"Modal popup", contenturl:"https://example.htmlsave.net/page1.html",buttonName:"Save", message:"<h1>Welcom to Angular Popup</h1>"} 
    // this.setModalData(objData);   
    // this.getDataProduct('../../assets/JSON/dataJson.json');
    if(GlobalConstants.isAddOnProductList){
      this.productDataJson = data;
    }else{
      this.productDataJson = imageData;
    console.log(imageData);
    }
    
   }
  
  ngOnInit() {
    
  }
  getDataProduct(_url){
    return this.http.get(_url).subscribe((data) =>{
      return data;      
    });
  }
 setModalData(data: modalData){
 console.log(data);
 this.title = data.title;
 this.contenturl = data.contenturl;
 this.message = data.message;
 this.buttonName = data.buttonName;
  }
  
  checkStatus(_evt,_cid){   debugger; 
    if(_evt.target.checked){
      let indx = this.productDataJson.find(x => x.uid == _cid);
      this.objCh.push(indx);

    }else{
      let ind = this.productDataJson.findIndex(x => x.uid == _cid);
      this.objCh = this.objCh.splice(ind,1);
    }

  }
  insertImagePath(imgObj){
    // addon Images multiple content
    // const valHtml = {
    //   "type": "image",
    //       "value": {
    //         "alt": imgObj.alt,
    //         "href": imgObj.href,
    //         "src": imgObj.src,
    //         "dynamicSrc": ""
    //       },   
    // } 
    // single image content
    const valHtml = {"url": imgObj.src};
    if(Object.keys(valHtml).length != 0){
      GlobalConstants.resolveFlag = true;
    }else{
      GlobalConstants.resolveFlag = false;
  
    }
    this.onClose();
    this.onAdd.emit(valHtml);

  }
  insertProducts(ev){
    const loopData = this.objCh;
    this.objCh.forEach((value,index,array)=>{
      const appeadProdHtml = '<div class="card col-3 col-md-3 col-sm-3"  style="max-width:100%;min-width:31%;float:left;text-align:center;display:inline-block;padding:1em;font-size: 1em;line-height: 20px;" id="items_'+value.uid+'">'+
      '<div style="width:100%;text-align:center;"><img src="'+value.imgsrc+'" class="card-img-top" alt="..." width="100" height="100"></div>'+
      '<div class="card-body" style="padding:5px;">'+
        '<h5 class="card-title" style="text-align:center;font-size:1em;word-break:all">'+value.title+'</h5>'+
        '<p class="card-text" style="text-align:center;font-size:.8em;word-break:all">'+value.content+'</p></div>'+
        '<div style="width:100%;text-align:center;"><button href="#" class="btn btn-primary" style="background: #0076bb;padding: 5px 32px;border: none;border-radius: 5px;margin-top: 10px;color: #FFF;">'+
        value.buttonName+'</button>'+
      '</div>'+
    '</div>';
    this.tempJoin.push(appeadProdHtml);  
   console.log(appeadProdHtml); 

   });
    
const productDets = this.tempJoin.join("");
const htmlStructure = '<div class="container"><div class="col-12 row">'+
productDets
     +'</div></div>'
//const tempJoinObj = this.viewRef.createEmbeddedView(this.injectProductItems);

 const valHtml = {
    "type": "html",
        "value": {
          html: htmlStructure
        },   
  }
  if(Object.keys(valHtml).length != 0){
    GlobalConstants.resolveFlag = true;
  }else{
    GlobalConstants.resolveFlag = false;

  }
  this.onClose();
  this.onAdd.emit(valHtml);
  // this.beeConfigInModal = GlobalConstants.beeConfig;
  // GlobalConstants.args.value = valHtml;
  // this.onClose();
  // setTimeout(() => {
  //   this.beeConfigInModal.contentDialog.addOn.handler(GlobalConstants.resolve,GlobalConstants.resolve,GlobalConstants.args);
  //   },1000);
  
  //GlobalConstants.resolve(valHtml);
  
 // resolveAddon(valHtml);
 //this.beeCompt.showModalDialog(resolve,reject,"",valHtml);
}
  
  onClose() {
    this.bsModalRef.hide();
  }
}