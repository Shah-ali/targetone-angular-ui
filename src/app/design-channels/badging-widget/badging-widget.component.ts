import {
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
  Output
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalConstants } from '../common/globalConstants';

@Component({
  selector: 'app-badging-widget',
  templateUrl: './badging-widget.component.html',
  styleUrls: ['./badging-widget.component.scss']
})
export class BadgingWidgetComponent implements OnInit {
  @ViewChild('progressWrapper') progressWrapperRef!: ElementRef;

  activeTab: 'messagestyling' | 'displaysettings' = 'messagestyling';

  badge: any;
  public badgeHTML: string = '';
  showAboveBelow = false;
  showPreview = true;

  @Output() onAdd = new EventEmitter<any>();
  @Output() onLiveUpdate = new EventEmitter<any>();

  constructor(public bsModalRef: BsModalRef) {
    GlobalConstants.parentComponentName = 'BadgingWidgetComponent';
  }

  private getDefaultBadge() {
    return {
      icon: '',
      message: '',
      bgColor: '#E9C6C6',
      fontColor: '#E02323',
      borderColor: '#E02323',
      borderRadius: 15,
      fontSize: 15,
      fontStyle: 'normal',
      rotation: 0,
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
  }

  ngOnInit(): void {
    if (this.bsModalRef) {
      this.bsModalRef.setClass('badging-widget-modal');
    }
    this.badge = this.getDefaultBadge();

    this.showAboveBelow = false;
    this.showPreview = true;
  }

  setTab(tab: 'messagestyling' | 'displaysettings') {
    this.activeTab = tab;
  }

  updateLivePreview() {
    const previewHTML = this.generateBadgeHTML();
    this.onLiveUpdate.emit(previewHTML);
  }

  generateBadgeHTML(): string {
    let positionCSS = '';

    if (this.badge.position === 'overlay') {
      positionCSS = `position:absolute;top:${this.badge.marginTop}px;left:${this.badge.marginLeft}px;z-index:10;`;
    } else if (this.badge.position === 'above') {
      positionCSS = `position:absolute;top:0;left:0;z-index:9999;`;
    } else if (this.badge.position === 'below') {
      positionCSS = `position:absolute;bottom:0;left:0;z-index:9999;`;
    }

    return `
      <div style="
        display:inline-flex;
        align-items:center;
        gap:6px;
        background-color:${this.badge.bgColor};
        color:${this.badge.fontColor};
        border:1px solid ${this.badge.borderColor};
        border-radius:0 ${this.badge.borderRadius}px ${this.badge.borderRadius}px 0;
        font-size:${this.badge.fontSize}px;
        font-style:${this.badge.fontStyle};
        transform: rotate(${this.badge.rotation}deg);
        transform-origin: center;
        font-weight:${this.badge.fontStyle === 'bold' ? 'bold' : 'normal'};
        padding:${this.badge.paddingTop}px ${this.badge.paddingRight}px ${this.badge.paddingBottom}px ${this.badge.paddingLeft}px;
        margin:${this.badge.marginTop}px ${this.badge.marginRight}px ${this.badge.marginBottom}px ${this.badge.marginLeft}px;
        ${positionCSS}
      ">
        ${this.badge.icon ? `<img src="${this.badge.icon}" style="width:16px;height:16px;">` : ''}
        <span>${this.badge.message || '80 People Viewed Today'}</span>
      </div>
    `.trim();
  }

  onClose(): void {
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
  }
  insertData(): void {
    this.badge.borderRadius = Math.abs(this.badge.borderRadius);

    const finalHTML = this.generateBadgeHTML();

    const valHtml = {
      type: 'html',
      componentName: 'BadgingWidget',
      value: {
        html: finalHTML,
        savedState: { ...this.badge }
      }
    };

    this.onAdd.emit(valHtml);
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
  }
}
