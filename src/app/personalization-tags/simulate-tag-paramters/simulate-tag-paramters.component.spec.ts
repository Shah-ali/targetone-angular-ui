import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulateTagParamtersComponent } from './simulate-tag-paramters.component';

describe('SimulateTagParamtersComponent', () => {
  let component: SimulateTagParamtersComponent;
  let fixture: ComponentFixture<SimulateTagParamtersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulateTagParamtersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulateTagParamtersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
