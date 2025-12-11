import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseInlineFuncComponent } from './use-inline-func.component';

describe('UseInlineFuncComponent', () => {
  let component: UseInlineFuncComponent;
  let fixture: ComponentFixture<UseInlineFuncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseInlineFuncComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseInlineFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
