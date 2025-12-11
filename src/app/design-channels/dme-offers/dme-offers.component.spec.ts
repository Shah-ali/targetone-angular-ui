import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DMEOffersComponent } from './dme-offers.component';

describe('DMEOffersComponent', () => {
  let component: DMEOffersComponent;
  let fixture: ComponentFixture<DMEOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DMEOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DMEOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
