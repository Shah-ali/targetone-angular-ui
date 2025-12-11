import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyChooseTemplateLayoutComponent } from './journey-choose-template-layout.component';

describe('JourneyChooseTemplateLayoutComponent', () => {
  let component: JourneyChooseTemplateLayoutComponent;
  let fixture: ComponentFixture<JourneyChooseTemplateLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JourneyChooseTemplateLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyChooseTemplateLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
