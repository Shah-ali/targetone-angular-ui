import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedPersonalizedTagsComponent } from './saved-personalized-tags.component';

describe('SavedPersonalizedTagsComponent', () => {
  let component: SavedPersonalizedTagsComponent;
  let fixture: ComponentFixture<SavedPersonalizedTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedPersonalizedTagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedPersonalizedTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
