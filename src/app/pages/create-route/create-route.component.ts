import { Component, OnInit, ViewChild, OnDestroy, HostBinding } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Route, Place } from 'src/app/@core/data/route.data';

import { SlideOutComponent } from 'src/app/custom-components/slide-out/slide-out.component';
import { LeafletMapComponent } from 'src/app/custom-components/maps/leaflet-map/leaflet-map.component';
import { NbDialogService, NbMediaBreakpointsService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { Subject, takeUntil } from 'rxjs';
import { CustomFeature } from 'src/app/@core/data/poi.data';
import { TranslateService } from '@ngx-translate/core';
import { CitySelectWindowComponent } from 'src/app/custom-components/windows/city-select-window/city-select-window.component';
import { City, CityGeometry } from 'src/app/@core/data/cities.data';
import { EditPlaceWindowComponent } from 'src/app/custom-components/windows/edit-place-window/edit-place-window.component';

@Component({
  selector: 'travale-create-route',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.scss']
})
export class CreateRouteComponent implements OnInit, OnDestroy {

  @ViewChild('slideOut', {static: true}) slideOut: SlideOutComponent;
  @ViewChild('leafletMap', {static: true}) leafletMap: LeafletMapComponent;

  @HostBinding('style.--side-menu-width') sideMenuWidth = '16rem';

  menuCollapsed = false;

  cityName: string;
  country: string;
  route: Route;
  showMapOver = false;
  sizeLessThanXl = false;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute,
    private breakpointService: NbMediaBreakpointsService,
    private themeService: NbThemeService,
    private sideBarService: NbSidebarService,
    private translateService: TranslateService,
    private dialogService: NbDialogService) {
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

  onSavePlace(place: Place) {
    //this.leafletMap.updateRouteLayer(this.route.title, this.route.places.map(item => item.geoJson));
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

  toggleMapClicked() {
    this.showMapOver = !this.showMapOver;
    setTimeout(() => { this.leafletMap.invalidate();}, 10);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
        images: [{
          src: 'assets/test_images/white_tower1.jpg',
          thumb: 'assets/test_images/white_tower1_thumb.jpg'
        }]
      }],
      routeType: 'Main Attractions',
      cityLatitude: 40.61939015,
      cityLongitude: 22.959859730874502,
      cityName: this.cityName,
      country: this.country,
    };
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

    this.sideBarService.onToggle()
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.menuCollapsed = !this.menuCollapsed;
      this.sideMenuWidth = (this.menuCollapsed)? '3.5rem': '16rem';
      setTimeout(() => { this.leafletMap.invalidate();}, 10);
    });

    const { xl } = this.breakpointService.getBreakpointsMap();

    this.themeService.onMediaQueryChange()
      .pipe(
        //map(([, currentBreakpoint]) => currentBreakpoint.width < lg),
        takeUntil(this.destroy$),
      )
      .subscribe(([, currentBreakpoint]) => {
        this.sizeLessThanXl = (currentBreakpoint.width < xl);

    });
  }


}
