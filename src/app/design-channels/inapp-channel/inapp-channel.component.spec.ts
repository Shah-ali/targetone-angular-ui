import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InappChannelComponent } from './inapp-channel.component';

describe('InappChannelComponent', () => {
  let component: InappChannelComponent;
  let fixture: ComponentFixture<InappChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InappChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InappChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
