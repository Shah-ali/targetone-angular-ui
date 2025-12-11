import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationOffersComponent } from './recommendation-offers.component';

describe('RecommendationOffersComponent', () => {
  let component: RecommendationOffersComponent;
  let fixture: ComponentFixture<RecommendationOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendationOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendationOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
