import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSimulateLogConsoleComponent } from './view-simulate-log-console.component';

describe('ViewSimulateLogConsoleComponent', () => {
  let component: ViewSimulateLogConsoleComponent;
  let fixture: ComponentFixture<ViewSimulateLogConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSimulateLogConsoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSimulateLogConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
