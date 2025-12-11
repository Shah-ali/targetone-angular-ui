import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowApiIntegrationComponent } from './show-api-integration.component';

describe('ShowApiIntegrationComponent', () => {
  let component: ShowApiIntegrationComponent;
  let fixture: ComponentFixture<ShowApiIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowApiIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowApiIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
