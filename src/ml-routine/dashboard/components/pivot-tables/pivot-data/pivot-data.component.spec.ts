/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PivotDataComponent } from './pivot-data.component';

describe('PivotDataComponent', () => {
  let component: PivotDataComponent;
  let fixture: ComponentFixture<PivotDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PivotDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PivotDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
