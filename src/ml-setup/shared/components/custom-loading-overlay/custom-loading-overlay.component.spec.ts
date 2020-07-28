import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomLoadingOverlayComponent } from './custom-loading-overlay.component';

describe('CustomLoadingOverlayComponent', () => {
  let component: CustomLoadingOverlayComponent;
  let fixture: ComponentFixture<CustomLoadingOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomLoadingOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomLoadingOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
