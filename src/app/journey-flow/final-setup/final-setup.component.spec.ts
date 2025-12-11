import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FinalSetupComponent } from './final-setup.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpLoaderFactory } from '@app/app.module';
import { HttpClient } from '@angular/common/http';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

describe('FinalSetupComponent', () => {
  let component: FinalSetupComponent;
  let fixture: ComponentFixture<FinalSetupComponent>;

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
        RouterTestingModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule
      ],
      providers: [
        BsModalService,
        BsModalRef
      ],
      declarations: [ FinalSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create final-setup component', () => {
    expect(component).toBeTruthy();
  });

});
