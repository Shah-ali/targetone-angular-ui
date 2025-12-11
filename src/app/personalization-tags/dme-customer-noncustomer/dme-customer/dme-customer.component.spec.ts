import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DMECustomerComponent } from './dme-customer.component';

describe('DMEOffersComponent', () => {
  let component: DMECustomerComponent;
  let fixture: ComponentFixture<DMECustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DMECustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DMECustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
