import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AggregatedFeatureInfo, CustomFeature } from 'src/app/@core/data/poi.data';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'travale-nearby-pois-on-map-popup',
  templateUrl: './nearby-pois-on-map-popup.component.html',
  styleUrls: ['./nearby-pois-on-map-popup.component.scss']
})
export class NearbyPoisOnMapPopupComponent implements OnChanges {


  @Input() features: CustomFeature[];
  @Input() preferredLanguage: string;
  @Input() addToRouteCallback: (featureInfo: AggregatedFeatureInfo)=> void;
  isAddedToRoute = false;

  public configSwiper: SwiperOptions = {
    autoHeight: true,
    navigation: true,
    pagination: true,
  };

  addToRoute() {
    /*if (this.addToRouteCallback)
      this.addToRouteCallback({feature: this.feature, wikiExtraction: this.wikiExtraction, wikiPageRef: this.wikiPageRef});
    this.isAddedToRoute = true;*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['features'] && changes['features'].currentValue) {
      this.features = changes['features'].currentValue.filter(
        (item: CustomFeature) => {
          return (item.properties.categories)?
            Object.keys(item.properties.categories).filter(key => item.properties.categories && item.properties.categories[key]).length > 0
          : false;
        });
    }
  }

}
