import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilePushComponent } from './mobile-push.component';

describe('MobilePushComponent', () => {
  let component: MobilePushComponent;
  let fixture: ComponentFixture<MobilePushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobilePushComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilePushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
