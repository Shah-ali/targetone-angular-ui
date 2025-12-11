import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DMENonCustomerComponent } from './dme-non-customer.component';

describe('DMENonCustomerComponent', () => {
  let component: DMENonCustomerComponent;
  let fixture: ComponentFixture<DMENonCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DMENonCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DMENonCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
