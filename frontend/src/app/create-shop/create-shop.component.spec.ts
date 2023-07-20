import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShopComponent } from './create-shop.component';

describe('CreateShopComponent', () => {
  let component: CreateShopComponent;
  let fixture: ComponentFixture<CreateShopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateShopComponent]
    });
    fixture = TestBed.createComponent(CreateShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
