import { Component, OnInit } from '@angular/core';
import { SharedataService } from '@app/core/services/sharedata.service';

@Component({
  selector: 'app-initial-personalization-page',
  templateUrl: './initial-personalization-page.component.html',
  styleUrls: ['./initial-personalization-page.component.scss']
})
export class InitialPersonalizationPageComponent implements OnInit {
  navigateToPage: any;

  constructor(private shareService: SharedataService) {
    this.shareService.setNavigationCodeForPersonalizedTag.subscribe((res:any) => {
      if(res !== undefined){
        this.navigateToPage = res;
      }else{
        this.navigateToPage = "1";
      }
    });
   }

  ngOnInit(): void {
  }

}
