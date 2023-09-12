import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LatLng } from 'leaflet';
import { Subject, takeUntil } from 'rxjs';
import { CustomFeature } from 'src/app/@core/data/poi.data';
import { Place, Route } from 'src/app/@core/data/route.data';
import { LeafletOverlayBuilderService } from 'src/app/@core/service/leaflet-overlay-builder.service';
import { LocalRouteService } from 'src/app/@core/service/local.route.service';
import { LeafletMapComponent, Location } from 'src/app/custom-components/maps/leaflet-map/leaflet-map.component';

@Component({
  selector: 'travale-follow-route-page',
  templateUrl: './follow-route-page.component.html',
  styleUrls: ['./follow-route-page.component.scss']
})
export class FollowRoutePageComponent implements OnInit, OnDestroy {

  @ViewChild('leafletMap', {static: false}) leafletMap: LeafletMapComponent;

  route: Route;
  private destroy$: Subject<void> = new Subject<void>();
  showPlacePopup = false;
  showNearbyPlacesPopup = false;
  popupPlace: Place;
  nearbyPlacesToShow: Place[];
  distanceToShowPlace = 25;

  leafletMapInitState() {
    if (this.route && this.leafletMap) {
      this.leafletMap.setBoundingBox(this.route.boundingBox);
      this.leafletMap.setCenterLatLong(this.route.cityLatitude, this.route.cityLongitude);
      this.leafletMap.updateRouteLayer(this.route.id, this.route.title, this.route.color, this.route.places.map(item => item.geoJson));
    }
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private localRouteStorage: LocalRouteService,
    private leafletOverlaysBuilderService: LeafletOverlayBuilderService,
    private _renderer: Renderer2 ) { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this._renderer.removeStyle(document.body, 'overflow');
  }

  ngOnInit(): void {
    this.leafletOverlaysBuilderService.onRouteItemClick().pipe(takeUntil(this.destroy$)).subscribe(res => this.onRouteItemClick(res));
    this.activatedRoute.params.subscribe(params => {
      if (params['source'] && params['id']) {
        if (params['source'] === 'drafts') { // toDo add another source
          this.localRouteStorage.getRouteById(params['id']).subscribe(res => {
            this.route = res;
            this.leafletMapInitState();
          });
        } else {
          this.router.navigate(['/']); //ToDo add error message?
        }

      } else {
        this.router.navigate(['/']); //ToDo add error message?
      }
    }
    );
    this._renderer.setStyle(document.body, 'overflow', 'hidden'); // workaround for mobile layout
  }

  locationChanged(event: {previousLocation?: Location, currentLocation: Location}) {
    // find nearby places
    this.nearbyPlacesToShow = this.route.places.filter(itemPlace => {
      if (itemPlace.geoJson.geometry.type === 'Point') {
        const itemPlaceLatLng = new LatLng(itemPlace.geoJson.geometry.coordinates[1], itemPlace.geoJson.geometry.coordinates[0]);
        return (itemPlaceLatLng.distanceTo(event.currentLocation.latlng) < this.distanceToShowPlace);
      } else {
        return false;
      }
    });
    this.showNearbyPlacesPopup =  (this.nearbyPlacesToShow && this.nearbyPlacesToShow.length > 0 &&
      !this.showPlacePopup); //already open do not disturb
  }

  onRouteItemClick(feature: CustomFeature) {
    this.popupPlace = this.route.places.filter(place => place.geoJson.id === feature.id)[0];
    this.showNearbyPlacesPopup = false;
    this.showPlacePopup = true;
  }

}
