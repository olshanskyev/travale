import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CustomFeature } from 'src/app/@core/data/poi.data';
import { Place } from 'src/app/@core/data/route.data';
import { WikiPageRef } from 'src/app/@core/data/wiki.data';
import { IconsService } from 'src/app/@core/service/icons.service';

@Component({
  selector: 'travale-place-on-map-popup',
  templateUrl: './place-on-map-popup.component.html',
  styleUrls: ['./place-on-map-popup.component.scss']
})
export class PlaceOnMapPopupComponent implements OnChanges {
  @Input() place: Place;
  @Input() preferredLanguage: string;

  feature: CustomFeature;
  website?: string;
  openingHours?: string;
  phone?: string;
  wikipedia?: string;
  wikidata?: string;
  wikiPageRef: WikiPageRef;

  constructor(
    protected iconsService: IconsService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['place'] && changes['place'].currentValue) {

      this.feature = changes['place'].currentValue.geoJson;
      this.website = this.feature.properties?.website;
      this.openingHours = this.feature.properties?.openingHours;
      this.phone = this.feature.properties?.phone;
      this.wikipedia = this.feature.properties?.wikipedia;
      this.wikidata = this.feature.properties?.wikidata;
    }
  }

}
