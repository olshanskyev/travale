import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityInfoCardComponent } from './city-info-card.component';

describe('CityInfoCardComponent', () => {
  let component: CityInfoCardComponent;
  let fixture: ComponentFixture<CityInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityInfoCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
