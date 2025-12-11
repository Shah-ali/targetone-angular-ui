import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { QueryBuilderComponent } from 'ngx-angular-query-builder';

if (environment.production) {
  enableProdMode();
}
(QueryBuilderComponent as any).prototype.getInputType = function(field: string, operator: string): any {
  if (this.config.getInputType) {
    return this.config.getInputType(field, operator);
  }

  if (!this.config.fields[field]) {
    throw new Error(`No configuration for field '${field}' could be found! Please add it to config.fields.`);
  }

  const type = this.config.fields[field].type;
  switch (operator ? operator.trim() : operator) {
    case 'is null':
    case 'is not null': 
    case 'is NaN':     
      return null;  // No displayed component
    case 'in':
    case 'not in':
      return type === 'category' || type === 'boolean' ? 'multiselect' : type;
    default:
      return type;
  }
};

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
