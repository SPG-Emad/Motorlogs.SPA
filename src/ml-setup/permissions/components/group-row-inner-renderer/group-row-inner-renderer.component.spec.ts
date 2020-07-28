import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRowInnerRendererComponent } from './group-row-inner-renderer.component';

describe('GroupRowInnerRendererComponent', () => {
  let component: GroupRowInnerRendererComponent;
  let fixture: ComponentFixture<GroupRowInnerRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupRowInnerRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupRowInnerRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
