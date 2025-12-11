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
  lat = 12.975322424582838;
  lng = 77.59970589694943;
  radius = 5000; // 5 km radius in meters
   markersRendered = false;
   circleRendered = false;
   maprendered = false;
  markers = [
    { lat: 12.974420817536547, lng: 77.61952543120755 }, // Example marker within 5km
    { lat: 12.964132950811655, lng: 77.59935522020646 },
    { lat: 12.976428156553292, lng: 77.55180502065492 }  // Example marker outside 5km
  ];
  apiKey = "AIzaSyBAJQ1WtccgydQUNcU1aFqS0hFVEEQmspg";
  defaultLat = "";
  defaultLng = "";
  dynamicLat: string = '';
  dynamicLng: string = '';
  zoomLevel = 11;
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
    this.shareService.savedAddOnsJSON.subscribe((res: any) => {
      const customFields = res.customFields || {};
      this.defaultLat = customFields.defaultLat || this.defaultLat;
      this.defaultLng = customFields.defaultLng || this.defaultLng;
      this.dynamicLat = customFields.dynamicLat || this.dynamicLat;
      this.dynamicLng = customFields.dynamicLng || this.dynamicLng;
      this.mapType = customFields.mapType || this.mapType;
    });
  }

  ngOnInit(): void {
    // Optionally initialize map or other data here
    
  }

 


  async insertData(): Promise<void> {
    this.showLoader = true;

    const customFields: any = {
      dynamicLat: this.dynamicLat,
      dynamicLng: this.dynamicLng,
      defaultLat: this.defaultLat,
      defaultLng: this.defaultLng,
      mapType: this.mapType.toLowerCase()
    };

    const centerPosition = new google.maps.LatLng(this.lat, this.lng);

    const mapOptions: google.maps.MapOptions = {
      zoom: this.zoomLevel,
      center: centerPosition,
      mapTypeId: google.maps.MapTypeId[this.mapType.toUpperCase()]
    };

    const map = new google.maps.Map(document.getElementById('mapCtr') as HTMLElement, mapOptions);

    // Function to add markers within radius
    const addMarkersWithinRadius = ():  Promise<void> => {
      return new Promise<void>((resolve) => {
        this.markers.forEach(markerData => {
          const markerPosition = new google.maps.LatLng(markerData.lat, markerData.lng);
          const distance = google.maps.geometry.spherical.computeDistanceBetween(centerPosition, markerPosition);

          if (distance <= this.radius) {
            new google.maps.Marker({
              position: markerPosition,
              map: map,
              title: `Marker (${markerData.lat}, ${markerData.lng})`
            });
          }
        });
        resolve();
      }) 
    };

    // Function to add radius circle
   
    const addRadiusCircle = ():  Promise<void> => {
      return new Promise<void>((resolve) => {
        const containerWidthInMeters = (map.getBounds()?.toSpan().lng() || 0) * 111320; // Approximate conversion from degrees to meters

        const adjustedRadius = Math.min(this.radius, containerWidthInMeters / 2);
        const circle = new google.maps.Circle({
          map: map,
          radius: this.radius,
          fillColor: '#FF0000',
          strokeColor: '#FF0000', 
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillOpacity: 0.35,
          center: centerPosition
        });
        resolve();
      });
      
    };

    // Promisified function to wait for map to be idle
    const waitForMapIdle = (): Promise<void> => {
      return new Promise<void>((resolve) => {
        google.maps.event.addListenerOnce(map, 'idle', () => {
          console.log('Map is fully loaded and ready.');
          resolve();
        });
      });
    };

    try {
      await waitForMapIdle();
      await addRadiusCircle();
      await  addMarkersWithinRadius();
     

      // After everything is done, emit valHtml
    setTimeout(() => {
      const valHtml = {
        type: "html",
        componentName:"mapAddons",
        value: {
         html: document.getElementById('mapCtr')?.outerHTML,
        customFields: customFields,
         //map : map,

        },
      };
      console.log(valHtml.value.html);
      this.onClose();
      this.onAdd.emit(valHtml);
    }, 5000);

      
   
    } catch (error) {
      console.error('Error during map initialization:', error);
    } finally {
      this.showLoader = false;
    }
  }
  displayFallbackImage(): void {
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${this.defaultLat},${this.defaultLng}&zoom=${this.zoomLevel}&size=${this.mapWidth}x${this.mapHeight}&maptype=${this.mapType}&key=${this.apiKey}&scale=2&format=png8&sensor=false`;
    const imgElement = document.getElementById("fallbackMapImage") as HTMLImageElement;
    if (imgElement) {
      imgElement.src = mapUrl;
      console.log('mapUrl: ' + mapUrl);
    } else {
      console.error('Image element not found!');
    }
  }

  onClose(): void {
    if (this.bsModalRef) {
      this.bsModalRef.hide();
    }
  }
}
