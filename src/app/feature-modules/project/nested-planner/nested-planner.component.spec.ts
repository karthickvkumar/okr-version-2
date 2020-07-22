import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedPlannerComponent } from './nested-planner.component';

describe('NestedPlannerComponent', () => {
  let component: NestedPlannerComponent;
  let fixture: ComponentFixture<NestedPlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NestedPlannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
