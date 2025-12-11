import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineJSComponent } from './inline-js.component';

describe('InlineJSComponent', () => {
  let component: InlineJSComponent;
  let fixture: ComponentFixture<InlineJSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InlineJSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineJSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
