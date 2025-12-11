import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TreeviewModule } from 'ngx-treeview';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MergeTagCopyComponent } from '@app/utils/merge-tag-copy/merge-tag-copy.component';
import { CopyClipboardComponent } from './copy-clipboard/copy-clipboard.component';

@NgModule({
  declarations: [MergeTagCopyComponent, CopyClipboardComponent],
  imports: [RouterModule, CommonModule, TranslateModule, BrowserModule, FormsModule, NgbModule, TreeviewModule],
  exports: [MergeTagCopyComponent, CopyClipboardComponent],
})
export class utilsCommonModule {}
