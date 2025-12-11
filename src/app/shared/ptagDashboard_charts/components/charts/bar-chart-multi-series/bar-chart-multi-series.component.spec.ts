import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartMultiSeriesComponent } from './bar-chart-multi-series.component';

describe('BarChartMultiSeriesComponent', () => {
  let component: BarChartMultiSeriesComponent;
  let fixture: ComponentFixture<BarChartMultiSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarChartMultiSeriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartMultiSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
