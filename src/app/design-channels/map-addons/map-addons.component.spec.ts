import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapAddonsComponent } from './map-addons.component';

describe('MapAddonsComponent', () => {
  let component: MapAddonsComponent;
  let fixture: ComponentFixture<MapAddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapAddonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
