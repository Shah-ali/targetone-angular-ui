import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApiIntegrationComponent } from './CreateApiIntegrationComponent';

describe('CreateApiIntegrationComponent', () => {
  let component: CreateApiIntegrationComponent;
  let fixture: ComponentFixture<CreateApiIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateApiIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateApiIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
