import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OffersDrawerComponent } from './offers-drawer.component';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { merge } from 'lodash';
import { MergeTagInjectionComponent } from '@app/utils/merge-tag-injection/merge-tag-injection.component';

@NgModule({
  declarations: [ OffersDrawerComponent, MergeTagInjectionComponent ],
  exports: [ OffersDrawerComponent ],
  imports: [ CommonModule, FormsModule, TranslateModule, NgbTooltipModule, TooltipModule.forRoot()],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
  //schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class OfferDrawerModule {}