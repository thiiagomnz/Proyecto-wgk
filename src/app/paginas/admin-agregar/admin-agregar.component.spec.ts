import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAgregarComponent } from './admin-agregar.component';

describe('AdminAgregarComponent', () => {
  let component: AdminAgregarComponent;
  let fixture: ComponentFixture<AdminAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAgregarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
