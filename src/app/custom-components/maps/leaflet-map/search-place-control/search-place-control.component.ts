import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef,
  Inject, LOCALE_ID } from '@angular/core';
import { LatLngBounds } from 'leaflet';
import { debounceTime, distinctUntilChanged, filter, forkJoin, fromEvent, map } from 'rxjs';
import { CustomFeature } from 'src/app/@core/data/poi.data';
import { NominatimService } from 'src/app/@core/service/nominatim.service';
import { OverpassapiService } from 'src/app/@core/service/overpassapi.service';

interface DisplayData {
  displayName: string;
  feature?: CustomFeature;
}

@Component({
  selector: 'travale-search-place-control',
  templateUrl: './search-place-control.component.html',
  styleUrls: ['./search-place-control.component.scss']
})
export class SearchPlaceComponent implements OnInit {

  @Input() value = '';
  @Input() bounds: LatLngBounds;

  @Output() placeSelect: EventEmitter<CustomFeature> = new EventEmitter();
  @Output() mouseOverPlace: EventEmitter<CustomFeature> = new EventEmitter();

  @ViewChild('input', { static: true }) input: ElementRef;

  foundPlaces: DisplayData[] | null = null;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private overpassapiService: OverpassapiService,
    private nominatimService: NominatimService
    ) { }

  ngOnInit(): void {
      fromEvent(this.input.nativeElement, 'keyup').pipe(
        map((event: any) => {
          const value = event.target.value;
          if (value.length === 0) {
            this.foundPlaces = null;
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

  placeSelected(displayData: DisplayData) {
    this.value = displayData.displayName;
    this.foundPlaces = null;
    if (displayData.feature) {
      this.placeSelect.emit(displayData.feature);
    }
  }

  onMouseOverPlace(displayData: DisplayData) {
    if (displayData.feature) {
      this.mouseOverPlace.emit(displayData.feature);
    }
  }

  search(pattern: string) {
    forkJoin(
      [
        this.overpassapiService.searchPlace(pattern, this.bounds, this.locale).pipe(
          map(features => features.map((feature: CustomFeature) => {
            return {
              displayName: (feature.properties.name_loc)? feature.properties.name_loc:
                (feature.properties.name_en)? feature.properties.name_en: feature.properties.name,
              feature: feature
            } as DisplayData;
          }))
        ),
        this.nominatimService.searchPlace(pattern, this.bounds, this.locale).pipe(
          map(features => features.map((feature: CustomFeature) => {
            return {
              displayName: (feature.properties.name_loc)? feature.properties.name_loc:
                (feature.properties.name_en)? feature.properties.name_en: feature.properties.name,
              feature: feature
            } as DisplayData;
          }))
        )
      ]
    ).subscribe(([foundByOverpass, foundByNominatim]) => { // ToDo error handling if 1 is not available
      this.foundPlaces = foundByOverpass.concat(foundByNominatim);
      if (this.foundPlaces.length === 0)
        this.foundPlaces = null;
    });

  }
}
