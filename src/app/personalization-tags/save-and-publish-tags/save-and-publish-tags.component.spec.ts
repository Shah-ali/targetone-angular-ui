import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAndPublishTagsComponent } from './save-and-publish-tags.component';

describe('SaveAndPublishTagsComponent', () => {
  let component: SaveAndPublishTagsComponent;
  let fixture: ComponentFixture<SaveAndPublishTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveAndPublishTagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveAndPublishTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
