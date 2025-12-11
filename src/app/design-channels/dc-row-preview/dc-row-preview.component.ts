import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { GlobalConstants } from '../common/globalConstants';
import { AppConstants } from '@app/app.constants';
import { HttpService } from '@app/core/services/http.service';
import { DataService } from '@app/core/services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedataService } from '@app/core/services/sharedata.service';

@Component({
  selector: 'app-dc-row-preview',
  templateUrl: './dc-row-preview.component.html',
  styleUrls: ['./dc-row-preview.component.scss'],
})
export class DcRowPreviewComponent implements OnInit {
  @Input() maxCountVal: any;
  @Input() rowStyleSelected: any;
  @Input() layoutStyleSelected: any;
  noOfCards: any[] = [];
  selectedTab: string = 'tab1';
  @ViewChild('pcardElement') pcardElement!: ElementRef;
  @ViewChild('previewMainContainer', { static: false }) previewMainContainer!: ElementRef;
  isAllPaddingVisible = 'true';
  isAllMarginVisible = 'true';
  isAlreadyLoaded: boolean = false;
  previewContent: string = '';
  styleString: string = '';
  styleLayoutString: string = '';
  showLoader: boolean = true;
  rowContent: any;
  existingStylePropsIn: any;
  paddingOptions: string = 'true';
  marginOptions: string = 'true';

  cardStyles: any = {};
  containerStyles: any = {};
  isResponsiveChecked: boolean = true;
  paddingMarginRange: number[] = Array.from({ length: 15 }, (_, i) => i);
  selectedLayoutClassName: any;
  isMobileView: boolean = false;

  constructor(
    private httpService: HttpService,
    private cdref: ChangeDetectorRef,
    private renderer: Renderer2,
    private dataService: DataService,
    private translate: TranslateService,
    private shareService: SharedataService
  ) {}

  ngOnInit(): void {
    this.noOfCards = Array(parseInt(this.maxCountVal));
    /* this.previewContent =
       '<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#fff"><tbody><tr><td><div class="layoutPR1" style="display:flex;flex-direction:row;flex-wrap:wrap;border:1px solid #eee"><style>.pcard{display:flex;align-items:center;width:300px;padding:15px;background:#fff;border-radius:5px;border:1px solid #e4e4e4;margin:5px;box-shadow:0 4px 8px 0 rgba(96,97,112,.16);flex-direction:column}.pcard table{table-layout:fixed}.pcard .row-content{width:100%!important}.pcard img{display:block;height:auto;border:0;max-width:100px;width:100%;border-radius:5px}.pcard .column-1{width:25%;margin-right:10px}.pcard .column-2{width:75%}.pcard .column-2 .block-1 div{color:#555;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:14px;font-weight:700;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pcard .column-2 .block-2 div{color:#000;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:14px;font-weight:400;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}</style><div class="pcard"><table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#fff"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" ß role="presentation" style="border-radius:0;color:#000;width:500px;margin:0 auto" width="500"><tbody><tr><td class="column column-1" width="33.333333333333336%" style="font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td class="pad" style="width:100%"><div class="alignment" align="center" style="line-height:10px"><img src="https://stat.overdrive.in/wp-content/odgallery/2022/08/63809_2022_Royal_Enfield_Hunter_350_468x263.jpg" style="display:block;height:auto;border:0;max-width:100px;width:100%" width="100"></div></td></tr></table></td><td class="column column-2" width="66.66666666666667%" style="font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td class="pad" style="text-align:center;width:100%"><h1 style="margin:0;color:#555;direction:ltr;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0">Product.ProductName</h1></td></tr></table><table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="word-break:break-word"><tr><td class="pad"><div style="color:#000;direction:ltr;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:14px;font-weight:400;letter-spacing:0;line-height:120%;text-align:center">DESC:13316310</div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table></div><div class="pcard"><table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#fff"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" ß role="presentation" style="border-radius:0;color:#000;width:500px;margin:0 auto" width="500"><tbody><tr><td class="column column-1" width="33.333333333333336%" style="font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td class="pad" style="width:100%"><div class="alignment" align="center" style="line-height:10px"><img src="https://stat.overdrive.in/wp-content/odgallery/2022/08/63809_2022_Royal_Enfield_Hunter_350_468x263.jpg" style="display:block;height:auto;border:0;max-width:100px;width:100%" width="100"></div></td></tr></table></td><td class="column column-2" width="66.66666666666667%" style="font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td class="pad" style="text-align:center;width:100%"><h1 style="margin:0;color:#555;direction:ltr;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0">Product.ProductName</h1></td></tr></table><table class="paragraph_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="word-break:break-word"><tr><td class="pad"><div style="color:#000;direction:ltr;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:14px;font-weight:400;letter-spacing:0;line-height:120%;text-align:center">DESC:13316310</div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table></div></div></td></tr></tbody></table>'; */
  }

