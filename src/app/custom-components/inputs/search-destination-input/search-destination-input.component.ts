import { Component, EventEmitter, Inject, LOCALE_ID, Output, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { map, forkJoin, fromEvent, filter, debounceTime, distinctUntilChanged, of } from 'rxjs';
import { Destination, PopularDestinations } from 'src/app/@core/data/common.data';
import { CitiesService } from 'src/app/@core/service/cities.service';
import { CountriesService } from 'src/app/@core/service/countries.service';

interface DisplayData {
    displayName: string;
    destination: Destination;
}

export type SearchMode = 'only_cities' | 'only_countries' | 'all';

@Component({
  selector: 'travale-search-destination-input',
  templateUrl: './search-destination-input.component.html',
  styleUrls: ['./search-destination-input.component.scss']
})
export class SearchDestinationInputComponent implements OnInit {

  popularDestinations = {
    displayName: this.translateService.instant('searchDestinationInput.popularDestinations'),
    destination: new PopularDestinations()
  } as DisplayData;

  foundDestinations: DisplayData[] | null = null;
  initialized = true;
  inputFocused = false;


  @Input() value = '';
  @Input() mode: SearchMode = 'all';
  @Output() destianationSelect: EventEmitter<Destination> = new EventEmitter();
  @ViewChild('input', { static: true }) input: ElementRef;

  constructor(
    private countriesService: CountriesService,
    private citiesService: CitiesService,
    @Inject(LOCALE_ID) private locale: string,
    private translateService: TranslateService) {


  }

  ngOnInit(): void {
    fromEvent(this.input.nativeElement, 'keyup').pipe(
      map((event: any) => {
        const value = event.target.value;
        if (value.length === 0) {
          this.foundDestinations = null;
        }
        return event.target.value;
      }),
      filter(res => (res && res.length >= 2)),
      debounceTime(800),
      distinctUntilChanged()

    ).subscribe((text: string) => {
      this.search(text);
    });
  }

  onFocus() {
    if (!this.foundDestinations)
      this.foundDestinations = [this.popularDestinations];
  }

  onBlur() {
    if (this.foundDestinations?.length === 1 && this.foundDestinations[0].destination.type === 'popular_destinations')
      this.foundDestinations = null;
  }

  destinationSelected(displayData: DisplayData) {
    this.value = displayData.displayName;
    this.foundDestinations = null;
    if (displayData.destination) {
      this.destianationSelect.emit(displayData.destination);
    }
  }


  search(pattern: string) {
    forkJoin(
      [
      (this.mode !== 'only_cities')? this.countriesService.findCountriesByPattern(pattern).pipe(
        map(countries => countries.map(country => {
          country.type = 'country';
          return {
            displayName: this.countriesService.getCountryNameTranslation(country, this.locale),
            destination: country
          } as DisplayData;
        })),
      ): of([]),
      (this.mode !== 'only_countries')? this.citiesService.findCitiesByPattern(pattern).pipe(
        map(cities => cities.map(city => {
          return {
            displayName: city.fullName,
            destination: city
          } as DisplayData;
        }))
      ): of([])
    ]

    ).subscribe(([countries, cities]) => {
      this.foundDestinations = countries.concat(cities);
      if (this.foundDestinations.length === 0)
        this.foundDestinations = [this.popularDestinations];
      //this.filteredOptions$ = of(this.foundDestinations);
      });
  }


}
