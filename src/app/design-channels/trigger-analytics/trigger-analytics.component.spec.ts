import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggerAnalyticsComponent } from './trigger-analytics.component';

describe('TriggerAnalyticsComponent', () => {
  let component: TriggerAnalyticsComponent;
  let fixture: ComponentFixture<TriggerAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TriggerAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TriggerAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
