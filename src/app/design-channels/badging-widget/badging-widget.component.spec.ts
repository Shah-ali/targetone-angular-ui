import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgingWidgetComponent } from './badging-widget.component';

describe('BadgingWidgetComponent', () => {
  let component: BadgingWidgetComponent;
  let fixture: ComponentFixture<BadgingWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgingWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgingWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
