import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseLayoutTemplateComponent } from './choose-layout-template.component';

describe('ChooseLayoutTemplateComponent', () => {
  let component: ChooseLayoutTemplateComponent;
  let fixture: ComponentFixture<ChooseLayoutTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseLayoutTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseLayoutTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
