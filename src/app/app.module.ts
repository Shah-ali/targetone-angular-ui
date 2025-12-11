import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { HttpInterceptorProviders } from './core/interceptors';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from '@angular/common';

import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetimex';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import pkg from '../../package.json';
import { DesignChannelsModule } from './design-channels/design-channels.module';
import { JourneyFlowModule } from './journey-flow/journey-flow.module';
import { ActivityComponent } from './rule-builder/activity/activity.component';
import { AgGridModule } from 'ag-grid-angular';
import { ViewTagPersonalizedComponent } from './personalization-tags/view-tag-personalized/view-tag-personalized.component';
import { PersonalizationTagsModule } from './personalization-tags/personalization-tags.module';
import { ShowApiIntegrationComponent } from './apiBasedPersonalization/show-api-integration/show-api-integration.component';
import { CreateApiIntegrationComponent } from './apiBasedPersonalization/create-api-integration/create-api-integration.component';
import { ConvertJsonToGridViewComponent } from './apiBasedPersonalization/convert-json-to-grid-view/convert-json-to-grid-view.component';
import { LocaleService } from './core/services/locale.service';
import { FusionJsAPIComponent } from './fusionJsIntegration/fusion-js-api/fusion-js-api.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
export const version = pkg.version;
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', `.json?version=${version}`);
}

const appInitializerFn = (LocaleService: LocaleService) => {
  return () => {
    return LocaleService.loadInfo();
  };
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoaderComponent,
    ActivityComponent,
    ViewTagPersonalizedComponent,
    ShowApiIntegrationComponent,
    CreateApiIntegrationComponent,
    ConvertJsonToGridViewComponent,
    FusionJsAPIComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AccordionModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ModalModule.forRoot(),
    DesignChannelsModule,
    JourneyFlowModule,
    AgGridModule,
    NgbTooltipModule,
    PersonalizationTagsModule,
    NgbModule,
    CodemirrorModule
  ],
  providers: [
    HttpInterceptorProviders,
    BsModalService,
    BsModalRef,
    { provide: APP_BASE_HREF, useValue: './' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [LocaleService],
    },
    LocaleService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
