import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagResponseParamtersComponent } from './tag-response-paramters.component';

describe('TagResponseParamtersComponent', () => {
  let component: TagResponseParamtersComponent;
  let fixture: ComponentFixture<TagResponseParamtersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagResponseParamtersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagResponseParamtersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
