import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersDrawerComponent } from './offers-drawer.component';

describe('OffersDrawerComponent', () => {
  let component: OffersDrawerComponent;
  let fixture: ComponentFixture<OffersDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffersDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
