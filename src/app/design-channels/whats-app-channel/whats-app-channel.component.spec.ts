import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsAppChannelComponent } from './whats-app-channel.component';

describe('WhatsAppChannelComponent', () => {
  let component: WhatsAppChannelComponent;
  let fixture: ComponentFixture<WhatsAppChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsAppChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsAppChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
