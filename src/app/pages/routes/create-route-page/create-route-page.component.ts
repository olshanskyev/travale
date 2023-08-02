import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Place, Route } from 'src/app/@core/data/route.data';
import { SlideOutComponent } from 'src/app/custom-components/slide-out/slide-out.component';
import { LeafletMapComponent } from 'src/app/custom-components/maps/leaflet-map/leaflet-map.component';
import { NbDialogService } from '@nebular/theme';
import { Observable, Subject, Subscription, interval, takeUntil } from 'rxjs';
import { CitySelectWindowComponent } from 'src/app/custom-components/windows/city-select-window/city-select-window.component';
import { City, CityGeometry } from 'src/app/@core/data/cities.data';
import { MapSidebarService } from 'src/app/@core/service/map-sidebar.service';
import { AggregatedFeatureInfo } from 'src/app/@core/data/poi.data';
import { LocalRouteService } from 'src/app/@core/service/local.route.service';
import { LatLngBounds } from 'leaflet';


@Component({
  selector: 'travale-create-route-page',
  templateUrl: './create-route-page.component.html',
  styleUrls: ['./create-route-page.component.scss']
})
export class CreateRoutePageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('slideOut', {static: true}) slideOut: SlideOutComponent;
  @ViewChild('leafletMap', {static: true}) leafletMap: LeafletMapComponent;

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
    private localRouteService: LocalRouteService,
    private router: Router
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
      geoJson: geoJson,
    };
    this.route.places.push(newPlace);
    this.leafletMap.updateRouteLayer(this.route.id, this.route.title, this.route.color, this.route.places.map(item => item.geoJson));
  }

  ngAfterViewInit(): void {
    setTimeout(() => { // init leaflet map
      this.leafletMap = this.mapSidebarService.leafletMap;
      if (this.route) {
        this.leafletMap.setBoundingBox(this.route.boundingBox);
        this.leafletMap.setCityLatLong(this.route.cityLatitude, this.route.cityLongitude);
      }

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
    interval(this.routeAutoSaveInterval).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.routeAutoSave();
    });
    this.activatedRoute.queryParams.subscribe(params => {
      if (!params['id']) {
        this.dialogService.open(CitySelectWindowComponent, {
          closeOnBackdropClick: false,
          closeOnEsc: false,
          context: {
          },
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
            // how to synchronize/desynchronize
            this.route.boundingBox = new LatLngBounds((this.route.boundingBox as any)._southWest, (this.route.boundingBox as any)._northEast);
            if (this.leafletMap) {
              this.leafletMap.setBoundingBox(this.route.boundingBox);
              this.leafletMap.setCityLatLong(this.route.cityLatitude, this.route.cityLongitude);
              this.leafletMap.updateRouteLayer(this.route.id, this.route.title, this.route.color, this.route.places.map(item => item.geoJson));
            }
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
