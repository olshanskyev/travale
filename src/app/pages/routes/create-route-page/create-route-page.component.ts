import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Place, Route } from 'src/app/@core/data/route.data';
import { LeafletMapComponent } from 'src/app/custom-components/maps/leaflet-map/leaflet-map.component';
import { NbDialogService } from '@nebular/theme';
import { Observable, Subject, Subscription, interval, takeUntil } from 'rxjs';
import { CitySelectWindowComponent } from 'src/app/custom-components/windows/city-select-window/city-select-window.component';
import { City, CityGeometry } from 'src/app/@core/data/cities.data';
import { MapSidebarService } from 'src/app/@core/service/map-sidebar.service';
import { AggregatedFeatureInfo, CustomFeature } from 'src/app/@core/data/poi.data';
import { LocalRouteService } from 'src/app/@core/service/local.route.service';
import { LeafletOverlayBuilderService } from 'src/app/@core/service/leaflet-overlay-builder.service';
import { MapFooterService } from 'src/app/@core/service/map-footer.service';


@Component({
  selector: 'travale-create-route-page',
  templateUrl: './create-route-page.component.html',
  styleUrls: ['./create-route-page.component.scss']
})
export class CreateRoutePageComponent implements OnInit, OnDestroy, AfterViewInit {

  leafletMap: LeafletMapComponent;

  route: Route;
  localId: string;
  routeAutoSaveInterval = 5000;

  showMapOver = false;
  private destroy$: Subject<void> = new Subject<void>();
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
    private dialogService: NbDialogService,
    private mapSidebarService: MapSidebarService,
    private mapFooterService: MapFooterService,
    private localRouteService: LocalRouteService,
    private router: Router,
    private leafletOverlaysBuilderService: LeafletOverlayBuilderService

    ) {
  }

  onPlacesSequenceChanged(route: Route) {
    this.route = route;
    this.route.places.forEach((item, index) => {
      if (item.geoJson.properties && item.geoJson.properties['route'])
        item.geoJson.properties['route']['order'] = index + 1;
    });

    this.leafletMap.updateRouteLayer(this.route.id, this.route.title, this.route.color, this.route.places.map(item => item.geoJson));
  }

  onRouteTitleChanged() {
    this.leafletMap.updateRouteLayerName(this.route.id, this.route.title);
  }

  onRouteColorChanged() {
    this.leafletMap.updateRouteColor(this.route.id, this.route.color);
  }

  leafletMapInitState() {
    if (this.route && this.leafletMap) {
      this.leafletMap.setBoundingBox(this.route.boundingBox);
      this.leafletMap.setCenterLatLong(this.route.cityLatitude, this.route.cityLongitude);
      this.leafletMap.updateRouteLayer(this.route.id, this.route.title, this.route.color, this.route.places.map(item => item.geoJson));
    }
  }
  onAddToRoute(featureInfo: AggregatedFeatureInfo) {
    const geoJson = featureInfo.feature;
    geoJson.properties.route = {
      order: this.route.places.length + 1,

    };
    const name = (featureInfo.feature.properties?.['name_loc'])? featureInfo.feature.properties?.['name_loc']:
            ((featureInfo.feature.properties?.['name_en'])? featureInfo.feature.properties?.['name_en']: featureInfo.feature.properties?.['name']);
    const newPlace: Place = {
      id: featureInfo.feature.id,
      name: (name)? name: '',
      description: featureInfo.wikiExtraction?.extract,
      wikiPageRef: featureInfo.wikiPageRef,
      geoJson: geoJson,
    };
    this.route.places.push(newPlace);
    this.leafletMap.updateRouteLayer(this.route.id, this.route.title, this.route.color, this.route.places.map(item => item.geoJson));
  }


  onRouteItemClick(feature: CustomFeature) {
    const place = this.route.places.filter(place => place.geoJson.id === feature.id)[0];
    this.mapFooterService.showPlaceInfo(place);
  }

  ngAfterViewInit(): void {
    setTimeout(() => { // init leaflet map
      this.leafletMap = this.mapSidebarService.leafletMap;
      this.leafletMap.cityBoundingBoxChange.subscribe(citybbox => {
        this.route.boundingBox = citybbox;
      });
      this.leafletMapInitState();
    }, 0);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    interval(this.routeAutoSaveInterval).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.routeAutoSave();
    });
    this.leafletOverlaysBuilderService.onAddToRoute().pipe(takeUntil(this.destroy$)).subscribe(res => this.onAddToRoute(res));
    this.leafletOverlaysBuilderService.onRouteItemClick().pipe(takeUntil(this.destroy$)).subscribe(res => this.onRouteItemClick(res));
    this.activatedRoute.queryParams.subscribe(params => {
      if (!params['id']) {
        this.dialogService.open(CitySelectWindowComponent, {
          closeOnBackdropClick: false,
          closeOnEsc: false,
          context: {
          },
          dialogClass: 'animated-dialog'
          }).onClose.subscribe((result: any) => {
            if (result) {
              const city: City = result?.city as City;
              const cityGeometry = result?.cityGeometry as CityGeometry;
              const emptyRoute = this.localRouteService.initEmptyRoute(city, cityGeometry);
              this.localRouteService.addRoute(emptyRoute).subscribe(addedRoute => {
                this.router.navigate([this.router.url], {queryParams: {id: addedRoute.localId}});
              });
            }
          });
      } else {
        this.localId = params['id'];
        this.localRouteService.getRouteById(this.localId).subscribe(gotRoute => {
          if (gotRoute) {
            this.route = gotRoute;
            this.leafletMapInitState();
          }
          else {
            // route note found navigate to create new route
            // ToDo add notification
            this.router.navigate(['pages/routes/create'] );
          }
        });
      }

    });
  }

  routeAutoSave() {
    if (this.route) {
      this.localRouteService.updateRoute(this.localId, this.route).subscribe();
    }
  }

}
