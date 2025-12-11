import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeeEditorComponent } from './design-channels/bee-editor/bee-editor.component';
import { EmailTemplatesComponent } from './design-channels/email-templates/email-templates.component';
import { JourneyComponent } from './journey-flow/journey/journey.component';
import { FinalSetupComponent } from './journey-flow/final-setup/final-setup.component';
import { TemplateLibraryComponent } from './design-channels/template-library/template-library.component'
import { TriggerAnalyticsComponent } from './design-channels/trigger-analytics/trigger-analytics.component';
import { DesignPageComponent } from './design-channels/design-page/design-page.component';
import { MobilePushComponent } from './design-channels/mobile-push/mobile-push.component';
import { OffersDrawerComponent } from './design-channels/offers-drawer/offers-drawer.component';
import { WebPushComponent } from './design-channels/web-push/web-push.component';
import { InappChannelComponent } from './design-channels/inapp-channel/inapp-channel.component';
import { DmChannelComponent } from './design-channels/dm-channel/dm-channel.component';
import { DmFreeTextComponent } from './design-channels/dm-free-text/dm-free-text.component';
import { DmColumnarComponent } from './design-channels/dm-columnar/dm-columnar.component';
import { SmsChannelComponent } from './design-channels/sms-channel/sms-channel.component';
import { FacebookChannelComponent } from './design-channels/facebook-channel/facebook-channel.component';
import { ActivityComponent } from './rule-builder/activity/activity.component';
import { DisplayConditionComponent } from './design-channels/display-condition/display-condition.component';
import { PersonalizedTagEditorComponent } from './personalization-tags/personalizedTag-editor/personalizedTag-editor.component';
import { SavedPersonalizedTagsComponent } from './personalization-tags/saved-personalized-tags/saved-personalized-tags.component';
import { SimulateTagParamtersComponent } from './personalization-tags/simulate-tag-paramters/simulate-tag-paramters.component';
import { SaveAndPublishTagsComponent } from './personalization-tags/save-and-publish-tags/save-and-publish-tags.component';
import { ShowApiIntegrationComponent } from './apiBasedPersonalization/show-api-integration/show-api-integration.component';
import { CreateApiIntegrationComponent } from './apiBasedPersonalization/create-api-integration/create-api-integration.component';
import { ConvertJsonToGridViewComponent } from './apiBasedPersonalization/convert-json-to-grid-view/convert-json-to-grid-view.component';
import { ListViewComponent } from './personalization-tags/PTag-All-Dashboards/list-view/list-view.component';
import { GraphViewComponent } from './personalization-tags/PTag-All-Dashboards/graph-view/graph-view.component';
import { SummarizedViewComponent } from './personalization-tags/PTag-All-Dashboards/summarized-view/summarized-view.component';
import { ApiChannelComponent } from './design-channels/api-channel/api-channel.component';
import { WhatsAppChannelComponent } from './design-channels/whats-app-channel/whats-app-channel.component';
import { FusionJsAPIComponent } from './fusionJsIntegration/fusion-js-api/fusion-js-api.component';
import { PtagDetailsComponent } from './design-channels/ptag-details/ptag-details.component';

const routes: Routes = [
  {path:'', redirectTo:'/journey', pathMatch:'full'},
  {path:"offers-drawer", component:OffersDrawerComponent},
  {path:"design-page", component:DesignPageComponent},
  {path:"email-templates", component:EmailTemplatesComponent},
  {path:"trigger-analytics", component:TriggerAnalyticsComponent},
  {path:"bee-editor", component:BeeEditorComponent},
  {path:"journey", component:JourneyComponent},
  {path:"final-setup", component:FinalSetupComponent},
  {path:"template-library", component:TemplateLibraryComponent},
  {path:"mobile-push", component:MobilePushComponent},
  {path:"web-push", component:WebPushComponent},
  {path:"inapp-channel", component:InappChannelComponent},
  {path:"dm-channel", component:DmChannelComponent},
  {path:"dm-free-text", component:DmFreeTextComponent},
  {path:"dm-columnar", component:DmColumnarComponent},
  {path:"sms-channel", component:SmsChannelComponent},
  {path:'facebook-channel',component:FacebookChannelComponent},
  {path:'activity-rule',component:ActivityComponent},
  {path:'display-condition',component:DisplayConditionComponent},
  {path:'personalizedTag-editor',component:PersonalizedTagEditorComponent},
  {path:"saved-personalized-tags",component:SavedPersonalizedTagsComponent},
  {path:"simulate-tag-paramters",component:SimulateTagParamtersComponent},
  {path:"save-and-publish-tags",component:SaveAndPublishTagsComponent},
  {path:"show-api-integration",component:ShowApiIntegrationComponent},
  {path:"create-api-intergration",component:CreateApiIntegrationComponent},
  {path:"convert-json-to-grid-view",component:ConvertJsonToGridViewComponent},
  {path:"list-view",component:ListViewComponent},
  {path:"graph-view",component:GraphViewComponent},
  {path:"summarized-view",component:SummarizedViewComponent},
  {path:"api-channel",component:ApiChannelComponent},
  {path:"whats-app-channel",component:WhatsAppChannelComponent},
  {path:"fusion-js-api",component:FusionJsAPIComponent},
  {path:"ptag-details/:tagId/:tagName", component: PtagDetailsComponent},  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
