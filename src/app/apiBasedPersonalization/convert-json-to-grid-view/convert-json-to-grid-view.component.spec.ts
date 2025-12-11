import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertJsonToGridViewComponent } from './convert-json-to-grid-view.component';

describe('ConvertJsonToGridViewComponent', () => {
  let component: ConvertJsonToGridViewComponent;
  let fixture: ComponentFixture<ConvertJsonToGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvertJsonToGridViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertJsonToGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
