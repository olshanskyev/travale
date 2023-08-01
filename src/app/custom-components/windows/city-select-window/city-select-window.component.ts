import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { City } from 'src/app/@core/data/cities.data';
import { Destination } from 'src/app/@core/data/destination.data';
import { CitiesService } from 'src/app/@core/service/cities.service';

@Component({
  selector: 'travale-city-select-window',
  templateUrl: './city-select-window.component.html',
  styleUrls: ['./city-select-window.component.scss']
})
export class CitySelectWindowComponent {

  constructor(protected ref: NbDialogRef<CitySelectWindowComponent>,
    private citiesService: CitiesService,
    protected router: Router,
    protected location: Location) {
    }

  city: City;

  onSelectCity(city: Destination) {
    this.city = city as City;
  }

  done() {
    this.citiesService.getCityGeometry(this.city).subscribe(cityGeometry => {
      this.ref.close({
        city: this.city,
        cityGeometry: cityGeometry
      });
    });
  }
}
