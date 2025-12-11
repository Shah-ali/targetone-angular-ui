import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalizedTagEditorComponent } from './personalizedTag-editor.component';

describe('PersonalizedTagComponent', () => {
  let component: PersonalizedTagEditorComponent;
  let fixture: ComponentFixture<PersonalizedTagEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalizedTagEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalizedTagEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
