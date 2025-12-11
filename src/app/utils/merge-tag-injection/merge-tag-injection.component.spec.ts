import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeTagInjectionComponent } from './merge-tag-injection.component';

describe('MergeTagInjectionComponent', () => {
  let component: MergeTagInjectionComponent;
  let fixture: ComponentFixture<MergeTagInjectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeTagInjectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergeTagInjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
