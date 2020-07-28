/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LegendsComponent } from './legends.component';

describe('LegendsComponent', () => {
  let component: LegendsComponent;
  let fixture: ComponentFixture<LegendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
