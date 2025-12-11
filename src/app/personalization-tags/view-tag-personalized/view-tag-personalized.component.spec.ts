import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTagPersonalizedComponent } from './view-tag-personalized.component';

describe('ViewTagPersonalizedComponent', () => {
  let component: ViewTagPersonalizedComponent;
  let fixture: ComponentFixture<ViewTagPersonalizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTagPersonalizedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTagPersonalizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
