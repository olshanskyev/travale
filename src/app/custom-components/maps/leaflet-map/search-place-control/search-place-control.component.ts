import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef,
  Inject, LOCALE_ID } from '@angular/core';
import { LatLng, LatLngBounds } from 'leaflet';
import { Subscription, debounceTime, filter, forkJoin, fromEvent, map, finalize } from 'rxjs';
import { sortByCategoryPriority, sortByDistanceFromCenter } from 'src/app/@core/data/places.data';
import { CustomFeature } from 'src/app/@core/data/poi.data';
import { IconsService } from 'src/app/@core/service/icons.service';
import { NominatimService } from 'src/app/@core/service/nominatim.service';
import { OverpassapiService } from 'src/app/@core/service/overpassapi.service';
import { PhotonService } from 'src/app/@core/service/photon.service';

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
  @Input() viewBoxCenter: LatLng;

  @Output() placeSelect: EventEmitter<CustomFeature> = new EventEmitter();
  @Output() mouseOverPlace: EventEmitter<CustomFeature> = new EventEmitter();
  @Output() inputCleared: EventEmitter<void> = new EventEmitter();

  @ViewChild('input', { static: true }) input: ElementRef;

  foundPlaces: DisplayData[] | null = null;
  defaultCategoryPrioList = ['memorial', 'monument', 'museum', 'archaeological_site', 'castle', 'attraction'];
  loading = false;
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private overpassapiService: OverpassapiService,
    private nominatimService: NominatimService,
    private photonService: PhotonService,
    protected iconsService: IconsService
    ) { }

  ngOnInit(): void {
      fromEvent(this.input.nativeElement, 'keyup').pipe(
        map((event: any) => {
          const value = event.target.value;
          if (value.length <= 2) {
            this.foundPlaces = null;
            this.loading = false;
            this.inputCleared.emit();
            if (this.searchSubscription$)
              this.searchSubscription$.unsubscribe();
          }
          return value;
        }),
        debounceTime(300),
        filter(res => (res && res.length > 2)),
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
  private searchSubscription$: Subscription;

  search(pattern: string) {
    this.loading = true;
    if (this.searchSubscription$) //unsubscribe if there is still no response
      this.searchSubscription$.unsubscribe();
    this.searchSubscription$ = forkJoin(
      [
        this.photonService.searchPlace(pattern, this.viewBoxCenter, this.locale),
        this.overpassapiService.searchPlace(pattern, this.bounds, this.locale),
        this.nominatimService.searchPlace(pattern, this.bounds, this.locale)
      ]
    ).pipe(finalize( () => this.loading = false))
    .subscribe(([foundByPhoton, foundByOverpass, foundByNominatim]) => { // ToDo error handling if 1 is not available
      const foundAll = foundByOverpass.concat(foundByPhoton.concat(foundByNominatim));
      sortByDistanceFromCenter(foundAll, this.viewBoxCenter);
      sortByCategoryPriority(foundAll, this.defaultCategoryPrioList);
      this.foundPlaces = foundAll.map((feature: CustomFeature) => {
        return {
          displayName: (feature.properties.name_loc)? feature.properties.name_loc:
            (feature.properties.name_en)? feature.properties.name_en: feature.properties.name,
          feature: feature
        } as DisplayData;
      }).filter(item => item.displayName);
      if (this.foundPlaces.length === 0)
        this.foundPlaces = null;
    });

  }

  buildAddressString(feature: CustomFeature): string {
    return [feature.properties.address?.street, feature.properties.address?.city, feature.properties.address?.country]
    .filter(Boolean).join(', ');
  }
}
