import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { City } from 'src/app/@core/data/cities.data';
import { CitiesService } from 'src/app/@core/service/cities.service';

@Component({
  selector: 'travale-city-info-card',
  templateUrl: './city-info-card.component.html',
  styleUrls: ['./city-info-card.component.scss']
})
export class CityInfoCardComponent {

  private _city?: City;

  constructor(
    private citiesService: CitiesService,
    private router: Router) {}

  public set city(value: City | undefined) {
    this._city = value;
  }

  @Input()
  public get city() {
    return this._city;
  }

  createNewRoute() {
    if (this._city) {
      this.citiesService.getCityGeometry(this._city).subscribe(geometry => {
        this.router.navigate(['pages/create-route'], { queryParams: {
            cityLatitude: geometry.lat,
            cityLongitude: geometry.lon,
            cityName: this._city?.fullName,
            country: this._city?.country,
            cityBoundingBox: geometry.cityBoundingBox
          }
          }
        );
      });
    }
  }
}
