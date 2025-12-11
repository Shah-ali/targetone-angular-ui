import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcRowPreviewComponent } from './dc-row-preview.component';

describe('DcRowPreviewComponent', () => {
  let component: DcRowPreviewComponent;
  let fixture: ComponentFixture<DcRowPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcRowPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DcRowPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
