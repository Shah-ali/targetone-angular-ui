import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterByCompaignComponent } from './filter-by-compaign.component';

describe('FilterByCompaignComponent', () => {
  let component: FilterByCompaignComponent;
  let fixture: ComponentFixture<FilterByCompaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterByCompaignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterByCompaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
