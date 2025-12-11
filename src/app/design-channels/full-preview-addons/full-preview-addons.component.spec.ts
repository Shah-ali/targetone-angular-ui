import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullPreviewAddonsComponent } from './full-preview-addons.component';

describe('FullPreviewAddonsComponent', () => {
  let component: FullPreviewAddonsComponent;
  let fixture: ComponentFixture<FullPreviewAddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullPreviewAddonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullPreviewAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
