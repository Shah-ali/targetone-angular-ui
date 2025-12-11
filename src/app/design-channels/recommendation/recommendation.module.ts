import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecommendationComponent } from './recommendation.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ RecommendationComponent ],
  exports: [ RecommendationComponent ],
  imports: [ CommonModule, FormsModule, TranslateModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
  //schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class RecommendationModule {}