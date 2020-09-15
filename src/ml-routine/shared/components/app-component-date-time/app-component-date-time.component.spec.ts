import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponentDateTimeComponent } from './app-component-date-time.component';

describe('AppComponentDateTimeComponent', () => {
  let component: AppComponentDateTimeComponent;
  let fixture: ComponentFixture<AppComponentDateTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponentDateTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponentDateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
