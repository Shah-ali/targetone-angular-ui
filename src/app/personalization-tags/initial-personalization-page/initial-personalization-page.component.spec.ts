import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialPersonalizationPageComponent } from './initial-personalization-page.component';

describe('InitialPersonalizationPageComponent', () => {
  let component: InitialPersonalizationPageComponent;
  let fixture: ComponentFixture<InitialPersonalizationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitialPersonalizationPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialPersonalizationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
