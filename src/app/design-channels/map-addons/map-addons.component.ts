/// <reference types="@types/googlemaps" />
import { Component, OnInit, Renderer2, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { SharedataService } from '@app/core/services/sharedata.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalConstants } from '../common/globalConstants';

@Component({
  selector: 'app-map-addons',
  templateUrl: './map-addons.component.html',
  styleUrls: ['./map-addons.component.scss']
})
export class MapAddonsComponent implements OnInit {
  radius = 2500; // 2.5 km radius in meters
 apiKey = "AIzaSyBAJQ1WtccgydQUNcU1aFqS0hFVEEQmspg";
  defaultLat = "";
  defaultLng = "";
  dynamicLat :any
  dynamicLng :any;
  zoomLevel = 13;
  mapWidth = 600;
  mapHeight = 300;
  mapTypeOptions = ["roadmap", "satellite", "hybrid", "terrain"];
  mapType: string = "roadmap";
  showLoader = false;

  @Output() onAdd = new EventEmitter<any>();

  constructor(
    private bsModalRef: BsModalRef,
    private shareService: SharedataService,
    private renderer: Renderer2
  ) {
    GlobalConstants.parentComponentName = 'MapAddonsComponent';
    this.subscribeToSavedAddOnsJSON();
  }

  ngOnInit(): void {
    // Optionally initialize map or other data here
  }

  subscribeToSavedAddOnsJSON(): void {
    this.shareService.savedAddOnsJSON.subscribe((res: any) => {
      const customFields = res.customFields || {};
      this.dynamicLat = customFields.dynamicLat || this.dynamicLat;
      this.dynamicLng = customFields.dynamicLng || this.dynamicLng;
      this.mapType = customFields.mapType || this.mapType;
    });
  }

  async insertData(): Promise<void> {
    this.showLoader = true;

    const customFields: any = {
      dynamicLat: this.dynamicLat,
      dynamicLng: this.dynamicLng,
      mapType: this.mapType.toLowerCase()
    };

    try {
      this.emitMapData(customFields);
    } catch (error) {
      console.error('Error during map initialization:', error);
    } finally {
      this.showLoader = false;
    }
  }


  emitMapData(customFields: any): void {
    let valHtml;
    let htmlContent;
    const staticMapUrl = `https://www.google.com/maps?q=${customFields.dynamicLat},${customFields.dynamicLng}`
    // Replace curly braces with HTML entity codes
   
    if (customFields.dynamicLat && customFields.dynamicLng) {
      const valHtml = {
        type: "html",
        componentName: "mapAddons",
        value: {
          html: `
         
          <a href="${staticMapUrl}"><img  ng-src="{{ getMapUrl(${customFields.dynamicLat}, ${customFields.dynamicLng},${this.radius},'${this.apiKey}',${this.zoomLevel},${this.mapWidth},${this.mapHeight},'${this.mapType}') }}" alt="Static Map" /></a>
          `,
          customFields: customFields
        }
      };
      console.log(valHtml.value.html);
      this.onClose();
      this.onAdd.emit(valHtml);
    }else {
      htmlContent = `<div style="border: 1px dotted #FFCC00; padding: 10px; margin: 10px;">
                       {{ 'mapsPlugin.configureMaps' | translate }}
                     </div>`;
    }
    valHtml = {
      type: "html",
      componentName: "mapAddons",
      value: {
        html: htmlContent,
        customFields: customFields
      }
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
