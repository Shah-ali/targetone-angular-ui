import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TreeviewItem, TreeviewSelection, TreeviewI18n } from 'ngx-treeview';

@Injectable()
export class DefaultTreeviewI18n extends TreeviewI18n {
  constructor(private translate: TranslateService) {
    super();
  }

  getText(selection: TreeviewSelection): string {
    if (selection.uncheckedItems.length === 0) {
      if (selection.checkedItems.length > 0) {
        return this.translate.instant('designEditor.displayConditions.conditionBuilder.all');
      } else {
        return '';
      }
    }
    switch (selection.checkedItems.length) {
      case 0:
        return this.translate.instant('designEditor.displayConditions.conditionBuilder.selectOptions');
      case 1:
        return selection.checkedItems[0].text;
      default:
        return `${selection.checkedItems.length} options selected`;
    }
  }

  getAllCheckboxText(): string {
    return this.translate.instant('designEditor.displayConditions.conditionBuilder.all');
  }

  getFilterPlaceholder(): string {
    return 'Filter';
  }

  getFilterNoItemsFoundText(): string {
    return this.translate.instant('designEditor.displayConditions.conditionBuilder.noItemsFound');
  }

  getTooltipCollapseExpandText(isCollapse: boolean): string {
    return isCollapse ? 'Expand' : 'Collapse';
  }
}
