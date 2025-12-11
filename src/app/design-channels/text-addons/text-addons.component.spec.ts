import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAddonsComponent } from './text-addons.component';

describe('TextAddonsComponent', () => {
  let component: TextAddonsComponent;
  let fixture: ComponentFixture<TextAddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextAddonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
