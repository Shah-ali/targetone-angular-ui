import { Injectable } from '@angular/core';
import introJs from 'intro.js';
import { SharedataService } from './sharedata.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class IntroJSService {
  private introJS: ReturnType<typeof introJs> | null = null;
  activepTagTabNumber: string = '';

  constructor(private shareService: SharedataService, private translate: TranslateService) {}

  pTagCardHelp() {
    this.introJS = introJs()
    this.introJS.start();
    this.shareService.activepTagTab.subscribe((result) => {
      this.activepTagTabNumber = result;
    });
    const steps = [
      {
        element: document.querySelector('.ptag-step-1'),
        intro: this.translate.instant('visualHelpContent.pTagCards.activeTab'),
        //intro: `Shows the active content that are activated.`,
      },
      {
        element: document.querySelector('.ptag-step-2'),
        intro: this.translate.instant('visualHelpContent.pTagCards.draftTab'),
      },
      {
        element: document.querySelector('.ptag-step-3'),
        intro: this.translate.instant('visualHelpContent.pTagCards.inactiveTab'),
      },
      {
        element: document.querySelector('.ptag-step-4'),
        intro: this.translate.instant('visualHelpContent.pTagCards.favoriteTab'),
      },
      {
        element: document.querySelector('.ptag-step-5'),
        intro: this.translate.instant('visualHelpContent.pTagCards.searchField'),
      },
      {
        element: document.getElementById('ptag-step-6'),
        intro: this.translate.instant('visualHelpContent.pTagCards.viewPerformanceSummaryBttn'),
      },
      {
        element: document.getElementById('ptag-step-7'),
        intro: this.translate.instant('visualHelpContent.pTagCards.createActiveContentBttn'),
      },
      {
        element: document.querySelector('.ptag-step-8'),
        intro: this.translate.instant('visualHelpContent.pTagCards.viewCreatedDetails1'),
        position: 'right'
      },
    ];

    if (this.activepTagTabNumber == '2') {
      steps.push({
        element: document.querySelector('.ptag-step-8'),
        intro: this.translate.instant('visualHelpContent.pTagCards.viewCreatedDetails2'),
        position: 'right'
      });
    }
    if (this.activepTagTabNumber == '3') {
      steps.push({
        element: document.querySelector('.ptag-step-8'),
        intro: this.translate.instant('visualHelpContent.pTagCards.viewCreatedDetails3'),
        position: 'right'
      });
    }
    if (this.activepTagTabNumber == '4') {
      steps.push({
        element: document.querySelector('.ptag-step-8'),
        intro: this.translate.instant('visualHelpContent.pTagCards.viewCreatedDetails4'),
        position: 'right'
      });
    }

    this.introJS
      .setOptions({
        exitOnOverlayClick: false,
        disableInteraction: false,
        dontShowAgain: true,
        steps: steps as any,
        nextLabel: this.translate.instant('nextLbl'),
        prevLabel: this.translate.instant('backLbl'),
        doneLabel: this.translate.instant('done'),
      })
      .start();
  }

  pTagEditor() {
    this.introJS = introJs();
    this.introJS.start();
    const pTagEditorSteps = [
      /* {
        element: document.getElementById('beefree-step-1'),
        intro:
          '<video width="500" muted controls><source src="https://d1rclcl3m2yqxf.cloudfront.net/7fb98c87-9b3c-4b39-a0b7-3bcf550cc71d/RCDP-Prod-VOD/Active_Content_Product_Lookup.mp4" type="video/mp4"></video><br><br><span>' +
          this.translate.instant('visualHelpContent.pTagEditor.tagParameterBttn') +
          '</span>',
      }, */
      {
        element: document.getElementById('beefree-step-1'),
        intro: this.translate.instant('visualHelpContent.pTagEditor.tagParameterBttn'),
      },
      {
        element: document.getElementById('beefree-step-2'),
        intro: this.translate.instant('visualHelpContent.pTagEditor.mergeTagsBttn'),
      },
      {
        element: document.getElementById('beefree-step-3'),
        intro: this.translate.instant('visualHelpContent.pTagEditor.clipboardBttn'),
      },
      {
        element: document.getElementById('beefree-step-4'),
        intro: this.translate.instant('visualHelpContent.pTagEditor.settingBttn'),
      },
      {
        element: document.getElementById('beefree-step-5'),
        intro: this.translate.instant('visualHelpContent.pTagEditor.simulateBttn'),
      },
      {
        element: document.getElementById('beefree-step-6'),
        intro: this.translate.instant('visualHelpContent.pTagEditor.enableFailsafe'),
      },
      {
        element: document.getElementById('beefree-step-7'),
        intro: this.translate.instant('visualHelpContent.pTagEditor.saveBttn'),
      },
      {
        element: document.getElementById('beefree-step-8'),
        intro: this.translate.instant('visualHelpContent.pTagEditor.saveAndPublishBttn'),
      },
    ];

    this.introJS
      .setOptions({
        exitOnOverlayClick: false,
        disableInteraction: false,
        dontShowAgain: true,
        steps: pTagEditorSteps,
        nextLabel: this.translate.instant('nextLbl'),
        prevLabel: this.translate.instant('backLbl'),
        doneLabel: this.translate.instant('done'),
      })
      .start();
  }
}
