import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryInfoCardComponent } from './country-info-card.component';

describe('CountryInfoCardComponent', () => {
  let component: CountryInfoCardComponent;
  let fixture: ComponentFixture<CountryInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryInfoCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
