import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEmailComponent } from './test-email.component';

describe('TestEmailComponent', () => {
  let component: TestEmailComponent;
  let fixture: ComponentFixture<TestEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
