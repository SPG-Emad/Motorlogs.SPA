import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnOptionComponent } from './column-option.component';

describe('ColumnOptionComponent', () => {
  let component: ColumnOptionComponent;
  let fixture: ComponentFixture<ColumnOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
