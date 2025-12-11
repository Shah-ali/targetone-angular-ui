import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagFailsafeComponent } from './tag-failsafe.component';

describe('TagFailsafeComponent', () => {
  let component: TagFailsafeComponent;
  let fixture: ComponentFixture<TagFailsafeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagFailsafeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagFailsafeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
