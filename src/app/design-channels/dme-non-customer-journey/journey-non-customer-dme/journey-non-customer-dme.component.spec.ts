import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyNonCustomerDMEComponent } from './journey-non-customer-dme.component';

describe('JourneyNonCustomerDMEComponent', () => {
  let component: JourneyNonCustomerDMEComponent;
  let fixture: ComponentFixture<JourneyNonCustomerDMEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JourneyNonCustomerDMEComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyNonCustomerDMEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
