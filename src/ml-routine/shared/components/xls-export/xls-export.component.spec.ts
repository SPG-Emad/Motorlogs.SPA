/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { XlsExportComponent } from './xls-export.component';

describe('XlsExportComponent', () => {
  let component: XlsExportComponent;
  let fixture: ComponentFixture<XlsExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XlsExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XlsExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
