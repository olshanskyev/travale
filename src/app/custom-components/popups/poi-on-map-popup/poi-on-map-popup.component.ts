import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AggregatedFeatureInfo, CustomFeature } from 'src/app/@core/data/poi.data';
import { WikiExtraction, WikiPageRef } from 'src/app/@core/data/wiki.data';
import { IconsService } from 'src/app/@core/service/icons.service';
import { WikiService } from 'src/app/@core/service/wiki.service';

@Component({
  selector: 'travale-poi-on-map-popup',
  templateUrl: './poi-on-map-popup.component.html',
  styleUrls: ['./poi-on-map-popup.component.scss']
})
export class PoiOnMapPopupComponent implements OnChanges {
  @Input() feature: CustomFeature;
  @Input() preferredLanguage: string;
  @Input() addToRouteCallback: (featureInfo: AggregatedFeatureInfo)=> void;

  historic?: string;
  tourism?: string;
  amenity?: string;
  website?: string;
  openingHours?: string;
  phone?: string;
  wikipedia?: string;
  wikidata?: string;
  name?: string;
  wikiPageRef: WikiPageRef;
  wikiExtraction?: WikiExtraction;
  showWikiInfo = false;
  isAddedToRoute = false;

  constructor(
    private wikiService: WikiService,
    protected iconsService: IconsService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['feature'] && changes['feature'].currentValue) {
      this.feature = changes['feature'].currentValue;
      this.historic = this.feature.properties?.categories?.['historic'];
      this.tourism = this.feature.properties?.categories?.['tourism'];
      this.amenity = this.feature.properties?.categories?.['amenity'];
      this.website = this.feature.properties?.website;
      this.openingHours = this.feature.properties?.openingHours;
      this.phone = this.feature.properties?.phone;
      this.wikipedia = this.feature.properties?.wikipedia;
      this.wikidata = this.feature.properties?.wikidata;
      this.name = (this.feature.properties?.['name_loc'])? this.feature.properties?.['name_loc']:
        ((this.feature.properties?.['name_en'])? this.feature.properties?.['name_en']: this.feature.properties?.['name']);

      if (this.wikidata && this.wikipedia) { // if wikipedia tag presents in reply, we can find wikipedia page on wikidata
        const defLangPrefix = this.wikipedia?.substring(0, this.wikipedia.indexOf(':'));

        this.wikiService.getWikiPageByWikiData([this.preferredLanguage, 'en', defLangPrefix], this.wikidata).subscribe( article => {
          if (article) {
              this.wikiPageRef = article;
          } else {  //article not found, take wikipedia string and parse
              const wikiName = this.wikipedia?.substring(this.wikipedia.indexOf(':') + 1, this.wikipedia.length);
              if (wikiName) {
                this.wikiPageRef = {
                  title: wikiName,
                  language: defLangPrefix,
                  url: `https://${defLangPrefix}.wikipedia.org/wiki/${wikiName}`
                };
              }
          }
          this.wikiService.extractTextFromArticle(this.wikiPageRef.language, this.wikiPageRef.title, 10).subscribe( wikiRes => {
              this.wikiExtraction = wikiRes;
          });

      });
      }
    }
  }

  addToRoute() {
    if (this.addToRouteCallback)
      this.addToRouteCallback({feature: this.feature, wikiExtraction: this.wikiExtraction, wikiPageRef: this.wikiPageRef});
    this.isAddedToRoute = true;
  }

}
