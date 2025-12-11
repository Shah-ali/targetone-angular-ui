import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTreeExpandMergeTagComponent } from './custom-tree-expand-merge-tag.component';

describe('CustomTreeExpandMergeTagComponent', () => {
  let component: CustomTreeExpandMergeTagComponent;
  let fixture: ComponentFixture<CustomTreeExpandMergeTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomTreeExpandMergeTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTreeExpandMergeTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
