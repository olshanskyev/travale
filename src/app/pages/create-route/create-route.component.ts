import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Place, Route } from 'src/app/@core/data/route.data';

import { SlideOutComponent } from 'src/app/custom-components/slide-out/slide-out.component';
import { LeafletMapComponent } from 'src/app/custom-components/maps/leaflet-map/leaflet-map.component';
import { NbDialogService, NbSidebarService } from '@nebular/theme';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { CustomFeature } from 'src/app/@core/data/poi.data';
import { TranslateService } from '@ngx-translate/core';
import { CitySelectWindowComponent } from 'src/app/custom-components/windows/city-select-window/city-select-window.component';
import { City, CityGeometry } from 'src/app/@core/data/cities.data';
import { EditPlaceWindowComponent } from 'src/app/custom-components/windows/edit-place-window/edit-place-window.component';
import { MapSidebarService } from 'src/app/@core/service/map-sidebar.service';

@Component({
  selector: 'travale-create-route',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.scss']
})
export class CreateRouteComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('slideOut', {static: true}) slideOut: SlideOutComponent;
  @ViewChild('leafletMap', {static: true}) leafletMap: LeafletMapComponent;

  cityName: string;
  country: string;
  route: Route;
  showMapOver = false;
  private destroy$: Subject<void> = new Subject<void>();
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private dialogService: NbDialogService,
    private mapSidebarService: MapSidebarService,
    private sidebarService: NbSidebarService
    ) {
  }


  onChangePlaceClicked(place: Place) {
    this.dialogService.open(EditPlaceWindowComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      context: {
        place: place
      },
    });
  }

  onPlacesSequenceChanged(route: Route) {
    this.route = route;
    this.route.places.forEach((item, index) => {
      if (item.geoJson.properties && item.geoJson.properties['route'])
        item.geoJson.properties['route']['order'] = index + 1;
    });

    this.leafletMap.updateRouteLayer(this.route.id, this.route.title, this.route.places.map(item => item.geoJson));
  }

  onRouteTitleChanged() {
    this.leafletMap.updateRouteLayerName(this.route.id, this.route.title);
  }

  onAddToRoute(feature: CustomFeature) {
    const geoJson = feature;
    geoJson.properties.route = {
      order: this.route.places.length + 1
    };
    const newPlace: Place = {
      id: feature.id,
      name: feature.properties?.['name'] as string,
      geoJson: geoJson,
    };
    this.route.places.push(newPlace);
    this.leafletMap.updateRouteLayer(this.route.id, this.route.title, this.route.places.map(item => item.geoJson));
  }

  private buildInitRoute(): Route {
    return {
      id: 'route_' + this.cityName + Math.random(),
      title: this.translateService.instant('createRoute.newRouteIn') + this.cityName,
      places: [{
        id: 123,
        name: 'Test attraction',
        description: 'Long description for attraction',
        geoJson: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [40.640266, 22.939524]
          },
          properties: {
            source: 'nominatim',
            osm_type: 'node'
          }
        },
        images: [
        {
          src: 'assets/test_images/white_tower2.jpg',
          thumb: 'assets/test_images/white_tower2_thumb.jpg'
        },
        {
          src: 'assets/test_images/white_tower1.jpg',
          thumb: 'assets/test_images/white_tower1_thumb.jpg'
        },

        {
          src: 'assets/test_images/white_tower3.jpg',
          thumb: 'assets/test_images/white_tower3_thumb.jpg'
        }
      ]
      }],
      routeType: 'Main Attractions',
      cityLatitude: 40.61939015,
      cityLongitude: 22.959859730874502,
      cityName: this.cityName,
      country: this.country,
    };
  }


  ngAfterViewInit(): void {
    setTimeout(() => { // init leaflet map
      this.leafletMap = this.mapSidebarService.leafletMap;
      this.leafletMap.addToRoute.pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.onAddToRoute(res);
      });
    }, 0);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
     if (!params['cityName'] || !params['country'] || !params['cityLatitude'] || !params['cityLongitude'] || !params['cityBoundingBox']) {
        this.dialogService.open(CitySelectWindowComponent, {
          closeOnBackdropClick: false,
          closeOnEsc: false,
          context: {
          },
          }).onClose.subscribe((result: any) => {
            const city: City = result?.city as City;
            const cityGeometry = result?.cityGeometry as CityGeometry;
            if (city && cityGeometry) {
              this.cityName = city.fullName;
              this.country = city.country;
              this.leafletMap.setBoundingBox(cityGeometry.cityBoundingBox);
              this.leafletMap.setCityLatLong(cityGeometry.lat, cityGeometry.lon);
              this.route = this.buildInitRoute();
            }
          });
      } else {
        this.cityName = params['cityName'];
        this.country = params['country'];
        this.route = this.buildInitRoute();
      }
    });
  }


}
