import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalMergeTagsComponent } from './global-merge-tags.component';

describe('GlobalMergeTagsComponent', () => {
  let component: GlobalMergeTagsComponent;
  let fixture: ComponentFixture<GlobalMergeTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalMergeTagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalMergeTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
