import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarizedViewComponent } from './summarized-view.component';

describe('SummarizedViewComponent', () => {
  let component: SummarizedViewComponent;
  let fixture: ComponentFixture<SummarizedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarizedViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarizedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
