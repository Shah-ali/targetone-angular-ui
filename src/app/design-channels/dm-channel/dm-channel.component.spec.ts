import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmChannelComponent } from './dm-channel.component';

describe('DmChannelComponent', () => {
  let component: DmChannelComponent;
  let fixture: ComponentFixture<DmChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
