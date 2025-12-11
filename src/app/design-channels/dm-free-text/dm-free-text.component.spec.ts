import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmFreeTextComponent } from './dm-free-text.component';

describe('DmFreeTextComponent', () => {
  let component: DmFreeTextComponent;
  let fixture: ComponentFixture<DmFreeTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmFreeTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmFreeTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
