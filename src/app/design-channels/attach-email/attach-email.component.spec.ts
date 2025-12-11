import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachEmailComponent } from './attach-email.component';

describe('AttachEmailComponent', () => {
  let component: AttachEmailComponent;
  let fixture: ComponentFixture<AttachEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
