/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GoToCurrentMonthComponent } from './go-to-current-month.component';

describe('GoToCurrentMonthComponent', () => {
  let component: GoToCurrentMonthComponent;
  let fixture: ComponentFixture<GoToCurrentMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoToCurrentMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoToCurrentMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
