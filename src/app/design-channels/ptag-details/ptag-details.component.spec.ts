import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtagDetailsComponent } from './ptag-details.component';

describe('PtagDetailsComponent', () => {
  let component: PtagDetailsComponent;
  let fixture: ComponentFixture<PtagDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PtagDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PtagDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
