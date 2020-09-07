import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetToastComponent } from './target-toast.component';

describe('TargetToastComponent', () => {
  let component: TargetToastComponent;
  let fixture: ComponentFixture<TargetToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
