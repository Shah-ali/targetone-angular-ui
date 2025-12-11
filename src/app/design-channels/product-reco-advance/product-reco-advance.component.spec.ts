import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRecoAdvanceComponent } from './product-reco-advance.component';

describe('ProductRecoAdvanceComponent', () => {
  let component: ProductRecoAdvanceComponent;
  let fixture: ComponentFixture<ProductRecoAdvanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductRecoAdvanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRecoAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
