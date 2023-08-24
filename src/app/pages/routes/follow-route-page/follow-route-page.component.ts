import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CustomFeature } from 'src/app/@core/data/poi.data';
import { Place, Route } from 'src/app/@core/data/route.data';
import { LeafletOverlayBuilderService } from 'src/app/@core/service/leaflet-overlay-builder.service';
import { LocalRouteService } from 'src/app/@core/service/local.route.service';
import { LeafletMapComponent } from 'src/app/custom-components/maps/leaflet-map/leaflet-map.component';

@Component({
  selector: 'travale-follow-route-page',
  templateUrl: './follow-route-page.component.html',
  styleUrls: ['./follow-route-page.component.scss']
})
export class FollowRoutePageComponent implements OnInit, OnDestroy {

  @ViewChild('leafletMap', {static: false}) leafletMap: LeafletMapComponent;

  private route: Route;
  private destroy$: Subject<void> = new Subject<void>();
  showPopup = false;
  popupPlace: Place;

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
    private leafletOverlaysBuilderService: LeafletOverlayBuilderService) { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
    });
  }

  onRouteItemClick(feature: CustomFeature) {
    this.popupPlace = this.route.places.filter(place => place.geoJson.id === feature.id)[0];
    this.showPopup = true;
  }

}