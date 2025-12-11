import { Component, OnInit } from '@angular/core';
import { SharedataService } from '@app/core/services/sharedata.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-template-library',
  templateUrl: './template-library.component.html',
  styleUrls: ['./template-library.component.scss']
})
export class TemplateLibraryComponent implements OnInit {
  isTemplateLibraryMode:boolean = true;
  constructor(private shareService:SharedataService,private translate: TranslateService) { 
    this.shareService.templateLibrary.next(this.isTemplateLibraryMode);
  }

  ngOnInit(): void {
  }

}
