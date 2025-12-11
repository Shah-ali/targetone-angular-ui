import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EmailTemplatesComponent } from '@app/design-channels/email-templates/email-templates.component';
import { ChannelsComponent } from '@app/design-channels/channels/channels.component';
import { FailsafeComponent } from '@app/design-channels/failsafe/failsafe.component';
import { BeeEditorComponent } from '@app/design-channels/bee-editor/bee-editor.component';
import { SaveEmailComponent } from '@app/design-channels/save-email/save-email.component';
import { SaveUserRowsComponent } from '@app/design-channels/save-user-rows/save-user-rows.component';
import { SubjectlineComponent } from '@app/design-channels/subjectline/subjectline.component';
import { OpenModalComponent } from '@app/design-channels/open-modal/open-modal.component';
import { TestEmailComponent } from '@app/design-channels/test-email/test-email.component';
import { MergeTagsComponent } from '@app/design-channels/merge-tags/merge-tags.component';
import { AttachEmailComponent } from '@app/design-channels/attach-email/attach-email.component';
import { OffersComponent } from '@app/design-channels/offers/offers.component';
import { TriggerAnalyticsComponent } from '@app/design-channels/trigger-analytics/trigger-analytics.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import * as echarts from 'echarts/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { TemplateLibraryComponent } from '@app/design-channels/template-library/template-library.component';
import { SanitizeHtmlPipe } from '@app/core/pipes/sanitizeHtml.pipe';
import { RecommendationModule } from './recommendation/recommendation.module';
import { RecommendationOfferDynamicModule } from './recommendation-offers/recommendationOfferDynamic.module';
import { PreviewOnClientComponent } from './preview-on-client/preview-on-client.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { DesignPageComponent } from './design-page/design-page.component';
import { MobilePushComponent } from './mobile-push/mobile-push.component';
import { OffersDrawerComponent } from './offers-drawer/offers-drawer.component';
import { TranslateModule } from '@ngx-translate/core';
import { WebPushComponent } from './web-push/web-push.component';
import { InappChannelComponent } from './inapp-channel/inapp-channel.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { DmChannelComponent } from './dm-channel/dm-channel.component';
import { DmFreeTextComponent } from './dm-free-text/dm-free-text.component';
import { DmColumnarComponent } from './dm-columnar/dm-columnar.component';
import { SmsChannelComponent } from './sms-channel/sms-channel.component';
import { FacebookChannelComponent } from './facebook-channel/facebook-channel.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AgGridCheckboxSelectComponent } from './product-reco-advance/ag-grid-checkbox-select.component';
import { DisplayConditionComponent } from './display-condition/display-condition.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { FullPreviewAddonsComponent } from './full-preview-addons/full-preview-addons.component';
import { TreeviewModule } from 'ngx-treeview';
import { RatingsComponent } from './ratings/ratings.component';
import { utilsCommonModule } from '@app/utils/utils-common.module';
import { DcRowPreviewComponent } from './dc-row-preview/dc-row-preview.component';
import { GlobalMergeTagsComponent } from './global-merge-tags/global-merge-tags.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ApiChannelComponent } from './api-channel/api-channel.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { WhatsAppChannelComponent } from './whats-app-channel/whats-app-channel.component';
import { MapAddonsComponent } from './map-addons/map-addons.component';
import { TextAddonsComponent } from './text-addons/text-addons.component';
import { CustomTreeExpandMergeTagComponent } from '@app/utils/custom-tree-expand-merge-tag/custom-tree-expand-merge-tag.component';
import { ImageAddonsComponent } from './image-addons/image-addons.component';
import { StackedBarComponent } from './stacked-bar/stacked-bar.component';
import { EnsembleAIComponent } from './ensemble-ai/ensemble-ai.component';
import { ActiveContentComponent } from './active-content/active-content.component';
import { PtagDetailsComponent } from './ptag-details/ptag-details.component';
import { BadgingWidgetComponent } from './badging-widget/badging-widget.component';
import { NgxAngularQueryBuilderModule } from 'ngx-angular-query-builder';
import { OfferDrawerModule } from './offers-drawer/offers-drawer.module';

@NgModule({
  declarations: [
    EmailTemplatesComponent,
    ChannelsComponent,
    FailsafeComponent,
    BeeEditorComponent,
    SaveEmailComponent,
    SaveUserRowsComponent,
    SubjectlineComponent,
    OpenModalComponent,
    TestEmailComponent,
    MergeTagsComponent,
    AttachEmailComponent,
    OffersComponent,
    TemplateLibraryComponent,
    TriggerAnalyticsComponent,
    SanitizeHtmlPipe,
    PreviewOnClientComponent,
    DesignPageComponent,
    MobilePushComponent,
    WebPushComponent,
    InappChannelComponent,
    DmChannelComponent,
    DmFreeTextComponent,
    DmColumnarComponent,
    SmsChannelComponent,
    FacebookChannelComponent,
    AgGridCheckboxSelectComponent,
    FullPreviewAddonsComponent,
    DisplayConditionComponent,
    RatingsComponent,
    DcRowPreviewComponent,
    GlobalMergeTagsComponent,
    ApiChannelComponent,
    WhatsAppChannelComponent,
    TextAddonsComponent,
    CustomTreeExpandMergeTagComponent,
    ImageAddonsComponent,
    MapAddonsComponent,
    StackedBarComponent,
    EnsembleAIComponent,
    ActiveContentComponent,
    PtagDetailsComponent,
    BadgingWidgetComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    AngularSvgIconModule.forRoot(),
    PickerModule,
    NgbPaginationModule,
    NgbModule,
    RecommendationModule,
    RecommendationOfferDynamicModule,
    NgImageSliderModule,
    TranslateModule,
    ColorPickerModule,
    ClipboardModule,
    NgxSliderModule,
    TreeviewModule,
    ReactiveFormsModule,
    utilsCommonModule,
    CodemirrorModule,
    NgxAngularQueryBuilderModule,
    OfferDrawerModule
  ],
  exports: [
    EmailTemplatesComponent,
    ChannelsComponent,
    FailsafeComponent,
    BeeEditorComponent,
    SaveEmailComponent,
    SaveUserRowsComponent,
    SubjectlineComponent,
    OpenModalComponent,
    TestEmailComponent,
    MergeTagsComponent,
    AttachEmailComponent,
    OffersComponent,
    TriggerAnalyticsComponent,
    //OffersDrawerComponent,
    SanitizeHtmlPipe,
    TranslateModule,
    AngularSvgIconModule
  ],
})
export class DesignChannelsModule {}