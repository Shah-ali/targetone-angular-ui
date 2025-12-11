import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsChannelComponent } from './sms-channel.component';

describe('SmsChannelComponent', () => {
  let component: SmsChannelComponent;
  let fixture: ComponentFixture<SmsChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
