import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFiltersGlobalComponent } from './product-filters-global.component';

describe('ProductFiltersGlobalComponent', () => {
  let component: ProductFiltersGlobalComponent;
  let fixture: ComponentFixture<ProductFiltersGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductFiltersGlobalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFiltersGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
