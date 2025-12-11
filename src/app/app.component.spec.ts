import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './core/services/authentication.service';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpService } from './core/services/http.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DataService } from './core/services/data.service';
import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from './shared/loader/loader.component';

function initialiseTestBed() {
  function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
  }

  TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
      RouterTestingModule
    ],
    declarations: [
      AppComponent,
      HeaderComponent,
      LoaderComponent
    ],
    providers: [
      AuthenticationService,
      TranslateService,
      HttpService,
      DataService
    ]
  }).compileComponents();
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  
  beforeEach((async () => {
    initialiseTestBed();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
