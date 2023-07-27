import { Component } from '@angular/core';
import { City } from 'src/app/@core/data/cities.data';
import { Destination } from 'src/app/@core/data/destination.data';
import { Country } from 'src/app/@core/data/countries.data';

@Component({
  selector: 'travale-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  selectedCountry: Country | null;
  selectedCity: City | null;

  onDestinationSelect(destination: Destination) {
    this.selectedCity = null;
    this.selectedCountry = null;
    if (destination.type === 'country')
      this.selectedCountry = destination as Country;
    if (destination.type === 'city')
      this.selectedCity = destination as City;
  }


}
