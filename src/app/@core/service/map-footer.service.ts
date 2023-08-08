
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Place } from '../data/route.data';


@Injectable()
export class MapFooterService {

  private showPlaceInfo$ = new Subject<Place>;

  public onShowPlaceInfo(): Observable<Place> {
    return this.showPlaceInfo$;
  }

  public showPlaceInfo(place: Place) {
    this.showPlaceInfo$.next(place);
  }

}