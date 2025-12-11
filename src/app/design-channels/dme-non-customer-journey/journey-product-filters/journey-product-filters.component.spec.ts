import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyProductFiltersComponent } from './journey-product-filters.component';

describe('JourneyProductFiltersComponent', () => {
  let component: JourneyProductFiltersComponent;
  let fixture: ComponentFixture<JourneyProductFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JourneyProductFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyProductFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
