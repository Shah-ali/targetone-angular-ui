import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageQualitySettingsComponent } from './image-quality-settings.component';

describe('ImageQualitySettingsComponent', () => {
  let component: ImageQualitySettingsComponent;
  let fixture: ComponentFixture<ImageQualitySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageQualitySettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageQualitySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
