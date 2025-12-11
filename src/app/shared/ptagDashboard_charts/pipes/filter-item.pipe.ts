
// dropdown-filter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterItems',
})
export class FilterItemsPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    return items.filter(item =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) && item.selected
    );
  }
}

