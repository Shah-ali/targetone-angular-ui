import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewOnClientComponent } from './preview-on-client.component';

describe('PreviewOnClientComponent', () => {
  let component: PreviewOnClientComponent;
  let fixture: ComponentFixture<PreviewOnClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewOnClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewOnClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
