import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeeEditorComponent } from './bee-editor.component';

describe('BeeEditorComponent', () => {
  let component: BeeEditorComponent;
  let fixture: ComponentFixture<BeeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeeEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
