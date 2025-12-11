import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataLayerComponent } from './data-layer.component';

describe('DataLayerComponent', () => {
  let component: DataLayerComponent;
  let fixture: ComponentFixture<DataLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataLayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
