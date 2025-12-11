import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OwlDateTimeIntl } from 'ng-pick-datetimex';

import { JourneyComponent } from '@app/journey-flow/journey/journey.component';
import { TemplateComponent } from '@app/journey-flow/template/template.component';
import { FinalSetupComponent } from '@app/journey-flow/final-setup/final-setup.component';

import { BrowserModule } from '@angular/platform-browser';
import { ActivateJourneyComponent } from '@app/journey-flow/activate-journey/activate-journey.component';

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
  declarations: [JourneyComponent, TemplateComponent, FinalSetupComponent, ActivateJourneyComponent],
  imports: [
    RouterModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    TranslateModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  exports: [
    JourneyComponent,
    TemplateComponent,
    FinalSetupComponent,
    TranslateModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [{ provide: OwlDateTimeIntl, useClass: DefaultIntl }, TranslateService],
})
export class JourneyFlowModule {}
