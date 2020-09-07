/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserDepartmentsAccessComponent } from './user-departments-access.component';

describe('UserDepartmentsAccessComponent', () => {
  let component: UserDepartmentsAccessComponent;
  let fixture: ComponentFixture<UserDepartmentsAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDepartmentsAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDepartmentsAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
