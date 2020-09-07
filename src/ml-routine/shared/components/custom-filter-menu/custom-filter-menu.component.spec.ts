import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFilterMenuComponent } from './custom-filter-menu.component';

describe('CustomFilterMenuComponent', () => {
  let component: CustomFilterMenuComponent;
  let fixture: ComponentFixture<CustomFilterMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFilterMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
