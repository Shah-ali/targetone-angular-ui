import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectlineComponent } from './subjectline.component';

describe('SubjectlineComponent', () => {
  let component: SubjectlineComponent;
  let fixture: ComponentFixture<SubjectlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
