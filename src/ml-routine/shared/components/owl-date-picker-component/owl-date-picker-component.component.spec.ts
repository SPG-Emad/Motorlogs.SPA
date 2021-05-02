import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwlDatePickerComponentComponent } from './owl-date-picker-component.component';

describe('OwlDatePickerComponentComponent', () => {
  let component: OwlDatePickerComponentComponent;
  let fixture: ComponentFixture<OwlDatePickerComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwlDatePickerComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwlDatePickerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
