import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeTagCopyComponent } from './merge-tag-copy.component';

describe('MergeTagCopyComponent', () => {
  let component: MergeTagCopyComponent;
  let fixture: ComponentFixture<MergeTagCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeTagCopyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeTagCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
