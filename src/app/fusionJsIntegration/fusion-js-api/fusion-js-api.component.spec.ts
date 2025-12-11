import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FusionJsAPIComponent } from './fusion-js-api.component';

describe('FusionJsAPIComponent', () => {
  let component: FusionJsAPIComponent;
  let fixture: ComponentFixture<FusionJsAPIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FusionJsAPIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FusionJsAPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
