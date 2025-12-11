import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayConditionComponent } from './display-condition.component';

describe('DisplayConditionComponent', () => {
  let component: DisplayConditionComponent;
  let fixture: ComponentFixture<DisplayConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayConditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
