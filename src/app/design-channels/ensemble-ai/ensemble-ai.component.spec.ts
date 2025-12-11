import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnsembleAIComponent } from './ensemble-ai.component';

describe('EnsembleAIComponent', () => {
  let component: EnsembleAIComponent;
  let fixture: ComponentFixture<EnsembleAIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnsembleAIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnsembleAIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
