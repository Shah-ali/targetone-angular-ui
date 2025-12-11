import { LOCALE_ID, NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TreeviewModule } from 'ngx-treeview';
import { ApiPersonalizationComponent } from './api-personalization/api-personalization.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CacheControlComponent } from './cache-control/cache-control.component';
import { PersonalizedTagEditorComponent } from './personalizedTag-editor/personalizedTag-editor.component';
import { SaveAndPublishTagsComponent } from './save-and-publish-tags/save-and-publish-tags.component';
import { SavedPersonalizedTagsComponent } from './saved-personalized-tags/saved-personalized-tags.component';
import { SimulateTagParamtersComponent } from './simulate-tag-paramters/simulate-tag-paramters.component';
import { TagFailsafeComponent } from './tag-failsafe/tag-failsafe.component';
import { TagResponseParamtersComponent } from './tag-response-paramters/tag-response-paramters.component';
import { InitialPersonalizationPageComponent } from './initial-personalization-page/initial-personalization-page.component';
import { BeeEditorGlobalComponent } from './bee-editor-global/bee-editor-global.component';
import { utilsCommonModule } from '@app/utils/utils-common.module';
import { AgGridModule } from 'ag-grid-angular';
import { ChooseLayoutTemplateComponent } from './dme-customer-noncustomer/choose-layout-template/choose-layout-template.component';
import { DMENonCustomerComponent } from './dme-customer-noncustomer/dme-non-customer/dme-non-customer.component';
import { DMECustomerComponent } from './dme-customer-noncustomer/dme-customer/dme-customer.component';
import { ListViewComponent } from './PTag-All-Dashboards/list-view/list-view.component';
import { GraphViewComponent } from './PTag-All-Dashboards/graph-view/graph-view.component';
import { BarChartSimpleComponent } from '@app/shared/ptagDashboard_charts/components/charts/bar-chart-simple/bar-chart-simple.component';
import { DrawerComponent } from '@app/shared/ptagDashboard_charts/components/drawer/drawer.component';
import { LocationChartComponent } from '@app/shared/ptagDashboard_charts/components/charts/location-chart/location-chart.component';
import { TrendChartComponent } from '@app/shared/ptagDashboard_charts/components/charts/trend-chart/trend-chart.component';
import { BarChartMultiSeriesComponent } from '@app/shared/ptagDashboard_charts/components/charts/bar-chart-multi-series/bar-chart-multi-series.component';
import { MultiSelectDropdownComponent } from '@app/shared/ptagDashboard_charts/components/multi-select-dropdown/multi-select-dropdown.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { SummarizedViewComponent } from './PTag-All-Dashboards/summarized-view/summarized-view.component';
import { TagsChartComponent } from '@app/shared/ptagDashboard_charts/components/charts/tags-chart/tags-chart.component';
import { ViewSimulateLogConsoleComponent } from './view-simulate-log-console/view-simulate-log-console.component';
import { ProductFiltersGlobalComponent } from '@app/utils/product-filters-global/product-filters-global.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ViewSimulateDeeplinkComponent } from './view-simulate-deeplink/view-simulate-deeplink.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OwlDateTimeIntl } from 'ng-pick-datetimex';
import { InlineJSComponent } from './inline-js/inline-js.component';
import { UseInlineFuncComponent } from './use-inline-func/use-inline-func.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { NumberToArrayPipe } from '@app/core/pipes/numberToArray.pipe';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ImageQualitySettingsComponent } from './image-quality-settings/image-quality-settings.component';
import { GrapesjsComponent } from '@app/grapesjs/grapesjs/grapesjs.component';
import { DataLayerComponent } from '@app/grapesjs/data-layer/data-layer.component';

@Injectable()
export class DefaultIntl extends OwlDateTimeIntl {
  cancelBtnLabel: string;
  setBtnLabel: string;

  constructor(private translate: TranslateService) {
    super();
    this.cancelBtnLabel = this.translate.instant('cancel');
    this.setBtnLabel = this.translate.instant('set');
  }
}
@NgModule({
  declarations: [
    NumberToArrayPipe,
    ApiPersonalizationComponent,
    BeeEditorGlobalComponent,
    PersonalizedTagEditorComponent,
    TagResponseParamtersComponent,
    SimulateTagParamtersComponent,
    CacheControlComponent,
    TagFailsafeComponent,
    SavedPersonalizedTagsComponent,
    SaveAndPublishTagsComponent,
    InitialPersonalizationPageComponent,
    ChooseLayoutTemplateComponent,
    DMENonCustomerComponent,
    DMECustomerComponent,
    ListViewComponent,
    GraphViewComponent,
    BarChartSimpleComponent,
    TagsChartComponent,
    DrawerComponent,
    LocationChartComponent,
    TrendChartComponent,
    BarChartMultiSeriesComponent,
    MultiSelectDropdownComponent,
    SummarizedViewComponent,
    ViewSimulateLogConsoleComponent,
    ProductFiltersGlobalComponent,
    ViewSimulateDeeplinkComponent,
    InlineJSComponent,
    UseInlineFuncComponent,
    ImageQualitySettingsComponent,
    GrapesjsComponent,
    DataLayerComponent
    ],
  imports: [
    RouterModule,
    CommonModule,
    TranslateModule,
    AgGridModule,
    BrowserModule,
    FormsModule,
    NgbModule,
    TreeviewModule,
    utilsCommonModule,
    NgSelectModule,
    NgbDatepickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CodemirrorModule,
    AngularSvgIconModule.forRoot(),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  providers: [{ provide: OwlDateTimeIntl, useClass: DefaultIntl }, TranslateService],
})
export class PersonalizationTagsModule {}
