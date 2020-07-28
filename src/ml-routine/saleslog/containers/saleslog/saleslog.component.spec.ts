/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SaleslogComponent } from './saleslog.component';

describe('SaleslogComponent', () => {
  let component: SaleslogComponent;
  let fixture: ComponentFixture<SaleslogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleslogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleslogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
