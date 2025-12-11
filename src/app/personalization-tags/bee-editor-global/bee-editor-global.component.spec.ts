import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeeEditorGlobalComponent } from './bee-editor-global.component';

describe('BeeEditorGlobalComponent', () => {
  let component: BeeEditorGlobalComponent;
  let fixture: ComponentFixture<BeeEditorGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeeEditorGlobalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeeEditorGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
