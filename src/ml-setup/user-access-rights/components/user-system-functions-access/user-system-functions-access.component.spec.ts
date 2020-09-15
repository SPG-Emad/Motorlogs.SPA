/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserSystemFunctionsAccessComponent } from './user-system-functions-access.component';

describe('UserSystemFunctionsAccessComponent', () => {
  let component: UserSystemFunctionsAccessComponent;
  let fixture: ComponentFixture<UserSystemFunctionsAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSystemFunctionsAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSystemFunctionsAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
