import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacheControlComponent } from './cache-control.component';

describe('CacheControlComponent', () => {
  let component: CacheControlComponent;
  let fixture: ComponentFixture<CacheControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CacheControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CacheControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
