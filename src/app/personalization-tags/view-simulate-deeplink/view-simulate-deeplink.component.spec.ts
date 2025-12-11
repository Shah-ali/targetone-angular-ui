import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSimulateDeeplinkComponent } from './view-simulate-deeplink.component';

describe('ViewSimulateDeeplinkComponent', () => {
  let component: ViewSimulateDeeplinkComponent;
  let fixture: ComponentFixture<ViewSimulateDeeplinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSimulateDeeplinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSimulateDeeplinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
