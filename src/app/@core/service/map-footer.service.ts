
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Place } from '../data/route.data';


@Injectable()
export class MapFooterService {

  private showPlaceInfo$ = new Subject<Place>;
  private mapToggle$ = new Subject<void>;


  public onShowPlaceInfo(): Observable<Place> {
    return this.showPlaceInfo$;
  }

  public showPlaceInfo(place: Place) {
    this.showPlaceInfo$.next(place);
  }

  public onMapToggle(): Observable<void> {
    return this.mapToggle$;
  }

  public mapToggled() {
    this.mapToggle$.next();
  }

}