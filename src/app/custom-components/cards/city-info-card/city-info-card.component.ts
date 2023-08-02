import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { City } from 'src/app/@core/data/cities.data';
import { CitiesService } from 'src/app/@core/service/cities.service';
import { LocalRouteService } from 'src/app/@core/service/local.route.service';

@Component({
  selector: 'travale-city-info-card',
  templateUrl: './city-info-card.component.html',
  styleUrls: ['./city-info-card.component.scss']
})
export class CityInfoCardComponent {

  private _city: City;

  constructor(
    private citiesService: CitiesService,
    private router: Router,
    private localRouteService: LocalRouteService) {}

  public set city(value: City) {
    this._city = value;
  }

  @Input()
  public get city() {
    return this._city;
  }

  createNewRoute() {
    if (this._city) {
      this.citiesService.getCityGeometry(this._city).subscribe(geometry => {
        const emptyRoute = this.localRouteService.initEmptyRoute(this._city, geometry);
        this.localRouteService.addRoute(emptyRoute).subscribe(addedRoute => {
          this.router.navigate(['pages/routes/create'], {queryParams: {id: addedRoute.localId}} );
        });
      });
    }
  }
}