  appendHTMLToPreviewContainer() {
    if (this.previewMainContainer) {
      this.previewMainContainer.nativeElement.innerHTML = this.previewContent;
    }
  }

  ngAfterViewInit(): void {
    //this.getRowPreview();
    //this.appendHTMLToPreviewContainer();
  }

  private extractNumericValue(property: string): number {
    return parseInt(property, 10) || 0;
  }

  private convertRGBtoHex(rgbColor: string): string {
    const rgbaValues = rgbColor.match(/\d+/g);
    if (rgbaValues && rgbaValues.length >= 3) {
      const r = parseInt(rgbaValues[0], 10);
      const g = parseInt(rgbaValues[1], 10);
      const b = parseInt(rgbaValues[2], 10);
      return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
    }
    return '';
  }

  private parseBoxShadow(styleType) {
    const targetStyles = styleType === 'cardStyles' ? this.cardStyles : this.containerStyles;
    const boxShadowParts = targetStyles.boxShadow.match(/(-?\d)|rgba?\([\d,.\s]+\)|(\d+\.\d+|\.\d+|\d+)/g);

    if (boxShadowParts && boxShadowParts.length >= 5) {
      targetStyles.boxShadowX = boxShadowParts[1];
      targetStyles.boxShadowY = boxShadowParts[2];
      targetStyles.boxShadowBlur = boxShadowParts[3];
      targetStyles.boxShadowSpread = boxShadowParts[4];

      const transparencyMatch = boxShadowParts[0].match(/0\.\d+/);
      if (transparencyMatch && transparencyMatch.length > 0) {
        let boxShadowTransparency = parseFloat(transparencyMatch[0]);
        targetStyles.boxShadowTransparency = boxShadowTransparency * 100;
      }
      targetStyles.boxShadowColor = this.convertRGBtoHex(boxShadowParts[0]);
    }
  }

  parseBackgroundTrans(styleType) {
    const targetStyles = styleType === 'cardStyles' ? this.cardStyles : this.containerStyles;
    const backgroundParts = targetStyles.background.match(/(-?\d)|rgba?\([\d,.\s]+\)|(\d+\.\d+|\.\d+|\d+)/g);
    if (backgroundParts && backgroundParts[0]) {
      targetStyles.backgroundColor = this.convertRGBtoHex(backgroundParts[0]);
      if (backgroundParts[0].split(',')[3] != undefined) {
        targetStyles.bgTransparency = parseFloat(backgroundParts[0].split(',')[3].trim());
        targetStyles.bgTransparency = targetStyles.bgTransparency * 100;
      }
    }
  }

