import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyCustomerDMEComponent } from './journey-customer-dme.component';

describe('JourneyCustomerDMEComponent', () => {
  let component: JourneyCustomerDMEComponent;
  let fixture: ComponentFixture<JourneyCustomerDMEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JourneyCustomerDMEComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyCustomerDMEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
