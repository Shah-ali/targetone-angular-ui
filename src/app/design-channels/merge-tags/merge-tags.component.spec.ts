import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeTagsComponent } from './merge-tags.component';

describe('MergeTagsComponent', () => {
  let component: MergeTagsComponent;
  let fixture: ComponentFixture<MergeTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeTagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
