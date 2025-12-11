import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAddonsComponent } from './image-addons.component';

describe('ImageAddonsComponent', () => {
  let component: ImageAddonsComponent;
  let fixture: ComponentFixture<ImageAddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageAddonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
