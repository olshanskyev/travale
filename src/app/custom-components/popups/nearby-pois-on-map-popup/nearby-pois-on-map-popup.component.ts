import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LatLng } from 'leaflet';
import { AggregatedFeatureInfo, CustomFeature } from 'src/app/@core/data/poi.data';
import Swiper, { SwiperOptions } from 'swiper';
import genUniqueId from '../../../@core/data/route.data';
import { WikiService } from 'src/app/@core/service/wiki.service';
import { WikiExtraction, WikiPageRef } from 'src/app/@core/data/wiki.data';

@Component({
  selector: 'travale-nearby-pois-on-map-popup',
  templateUrl: './nearby-pois-on-map-popup.component.html',
  styleUrls: ['./nearby-pois-on-map-popup.component.scss']
})
export class NearbyPoisOnMapPopupComponent implements OnChanges {

  @Input() features: CustomFeature[];
  @Input() preferredLanguage: string;
  @Input() position: LatLng;
  @Input() addToRouteCallback: (featureInfo: AggregatedFeatureInfo)=> void;
  @Input() nearbyPoiSelectedCallback: (feature: CustomFeature)=> void;

  constructor(private translateService: TranslateService,
    private wikiService: WikiService) {

  }

  wikiPageRefs: WikiPageRef[] = [];
  wikiExtractions: WikiExtraction[] = [];

  activeSlideIndex = 0;

  public configSwiper: SwiperOptions = {
    navigation: true,
    pagination: true,
    on: {
      slideChange: (swiper) => this.onSlideChange(swiper)
    }
  };

  addToRoute() {
    if (this.addToRouteCallback) {
      const feature: CustomFeature = (this.features.length > 0)? this.features[this.activeSlideIndex]: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [this.position.lng, this.position.lat]
        },
        id: genUniqueId(),
        properties: {
          name: this.translateService.instant('leafletMap.emptyPlaceName'),
          source: 'manually_added'
        }
      };
      this.addToRouteCallback({feature: feature, wikiExtraction: undefined, wikiPageRef: undefined});
    }
  }

  loadWikiData() {
    this.features.forEach(feature => {
      const wikipedia = feature.properties?.wikipedia;
      const wikidata = feature.properties?.wikidata;

      if (wikidata && wikipedia) { // if wikipedia tag presents in reply, we can find wikipedia page on wikidata
        const defLangPrefix = wikipedia?.substring(0, wikipedia.indexOf(':'));
        let wikiPageRef: WikiPageRef;
        this.wikiService.getWikiPageByWikiData([this.preferredLanguage, 'en', defLangPrefix], wikidata).subscribe( article => {
          if (article) {
            wikiPageRef = article;
          } else {  //article not found, take wikipedia string and parse
              const wikiName = wikipedia?.substring(wikipedia.indexOf(':') + 1, wikipedia.length);
              if (wikiName) {
                wikiPageRef = {
                  title: wikiName,
                  language: defLangPrefix,
                  url: `https://${defLangPrefix}.wikipedia.org/wiki/${wikiName}`
                };
              }
          }
          if (wikiPageRef) {
            this.wikiPageRefs.push(wikiPageRef);
            this.wikiService.extractTextFromArticle(wikiPageRef.language, wikiPageRef.title, 10).subscribe( wikiRes => {
              this.wikiExtractions.push(wikiRes);
          });
          }

        });
      }
    });

  }

  onSlideChange(swiper: Swiper) {
    this.activeSlideIndex = swiper.activeIndex;
    this.nearbyPoiSelectedCallback(this.features[swiper.activeIndex]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['features'] && changes['features'].currentValue) {
      this.features = changes['features'].currentValue.filter( //filter empty features
        (item: CustomFeature) => {
          return (item.properties.categories)?
            Object.keys(item.properties.categories).filter(key => item.properties.categories && item.properties.categories[key]).length > 0
          : false;
        });
      if (this.features.length > 0) {
        this.nearbyPoiSelectedCallback(this.features[0]);
        this.loadWikiData();
      }

    }
  }

}
