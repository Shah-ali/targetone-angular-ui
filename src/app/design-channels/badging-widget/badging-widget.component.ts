import { Component, EventEmitter, OnInit, ViewChild, ElementRef, Output } from '@angular/core';
import { SharedataService } from '@app/core/services/sharedata.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalConstants } from '../common/globalConstants';
import { DataService } from '@app/core/services/data.service';

@Component({
  selector: 'app-badging-widget',
  templateUrl: './badging-widget.component.html',
  styleUrls: ['./badging-widget.component.scss']
})
export class BadgingWidgetComponent implements OnInit {
  @ViewChild('progressWrapper') progressWrapperRef!: ElementRef;

  activeTab: 'messagestyling' | 'displaysettings' = 'messagestyling';

  badge = {
    icon: '',
    message: '',
    bgColor: '#E9C6C6',
    fontColor: '#E02323',
    borderColor: '#E02323',
    borderRadius: 30,
    fontSize: 14,
    fontStyle: 'normal',
    position: 'overlay',
    marginTop: 6,
    marginRight: 6,
    marginBottom: 6,
    marginLeft: 6,
    paddingTop: 6,
    paddingRight: 6,
    paddingBottom: 6,
    paddingLeft: 6
  };

  productImages: string[] = [
    './assets/images/productimage.png',
    './assets/images/2ndimage.png',
    './assets/images/3rdimage.png'
  ];

  public badgeHTML: string = '';
  isVisible: boolean = true;
  savedState: any = {};
  showAboveBelow = false;

  @Output() onAdd = new EventEmitter<any>();

  constructor(
    public bsModalRef: BsModalRef,
    private shareService: SharedataService,
    private dataService: DataService
  ) {
    GlobalConstants.parentComponentName = 'BadgingWidgetComponent';
  }

ngOnInit(): void {
  const saved = localStorage.getItem('badgeConfig');
  if (saved) {
    this.savedState = JSON.parse(saved);
    Object.assign(this.badge, this.savedState);
    this.badge.borderRadius = Math.abs(this.badge.borderRadius);
  }
  this.showAboveBelow = false;
  this.badge.position = 'above';
}


  setTab(tab: 'messagestyling' | 'displaysettings') {
    this.activeTab = tab;
  }

  getBadgeStyle(isOverlay: boolean = false) {
    const style: any = {
      backgroundColor: this.badge.bgColor,
      color: this.badge.fontColor,
      borderColor: this.badge.borderColor,
      borderRadius: `0 ${this.badge.borderRadius}px ${this.badge.borderRadius}px 0`,
      fontSize: `${this.badge.fontSize}px`,
      fontStyle: this.badge.fontStyle === 'italic' ? 'italic' : 'normal',
      fontWeight: this.badge.fontStyle === 'bold' ? 'bold' : 'normal',
      padding: `${this.badge.paddingTop}px ${this.badge.paddingRight}px ${this.badge.paddingBottom}px ${this.badge.paddingLeft}px`,
      margin: `${this.badge.marginTop}px ${this.badge.marginRight}px ${this.badge.marginBottom}px ${this.badge.marginLeft}px`,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    };

  if (this.badge.position === 'overlay') {
    style.position = 'absolute';
    style.top = `${this.badge.marginTop}px`;
    style.left = `${this.badge.marginLeft}px`;
    style.zIndex = 10;
  } 
  else if (this.badge.position === 'above') {
    style.position = 'absolute';
    style.top = '0';
    style.left = '0';
    style.zIndex = 9999;
  } 
  else if (this.badge.position === 'below') {
    style.position = 'absolute';
    style.bottom = '0';
    style.left = '0';
    style.zIndex = 9999;
  } 
  else {
    style.position = 'relative';
  }

  return style;
}

  isMergeTag(value: any): boolean {
    return typeof value === 'string' && value.includes('{') && value.includes('}');
  }

  public onClose(): void {
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
  }

  public insertData(): void {
  this.badge.borderRadius = Math.abs(this.badge.borderRadius);
  this.savedState = { ...this.badge };
  localStorage.setItem('badgeConfig', JSON.stringify(this.savedState));

 try {

  let positionCSS = '';

  if (this.badge.position === 'overlay') {
    positionCSS = `position: absolute; top: ${this.badge.marginTop}px; left: ${this.badge.marginLeft}px; z-index: 10;`;
  } else if (this.badge.position === 'above') {
    positionCSS = `position: absolute; top: 0; left: 0; z-index: 9999;`;
  } else if (this.badge.position === 'below') {
    positionCSS = `position: absolute; bottom: 0; left: 0; z-index: 9999;`;
  } else {
    positionCSS = `position: relative;`;
  }

  const finalHTML = `
    <div style="
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: ${this.badge.bgColor};
      color: ${this.badge.fontColor};
      border: 1px solid ${this.badge.borderColor};
      border-radius: 0 ${this.badge.borderRadius}px ${this.badge.borderRadius}px 0;
      font-size: ${this.badge.fontSize}px;
      font-style: ${this.badge.fontStyle === 'italic' ? 'italic' : 'normal'};
      font-weight: ${this.badge.fontStyle === 'bold' ? 'bold' : 'normal'};
      padding: ${this.badge.paddingTop}px ${this.badge.paddingRight}px ${this.badge.paddingBottom}px ${this.badge.paddingLeft}px;
      margin: ${this.badge.marginTop}px ${this.badge.marginRight}px ${this.badge.marginBottom}px ${this.badge.marginLeft}px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      ${positionCSS}
    ">
      ${this.badge.icon ? `<img src="${this.badge.icon}" alt="icon" style="width:16px;height:16px;">` : ''}
      <span>${this.badge.message || '80 People Viewed Today'}</span>
    </div>
  `.trim();

  const valHtml = {
    type: 'html',
    componentName: 'BadgingWidget',
    value: {
      html: finalHTML,
      savedState: this.savedState,
    },
  };

  this.onAdd.emit(valHtml);
  if (this.bsModalRef) this.bsModalRef.hide();
} catch (error) {
  console.error('Error generating badge:', error);
}
  }
}