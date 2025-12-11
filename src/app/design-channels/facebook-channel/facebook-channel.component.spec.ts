import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookChannelComponent } from './facebook-channel.component';

describe('FacebookChannelComponent', () => {
  let component: FacebookChannelComponent;
  let fixture: ComponentFixture<FacebookChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacebookChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
