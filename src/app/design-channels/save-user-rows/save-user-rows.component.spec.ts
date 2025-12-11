import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUserRowsComponent } from './save-user-rows.component';

describe('SaveUserRowsComponent', () => {
  let component: SaveUserRowsComponent;
  let fixture: ComponentFixture<SaveUserRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUserRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUserRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
