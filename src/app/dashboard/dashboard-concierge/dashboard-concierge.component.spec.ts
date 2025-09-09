import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardConciergeComponent } from './dashboard-concierge.component';

describe('DashboardConciergeComponent', () => {
  let component: DashboardConciergeComponent;
  let fixture: ComponentFixture<DashboardConciergeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardConciergeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardConciergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
