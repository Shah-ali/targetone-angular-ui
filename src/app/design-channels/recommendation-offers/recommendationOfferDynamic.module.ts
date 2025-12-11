import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecommendationOffersComponent } from './recommendation-offers.component';
import { AgGridModule } from "ag-grid-angular";
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { TranslateModule } from '@ngx-translate/core';
import { CdkDragDropComponent } from '../cdk-drag-drop/cdk-drag-drop.component';
import { BrowserModule } from '@angular/platform-browser';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { DMEOffersComponent } from '../dme-offers/dme-offers.component';
import { ProductRecoAdvanceComponent } from '../product-reco-advance/product-reco-advance.component';
import { TreeviewModule } from 'ngx-treeview';
import { ProductOffersComponent } from '../product-offers/product-offers.component';
import { RemoteGridBindingDirective } from '../product-reco-advance/rowSelectionDataModel';
import { JourneyChooseTemplateLayoutComponent } from '../dme-customer-journey/journey-choose-template-layout/journey-choose-template-layout.component';
import { JourneyCustomerDMEComponent } from '../dme-customer-journey/journey-customer-dme/journey-customer-dme.component';
import { JourneyNonCustomerDMEComponent } from '../dme-non-customer-journey/journey-non-customer-dme/journey-non-customer-dme.component';
import { JourneyProductFiltersComponent } from '../dme-non-customer-journey/journey-product-filters/journey-product-filters.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { utilsCommonModule } from '@app/utils/utils-common.module';

// import { AngularEditorModule } from '@kolkov/angular-editor';
// import { HttpClientModule } from '@angular/common/http';
//BrowserModule, AngularEditorModule, HttpClientModule

@NgModule({
  imports: [ CommonModule, FormsModule,AgGridModule.withComponents([]),NgxSliderModule, TranslateModule, BrowserModule,CodemirrorModule,TreeviewModule.forRoot(),NgSelectModule,utilsCommonModule],
  declarations: [ RecommendationOffersComponent,CdkDragDropComponent,DMEOffersComponent,JourneyChooseTemplateLayoutComponent,JourneyCustomerDMEComponent,JourneyNonCustomerDMEComponent,ProductRecoAdvanceComponent,ProductOffersComponent,RemoteGridBindingDirective,JourneyProductFiltersComponent],
  exports: [ RecommendationOffersComponent ],
  
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
  //schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class RecommendationOfferDynamicModule {}