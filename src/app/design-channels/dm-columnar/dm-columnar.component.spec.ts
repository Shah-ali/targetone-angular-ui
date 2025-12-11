import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmColumnarComponent } from './dm-columnar.component';

describe('DmColumnarComponent', () => {
  let component: DmColumnarComponent;
  let fixture: ComponentFixture<DmColumnarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmColumnarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmColumnarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
