import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiPersonalizationComponent } from './api-personalization.component';

describe('ApiPersonalizationComponent', () => {
  let component: ApiPersonalizationComponent;
  let fixture: ComponentFixture<ApiPersonalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiPersonalizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiPersonalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
