import { Component, Input } from '@angular/core';
import { Country } from 'src/app/@core/data/countries.data';

@Component({
  selector: 'travale-country-info-card',
  templateUrl: './country-info-card.component.html',
  styleUrls: ['./country-info-card.component.scss']
})
export class CountryInfoCardComponent {

  private _country?: Country;

  public set country(value: Country | undefined) {
    this._country = value;
  }

  @Input()
  public get country() {
    return this._country;
  }

}
