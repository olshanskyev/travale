import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AggregatedFeatureInfo, CustomFeature } from 'src/app/@core/data/poi.data';
import { ImageType } from 'src/app/@core/data/route.data';
import { WikiExtraction, WikiPageRef } from 'src/app/@core/data/wiki.data';
import { NominatimService } from 'src/app/@core/service/nominatim.service';
import { WikiService } from 'src/app/@core/service/wiki.service';

@Component({
  selector: 'travale-poi-on-map-popup',
  templateUrl: './poi-on-map-popup.component.html',
  styleUrls: ['./poi-on-map-popup.component.scss']
})
export class PoiOnMapPopupComponent implements OnChanges {
  @Input() feature: CustomFeature;
  @Input() preferredLanguage: string;
  @Input() addToRouteCallback?: (featureInfo: AggregatedFeatureInfo)=> void;

  constructor(private wikiService: WikiService, private nominatimService: NominatimService) {}

  wikiPageRef: WikiPageRef;
  wikiExtraction?: WikiExtraction;
  wikiImages: ImageType[]= [];
  isAddedToRoute = false;
  wikiDataId?: string;

  addToRoute() {
    if (this.addToRouteCallback)
      this.addToRouteCallback({feature: this.feature, wikiExtraction: this.wikiExtraction,
      wikiData: (this.wikiDataId)? {
          wikiDataId: this.wikiDataId,
          wikiArticle: this.wikiPageRef,
          images: this.wikiImages
        }
        : undefined
    });
    this.isAddedToRoute = true;
  }


  private getWikiData(wikidata?: string, wikipedia?: string) {
    if (wikidata && wikipedia) { // if wikipedia tag presents in reply, we can find wikipedia page on wikidata
      const defLangPrefix = wikipedia?.substring(0, wikipedia.indexOf(':'));

      this.wikiService.getWikiDataByWikiDataItem([this.preferredLanguage, 'en', defLangPrefix], wikidata).subscribe( wikiData => {
        if (wikiData.wikiArticle) {
            this.wikiPageRef = wikiData.wikiArticle;
        } else {  //article not found, take wikipedia string and parse
            const wikiName = wikipedia?.substring(wikipedia.indexOf(':') + 1, wikipedia.length);
            if (wikiName) {
              this.wikiPageRef = {
                title: wikiName,
                language: defLangPrefix,
                url: `https://${defLangPrefix}.wikipedia.org/wiki/${wikiName}`
              };
            }
        }
        this.wikiImages = wikiData.images;

        this.wikiService.extractTextFromArticle(this.wikiPageRef.language, this.wikiPageRef.title, 10).subscribe( wikiRes => {
            this.wikiExtraction = wikiRes;
        });
      });
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['feature'] && changes['feature'].currentValue) {
      this.feature = changes['feature'].currentValue;

      const wikipedia = this.feature.properties?.wikipedia;
      this.wikiDataId = this.feature.properties?.wikidata;
      if (this.feature.properties.source === 'photon' &&
      this.feature.id &&
      this.feature.properties.osm_type &&
      this.feature.properties.categories
      ) { // try to get additional info from nominativ
        this.nominatimService.getPlace(
          this.feature.id,
          this.feature.properties.osm_type,
          Object.keys(this.feature.properties.categories)[0],
          this.preferredLanguage).subscribe(gotFeature => {
            this.feature.properties.website = gotFeature.properties.website;
            this.wikiDataId = gotFeature.properties.wikidata;
            const wikipedia = gotFeature.properties.wikipedia;
            this.getWikiData(this.wikiDataId, wikipedia);

          });
      } else {
        this.getWikiData(this.wikiDataId, wikipedia);
      }
    }
  }

}
