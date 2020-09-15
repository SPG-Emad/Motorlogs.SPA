import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDealComponent } from './new-deal.component';

describe('NewDealComponent', () => {
  let component: NewDealComponent;
  let fixture: ComponentFixture<NewDealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
