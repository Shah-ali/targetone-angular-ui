import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivateJourneyComponent } from './activate-journey.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpLoaderFactory } from '@app/app.module';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '@app/core/services/http.service';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { By } from '@angular/platform-browser';
import { Journey } from '@app/core/models/journey';

describe('ActivateJourneyComponent', () => {
  let component: ActivateJourneyComponent;
  let fixture: ComponentFixture<ActivateJourneyComponent>;
  const journeyObj: Journey[] = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        RouterTestingModule
      ],
      providers: [
        BsModalService,
        BsModalRef,
        TranslateService,
      ],
      declarations: [ ActivateJourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* it('should execute enableLockSimulation method', () => {
    component.lockSimulation = false
    fixture.detectChanges()
    const button = fixture.debugElement.query(By.css("#lockSimulation"))
    button.nativeElement.click()
    fixture.detectChanges()
    expect(component.enableLockSimulation).toHaveBeenCalled();
    expect(component.lockSimulation).toBeTrue()
  }); */

});
