import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CustomFeature } from 'src/app/@core/data/poi.data';
import { WikiExtraction, WikiPageRef } from 'src/app/@core/data/wiki.data';
import { IconsService } from 'src/app/@core/service/icons.service';

@Component({
  selector: 'travale-poi-item',
  templateUrl: './poi-item.component.html',
  styleUrls: ['./poi-item.component.scss']
})
export class PoiItemComponent implements OnChanges {

  @Input() feature: CustomFeature;
  @Input() preferredLanguage: string;
  @Input() wikiPageRef?: WikiPageRef;
  @Input() wikiExtraction?: WikiExtraction;
  @Input() website?: string;


  categories: string[];
  openingHours?: string;
  phone?: string;
  name?: string;
  showWikiInfo = false;

  constructor(
    protected iconsService: IconsService) {
  }


ngOnChanges(changes: SimpleChanges): void {
    if (changes['feature'] && changes['feature'].currentValue) {
      this.feature = changes['feature'].currentValue;
      if (this.feature.properties.website) {
        this.website = this.feature.properties.website;
      }
      this.openingHours = this.feature.properties?.openingHours;
      this.phone = this.feature.properties?.phone;
      this.name = (this.feature.properties?.['name_loc'])? this.feature.properties?.['name_loc']:
        ((this.feature.properties?.['name_en'])? this.feature.properties?.['name_en']: this.feature.properties?.['name']);
    }
  }
}