  private hexToRgba(hex, alpha) {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    alpha = parseFloat(alpha);
    if (isNaN(alpha) || alpha < 0 || alpha > 1) {
      alpha = 1; // Default to fully opaque if alpha is invalid
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  changePaddingOption(val) {
    this.isAllPaddingVisible = val;
    this.paddingOptions = val;
  }

  changeMarginOption(val) {
    this.isAllMarginVisible = val;
    this.marginOptions = val;
  }

  updateProductRange(event: any): void {
    this.noOfCards.length = event.target.value;
    const pcardElement = this.previewMainContainer.nativeElement.querySelectorAll('.pcard');
    pcardElement.forEach((div, index) => {
      if (index < this.noOfCards.length) {
        div.style.display = 'block';
      } else {
        div.style.display = 'none';
      }
    });
  }

  selectTab(tabName: string): void {
    this.selectedTab = tabName;
  }

  updateLayoutStyle() {
    const pLayoutElement = this.previewMainContainer.nativeElement.querySelectorAll('.layout-style');
    const templateWidth = this.previewMainContainer.nativeElement.querySelector('.row-content').getAttribute('width');
    const templateMargin = this.previewMainContainer.nativeElement.querySelector('.row-content').getAttribute('margin');
    const layoutClassName = pLayoutElement[0].className;
    const { containerStyles } = this;

    if (Object.keys(containerStyles).length === 0) {
      return;
    }

    let boxShadow = '0';
    if (this.containerStyles.boxShadowColor != undefined && this.containerStyles.boxShadowTransparency) {
      let boxShadowTransparency = this.containerStyles.boxShadowTransparency / 100;
      const boxShadowWithTransparency = this.hexToRgba(containerStyles.boxShadowColor, boxShadowTransparency);
      boxShadow = `${containerStyles.boxShadowX}px ${containerStyles.boxShadowY}px ${containerStyles.boxShadowBlur}px ${containerStyles.boxShadowSpread}px ${boxShadowWithTransparency}`;
    }

    let layoutBackground = containerStyles.backgroundColor;
    if (this.containerStyles.backgroundColor != undefined) {
      let bgTransparency = this.containerStyles.bgTransparency / 100;
      if (bgTransparency == 0 && layoutBackground != '#000000') {
        bgTransparency = 1;
      }
      layoutBackground = this.hexToRgba(containerStyles.backgroundColor, bgTransparency);
    }

    let styleLayoutProps: any = {
      'flex-direction': containerStyles.flexDirection,
      'flex-wrap': containerStyles.flexWrap,
      'justify-content': containerStyles.justifyContent,
      'align-content': containerStyles.alignContent,
      'align-items': containerStyles.alignItems,
      'border-width': `${containerStyles.borderWidth}px`,
      'border-color': containerStyles.borderColor,
      'border-style': containerStyles.borderStyle,
      'border-radius': `${containerStyles.borderRadius}px`,
      background: layoutBackground,
      'box-shadow': boxShadow,
    };

    styleLayoutProps['width'] = containerStyles.selectedWidthUnit !== 'unset' && containerStyles.width? `${containerStyles.width}${containerStyles.selectedWidthUnit}`: templateWidth+'px';
    styleLayoutProps['height'] = containerStyles.selectedHeightUnit !== 'unset' && containerStyles.height? `${containerStyles.height}${containerStyles.selectedHeightUnit}`: 0;

    if(layoutClassName.includes('layoutPR4')) {
      if(this.isResponsiveChecked) {
        styleLayoutProps['max-width'] = containerStyles.width !== 'unset' && containerStyles.width? `${containerStyles.width}${containerStyles.selectedWidthUnit}`: templateWidth+'px';
      }
    }
    styleLayoutProps['margin'] = templateMargin

    pLayoutElement.forEach((element) => {
      element.removeAttribute('style');
      this.styleLayoutString = 'display: flex';
      element.setAttribute('style', this.styleLayoutString);
    });

    if ((containerStyles.selectedWidthUnit == 'unset' || containerStyles.selectedWidthUnit == undefined) && this.isResponsiveChecked) {
      delete this.containerStyles.width;
      delete styleLayoutProps.width;
      this.containerStyles.selectedWidthUnit = 'unset';
    }

    if (containerStyles.selectedHeightUnit == 'unset' || containerStyles.selectedHeightUnit == undefined) {
      delete this.containerStyles.height;
      delete styleLayoutProps.height;
      this.containerStyles.selectedHeightUnit = 'unset';
    }

    pLayoutElement.forEach((element) => {
      Object.keys(styleLayoutProps).forEach((prop) => {
        this.renderer.setStyle(element, prop, styleLayoutProps[prop]);
      });
    });

    this.styleLayoutString = Object.keys(styleLayoutProps)
      .map((property) => `${property}: ${styleLayoutProps[property]}`)
      .join('; ');

    this.styleLayoutString = `${this.styleLayoutString}; display: flex`;

    if (layoutClassName.includes('layoutPR2')) {
      this.styleLayoutString = this.styleLayoutString + ';overflow: auto';
    }

    if (layoutClassName.includes('layoutPR4') || layoutClassName.includes('layoutPR0')) {
      this.styleLayoutString = this.styleLayoutString + ';margin:0 auto;text-align:center';
    }

    /* if (layoutClassName.includes('layoutPR4')) {
      this.styleLayoutString = this.styleLayoutString + ';display: flex;flex-wrap: wrap';
    }

    if (layoutClassName.includes('layoutPR1')) {
      this.styleLayoutString = this.styleLayoutString + ';display: flex; flex-direction: row; flex-wrap: wrap';
    }

    if (layoutClassName.includes('layoutPR2')) {
      this.styleLayoutString = this.styleLayoutString + ';display: flex; flex-wrap: nowrap; overflow: auto';
    } */
  }

  updateStyle(referFrom?: string) {
    const dynamicElements = this.previewMainContainer.nativeElement.querySelectorAll('.pcard');
    const parentClassName = dynamicElements[0].parentElement.className;
    const { cardStyles, isAllPaddingVisible, isAllMarginVisible } = this;

    if (Object.keys(cardStyles).length === 0) {
      return;
    }

    let boxShadow = '0';
    if (this.cardStyles.boxShadowColor != undefined && this.cardStyles.boxShadowTransparency) {
      let boxShadowTransparency = this.cardStyles.boxShadowTransparency / 100;
      const boxShadowWithTransparency = this.hexToRgba(cardStyles.boxShadowColor, boxShadowTransparency);
      boxShadow = `${cardStyles.boxShadowX}px ${cardStyles.boxShadowY}px ${cardStyles.boxShadowBlur}px ${cardStyles.boxShadowSpread}px ${boxShadowWithTransparency}`;
    }

    if (isAllPaddingVisible === 'true') {
      cardStyles.paddingTop = cardStyles.padding;
      cardStyles.paddingRight = cardStyles.padding;
      cardStyles.paddingBottom = cardStyles.padding;
      cardStyles.paddingLeft = cardStyles.padding;
      cardStyles.paddingUnitAll = cardStyles.paddingUnitAll;
    }

    if (isAllMarginVisible === 'true') {
      cardStyles.marginTop = cardStyles.margin;
      cardStyles.marginRight = cardStyles.margin;
      cardStyles.marginBottom = cardStyles.margin;
      cardStyles.marginLeft = cardStyles.margin;
      cardStyles.marginUnitAll = cardStyles.marginUnitAll;
    }

    let cardBackground = cardStyles.backgroundColor;
    if (this.cardStyles.backgroundColor != undefined) {
      let bgTransparency = this.cardStyles.bgTransparency / 100;
      if (bgTransparency == 0 && cardBackground != '#000000') {
        bgTransparency = 1;
      }
      cardBackground = this.hexToRgba(cardStyles.backgroundColor, bgTransparency);
    }

    let styleProps: any = {
      'border-width': `${cardStyles.borderWidth}px`,
      'border-color': cardStyles.borderColor,
      'border-style': cardStyles.borderStyle,
      'border-radius': `${cardStyles.borderRadius}px`,
      background: cardBackground,
      padding: isAllPaddingVisible && cardStyles.padding > 0 ? `${cardStyles.padding}${cardStyles.paddingUnitAll}` : '0',
      'padding-top':
        isAllPaddingVisible && cardStyles.paddingTop > 0 ? `${cardStyles.paddingTop}${cardStyles.paddingUnitAll}` : '0',
      'padding-right':
        isAllPaddingVisible && cardStyles.paddingRight > 0 ? `${cardStyles.paddingRight}${cardStyles.paddingUnitAll}` : '0',
      'padding-bottom':
        isAllPaddingVisible && cardStyles.paddingBottom > 0
          ? `${cardStyles.paddingBottom}${cardStyles.paddingUnitAll}`
          : '0',
      'padding-left':
        isAllPaddingVisible && cardStyles.paddingLeft > 0 ? `${cardStyles.paddingLeft}${cardStyles.paddingUnitAll}` : '0',
      margin: isAllMarginVisible && cardStyles.margin > 0 ? `${cardStyles.margin}${cardStyles.marginUnitAll}` : '0',
      'margin-top':
        isAllMarginVisible && cardStyles.marginTop > 0 ? `${cardStyles.marginTop}${cardStyles.marginUnitAll}` : '0',
      'margin-right':
        isAllMarginVisible && cardStyles.marginRight > 0 ? `${cardStyles.marginRight}${cardStyles.marginUnitAll}` : '0',
      'margin-bottom':
        isAllMarginVisible && cardStyles.marginBottom > 0 ? `${cardStyles.marginBottom}${cardStyles.marginUnitAll}` : '0',
      'margin-left':
        isAllMarginVisible && cardStyles.marginLeft > 0 ? `${cardStyles.marginLeft}${cardStyles.marginUnitAll}` : '0',
      'box-shadow': boxShadow,
    };

    dynamicElements.forEach((element) => {
      element.removeAttribute('style');
    });

    if (cardStyles.width && cardStyles.selectedWidthUnit) {
      styleProps.width = `${cardStyles.width}${cardStyles.selectedWidthUnit}`;
    }

    if (cardStyles.height && cardStyles.selectedHeightUnit) {
      styleProps.height = `${cardStyles.height}${cardStyles.selectedHeightUnit}`;
    }

    if (parentClassName.includes('layoutPR2')) {
      if (cardStyles.width && cardStyles.selectedWidthUnit) {
        styleProps['min-width'] = `${cardStyles.width}${cardStyles.selectedWidthUnit}`;
      }
      if (cardStyles.height && cardStyles.selectedHeightUnit) {
        styleProps['min-height'] = `${cardStyles.height}${cardStyles.selectedHeightUnit}`;
      }
    }

    if (parentClassName.includes('layoutPR4') && cardStyles.height && cardStyles.selectedHeightUnit) {
      if (cardStyles.width && cardStyles.selectedWidthUnit) {
        styleProps['min-width'] = `${cardStyles.width}${cardStyles.selectedWidthUnit}`;
      }
      styleProps['min-height'] = `${cardStyles.height}${cardStyles.selectedHeightUnit}`;
    }

    if (referFrom == 'fromClearAll') {
      styleProps = {};
      this.styleString = 'min-height: unset; border: none;box-shadow:none;padding:0;margin:0';
      this.cardStyles = {};
      dynamicElements.forEach((element) => {
        element.removeAttribute('style');
        element.setAttribute('style', this.styleString);
      });
    } else {
      dynamicElements.forEach((element) => {
        Object.keys(styleProps).forEach((prop) => {
          this.renderer.setStyle(element, prop, styleProps[prop]);
        });
      });
      this.styleString = Object.keys(styleProps)
        .map((property) => `${property}: ${styleProps[property]}`)
        .join('; ');
    }
  }

  getRowPreview(res) {
    if (this.rowStyleSelected != '') {
      this.styleString = this.rowStyleSelected;
    }
    if (this.layoutStyleSelected != '') {
      this.styleLayoutString = this.layoutStyleSelected;
    }
    this.showLoader = true;

    let requestData = {
      rowContent: res,
    };

    const url = AppConstants.API_END_POINTS.GET_PTAG_ROW_CONFIG_PREVIEW;
    this.httpService.post(url, requestData).subscribe((data) => {
      if (data.response != '' && data.response != null) {
        this.previewContent = data.response;
        if (this.previewMainContainer) {
          this.previewMainContainer.nativeElement.innerHTML = this.previewContent;
        }
        const pcardElement = this.previewMainContainer.nativeElement.querySelector('.pcard');
        const templateWidth = this.previewMainContainer.nativeElement.querySelector('.row-content').getAttribute('width');
        if (this.rowStyleSelected != '') {
          pcardElement.setAttribute('style', this.rowStyleSelected);
        }
        if(pcardElement !== null){

        const computedStyles = window.getComputedStyle(pcardElement);
        this.cardStyles = {
          borderStyle: computedStyles.getPropertyValue('border-style'),
          borderColor: this.convertRGBtoHex(computedStyles.getPropertyValue('border-color')),
          borderWidth: this.extractNumericValue(computedStyles.getPropertyValue('border-width')),
          borderRadius: this.extractNumericValue(computedStyles.getPropertyValue('border-radius')),
          background: computedStyles.getPropertyValue('background'),
          padding: this.extractNumericValue(pcardElement.style.padding),
          paddingTop: this.extractNumericValue(pcardElement.style.paddingTop),
          paddingRight: this.extractNumericValue(pcardElement.style.paddingRight),
          paddingBottom: this.extractNumericValue(pcardElement.style.paddingBottom),
          paddingLeft: this.extractNumericValue(pcardElement.style.paddingLeft),
          margin: this.extractNumericValue(computedStyles.getPropertyValue('margin')),
          marginTop: this.extractNumericValue(computedStyles.getPropertyValue('margin-top')),
          marginRight: this.extractNumericValue(computedStyles.getPropertyValue('margin-right')),
          marginBottom: this.extractNumericValue(computedStyles.getPropertyValue('margin-bottom')),
          marginLeft: this.extractNumericValue(computedStyles.getPropertyValue('margin-left')),
          boxShadow: computedStyles.getPropertyValue('box-shadow'),
        };
        this.parseBoxShadow('cardStyles');
        this.parseBackgroundTrans('cardStyles');

        if (pcardElement.style.width) {
          let widthMatch = pcardElement.style.width.match(/^(\d+(\.\d+)?)(%|px)$/i);
          this.cardStyles.width = widthMatch[1];
          this.cardStyles.selectedWidthUnit = widthMatch[3];
        }

        if (pcardElement.style.height) {
          let heightMatch = pcardElement.style.height.match(/^(\d+(\.\d+)?)(%|px)$/i);
          this.cardStyles.height = heightMatch[1];
          this.cardStyles.selectedHeightUnit = heightMatch[3];
        }

        const { paddingTop, paddingRight, paddingBottom, paddingLeft, padding } = pcardElement.style;
        if (padding) {
          if (paddingTop == paddingRight && paddingRight == paddingBottom && paddingBottom == paddingLeft) {
            const paddingMatch = padding.match(/^(\d+(\.\d+)?)(%|px)$/i);
            this.cardStyles.padding = paddingMatch[1];
            this.cardStyles.paddingUnitAll = paddingMatch[3];
            this.changePaddingOption('true');
          } else {
            const paddingMatch = paddingTop.match(/^(\d+(\.\d+)?)(%|px)$/i);
            this.cardStyles.paddingUnitAll = paddingMatch[3];
            this.changePaddingOption('false');
          }

          this.cardStyles.paddingTop = this.extractNumericValue(paddingTop);
          this.cardStyles.paddingRight = this.extractNumericValue(paddingRight);
          this.cardStyles.paddingBottom = this.extractNumericValue(paddingBottom);
          this.cardStyles.paddingLeft = this.extractNumericValue(paddingLeft);
        }

        const { marginTop, marginRight, marginBottom, marginLeft, margin } = pcardElement.style;
        if (margin) {
          if (marginTop == marginRight && marginRight == marginBottom && marginBottom == marginLeft) {
            const marginMatch = margin.match(/^(\d+(\.\d+)?)(%|px)$/i);
            this.cardStyles.margin = marginMatch[1];
            this.cardStyles.marginUnitAll = marginMatch[3];
            this.changeMarginOption('true');
          } else {
            const marginMatch = marginTop.match(/^(\d+(\.\d+)?)(%|px)$/i);
            this.cardStyles.marginUnitAll = marginMatch[3];
            this.changeMarginOption('false');
          }
          this.cardStyles.marginTop = this.extractNumericValue(marginTop);
          this.cardStyles.marginRight = this.extractNumericValue(marginRight);
          this.cardStyles.marginBottom = this.extractNumericValue(marginBottom);
          this.cardStyles.marginLeft = this.extractNumericValue(marginLeft);
        }

        const existingStyleProps: any = {
          'border-width': computedStyles.getPropertyValue('border-width'),
          'border-color': this.convertRGBtoHex(computedStyles.getPropertyValue('border-color')),
          'border-style': computedStyles.getPropertyValue('border-style'),
          'border-radius': computedStyles.getPropertyValue('border-radius'),
          background: computedStyles.getPropertyValue('background'),

          padding: this.cardStyles.padding > 0 ? `${this.cardStyles.padding}${this.cardStyles.selectedWidthUnit}` : '0',
          'padding-top': this.cardStyles.paddingTop > 0 ? `${this.cardStyles.paddingTop}${this.cardStyles.paddingUnitAll}` : '0',
          'padding-right': this.cardStyles.paddingRight > 0
            ? `${this.cardStyles.paddingRight}${this.cardStyles.paddingUnitAll}`
            : '0',
          'padding-bottom': this.cardStyles.paddingBottom > 0
            ? `${this.cardStyles.paddingBottom}${this.cardStyles.paddingUnitAll}`
            : '0',
          'padding-left': this.cardStyles.paddingLeft > 0
            ? `${this.cardStyles.paddingLeft}${this.cardStyles.paddingUnitAll}`
            : '0',

          margin: this.cardStyles.margin > 0 ? `${this.cardStyles.margin}${this.cardStyles.marginUnitAll}` : '0',
          'margin-top': this.cardStyles.marginTop > 0 ? `${this.cardStyles.marginTop}${this.cardStyles.marginUnitAll}` : '0',
          'margin-right': this.cardStyles.marginRight > 0
            ? `${this.cardStyles.marginRight}${this.cardStyles.marginUnitAll}`
            : '0',
          'margin-bottom': this.cardStyles.marginBottom > 0
            ? `${this.cardStyles.marginBottom}${this.cardStyles.marginUnitAll}`
            : '0',
          'margin-left': this.cardStyles.marginLeft > 0 ? `${this.cardStyles.marginLeft}${this.cardStyles.marginUnitAll}` : '0',
          'box-shadow': computedStyles.getPropertyValue('box-shadow'),
        };

        if (this.cardStyles.width) {
          existingStyleProps.width = `${this.cardStyles.width}${this.cardStyles.selectedWidthUnit}`;
        }
        if (this.cardStyles.height) {
          existingStyleProps.height = `${this.cardStyles.height}${this.cardStyles.selectedHeightUnit}`;
        }

        this.existingStylePropsIn = JSON.stringify(this.cardStyles);
        
        this.styleString = Object.keys(existingStyleProps)
          .map((property) => `${property}: ${existingStyleProps[property]}`)
          .join('; ');
      }
        const pLayoutElement = this.previewMainContainer.nativeElement.querySelector('.layout-style');
        const layoutClassName = pLayoutElement.className;

        /* const match = this.rowContent.match(/freestyle="(true|false)"/); // Layout is freestyle or not
        const freestyle = match ? match[1] === "true" : false; */
        
        if(layoutClassName.includes('layoutPR0')) {
          this.selectTab('tab2');
          this.selectedLayoutClassName = 'layoutPR0';
          this.isResponsiveChecked = false;
        } else {
          this.selectTab('tab1');
          this.selectedLayoutClassName = '';
          this.isResponsiveChecked = true;
        }
        if(pLayoutElement !== null){
        const layoutClassName = pLayoutElement.className;
        if (this.layoutStyleSelected != '') {
          pLayoutElement.setAttribute('style', this.layoutStyleSelected);
        }

        const computedLayoutStyles = window.getComputedStyle(pLayoutElement);
        this.containerStyles = {
          flexDirection: computedLayoutStyles.getPropertyValue('flex-direction'),
          flexWrap: computedLayoutStyles.getPropertyValue('flex-wrap'),
          justifyContent: computedLayoutStyles.getPropertyValue('justify-content'),
          alignItems: computedLayoutStyles.getPropertyValue('align-items'),
          alignContent: computedLayoutStyles.getPropertyValue('align-content'),
          borderStyle: computedLayoutStyles.getPropertyValue('border-style'),
          borderColor: this.convertRGBtoHex(computedLayoutStyles.getPropertyValue('border-color')),
          borderWidth: this.extractNumericValue(computedLayoutStyles.getPropertyValue('border-width')),
          borderRadius: this.extractNumericValue(computedLayoutStyles.getPropertyValue('border-radius')),
          boxShadow: computedLayoutStyles.getPropertyValue('box-shadow'),
          background: computedLayoutStyles.getPropertyValue('background'),
        };

        this.parseBoxShadow('containerStyles');
        this.parseBackgroundTrans('containerStyles');

        if (pLayoutElement.style.width && pLayoutElement.style.width != 'unset') {
          let widthMatch = pLayoutElement.style.width.match(/^(\d+(\.\d+)?)(%|px)$/i);
          this.containerStyles.width = widthMatch[1];
          this.containerStyles.selectedWidthUnit = widthMatch[3];
        }

        if (pLayoutElement.style.height && pLayoutElement.style.height != 'unset') {
          let heightMatch = pLayoutElement.style.height.match(/^(\d+(\.\d+)?)(%|px)$/i);
          this.containerStyles.height = heightMatch[1];
          this.containerStyles.selectedHeightUnit = heightMatch[3];
        }

        const existingLayoutStyleProps: any = {
          'flex-direction': computedLayoutStyles.getPropertyValue('flex-direction'),
          'flex-wrap': computedLayoutStyles.getPropertyValue('flex-wrap'),
          'justify-content': computedLayoutStyles.getPropertyValue('justify-content'),
          'align-content': computedLayoutStyles.getPropertyValue('align-content'),
          'align-items': computedLayoutStyles.getPropertyValue('align-items'),
          'border-width': computedLayoutStyles.getPropertyValue('border-width'),
          'border-color': this.convertRGBtoHex(computedLayoutStyles.getPropertyValue('border-color')),
          'border-style': computedLayoutStyles.getPropertyValue('border-style'),
          'border-radius': computedLayoutStyles.getPropertyValue('border-radius'),
          'box-shadow': computedLayoutStyles.getPropertyValue('box-shadow'),
          background: computedLayoutStyles.getPropertyValue('background'),
        };

        existingLayoutStyleProps['width'] = this.containerStyles.selectedWidthUnit !== 'unset' && this.containerStyles.width? `${this.containerStyles.width}${this.containerStyles.selectedWidthUnit}`: templateWidth+'px';
        existingLayoutStyleProps['height'] = this.containerStyles.selectedHeightUnit !== 'unset' && this.containerStyles.height? `${this.containerStyles.height}${this.containerStyles.selectedHeightUnit}`: 0;

        if(layoutClassName.includes('layoutPR4')) {
          if(this.isResponsiveChecked) {
            existingLayoutStyleProps['max-width'] = this.containerStyles.selectedWidthUnit !== 'unset' && this.containerStyles.width? `${this.containerStyles.width}${this.containerStyles.selectedWidthUnit}`: templateWidth+'px';
            delete existingLayoutStyleProps.width;
          } 
        }

        this.isResponsiveChecked = this.containerStyles.flexWrap === 'wrap' && (this.containerStyles.width == 'unset' || this.containerStyles.width == undefined);

        if ((pLayoutElement.style.selectedWidthUnit == 'unset' || pLayoutElement.style.selectedWidthUnit == undefined) && this.isResponsiveChecked) {
          delete existingLayoutStyleProps.width;
        }
        if (pLayoutElement.style.selectedHeightUnit == 'unset' || pLayoutElement.style.selectedHeightUnit == undefined) {
          delete existingLayoutStyleProps.height;
        }

        this.styleLayoutString = Object.keys(existingLayoutStyleProps)
          .map((property) => `${property}: ${existingLayoutStyleProps[property]}`)
          .join('; ');

        this.styleLayoutString = this.styleLayoutString + ';display: flex';

        if (layoutClassName.includes('layoutPR2')) {
          this.styleLayoutString = this.styleLayoutString + ';overflow: auto';
        }

        if (layoutClassName.includes('layoutPR4') || layoutClassName.includes('layoutPR0')) {
          this.styleLayoutString = this.styleLayoutString + ';margin:0 auto;text-align: center';
        }

        /* if (layoutClassName.includes('layoutPR4')) {
          this.styleLayoutString = this.styleLayoutString + ';display: flex;flex-wrap: wrap';
        }

        if (layoutClassName.includes('layoutPR1')) {
          this.styleLayoutString = this.styleLayoutString + ';display: flex; flex-direction: row; flex-wrap: wrap';
        }

        if (layoutClassName.includes('layoutPR2')) {
          this.styleLayoutString = this.styleLayoutString + ';display: flex; flex-wrap: nowrap; overflow: auto';
        } */
      }
        this.showLoader = false;
        this.cdref.detectChanges();
      } else {
        this.showLoader = false;
        this.dataService.SwalValidationMsg(
          this.translate.instant('designEditor.rowPreview.validationMessages.responseEmpty')
        );
        return;
      }
    });
  }

  factoryReset() {
    this.cardStyles = JSON.parse(this.existingStylePropsIn);
    this.updateStyle('fromFactoryReset');
  }

  clearAllStyles() {
    this.cardStyles = JSON.parse(this.existingStylePropsIn);
    this.updateStyle('fromClearAll');
  }

  selectFlexProperty(type, property) {
    if (this.containerStyles[type] != property) {
      this.containerStyles[type] = property;
    } else {
      this.containerStyles[type] = 'normal';
    }
    this.updateLayoutStyle();
  }

  onCheckboxChange(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      this.isResponsiveChecked = event.target.checked;
      if(this.isResponsiveChecked) {
        this.containerStyles.width = 'unset';
        this.containerStyles.selectedWidthUnit = 'unset';
      }
      if (this.isResponsiveChecked) {
        this.selectFlexProperty('flexWrap', 'wrap');
      } else {
        this.selectFlexProperty('flexWrap', 'nowrap');
      }
    }
  }
}
