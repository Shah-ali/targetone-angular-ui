import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiChannelComponent } from './api-channel.component';

describe('ApiChannelComponent', () => {
  let component: ApiChannelComponent;
  let fixture: ComponentFixture<ApiChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
