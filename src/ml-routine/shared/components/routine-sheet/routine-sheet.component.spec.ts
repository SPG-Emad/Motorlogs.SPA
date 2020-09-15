import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutineSheetComponent } from './routine-sheet.component';

describe('RoutineSheetComponent', () => {
  let component: RoutineSheetComponent;
  let fixture: ComponentFixture<RoutineSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutineSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutineSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
