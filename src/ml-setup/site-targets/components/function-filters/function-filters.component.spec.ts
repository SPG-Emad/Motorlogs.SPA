import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionFiltersComponent } from './function-filters.component';

describe('FunctionFiltersComponent', () => {
  let component: FunctionFiltersComponent;
  let fixture: ComponentFixture<FunctionFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
