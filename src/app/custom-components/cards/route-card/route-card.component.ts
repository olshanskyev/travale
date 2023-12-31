import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Route, Place } from 'src/app/@core/data/route.data';
import { ImgUploaderWindowComponent } from '../../windows/img-uploader-window/img-uploader-window.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { SelectColorWindowComponent } from '../../windows/select-color-window/select-color-window.component';
import { EditPlaceWindowComponent } from '../../windows/edit-place-window/edit-place-window.component';
import { ConfirmWindowComponent } from '../../windows/confirm-window/confirm-window.component';
import { TranslateService } from '@ngx-translate/core';
import { LatLng } from 'leaflet';

@Component({
  selector: 'travale-route-card',
  templateUrl: './route-card.component.html',
  styleUrls: ['./route-card.component.scss']
})

export class RouteCardComponent implements OnChanges {

  @Input() route: Route;
  @Input() previewMode = false;
  @Output() placesSequenceChanged: EventEmitter<Route> = new EventEmitter();
  @Output() routeTitleChanged: EventEmitter<string> = new EventEmitter();
  @Output() routeColorChanged: EventEmitter<string> = new EventEmitter();

  @HostBinding('style.--route-color') routeColor: string;

  titleUpdate = new Subject<string>();

  constructor(private dialogService: NbDialogService, private translateService: TranslateService ) {

    this.titleUpdate.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(value => {
        this.routeTitleChanged.emit(value);
      });

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['route'] && changes['route'].currentValue) {
      this.route = changes['route'].currentValue;
      this.routeColor = this.route.color;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.route?.places) {
      moveItemInArray(this.route?.places, event.previousIndex, event.currentIndex);
      this.placesSequenceChanged.emit(this.route);
    }

  }

  onChangePlaceClick(place: Place) {
    this.dialogService.open(EditPlaceWindowComponent, {
      context: {
        place: place
      },
      dialogClass: 'animated-dialog'
    });
  }

  onDeletePlaceClick(index: number, place: Place) {
    this.dialogService.open(ConfirmWindowComponent, {
      context: {
        text: this.translateService.instant('createRoute.deletePlace', {place: place.name})
      },
      dialogClass: 'animated-dialog'
    }).onClose.subscribe(isOk => {
      if (isOk) {
        this.route?.places.splice(index, 1);
        this.placesSequenceChanged.emit(this.route);
      }

    });
  }

  onUploadImgClick() {
    this.dialogService.open(ImgUploaderWindowComponent, {
      context: {
        uploadMode: 'single',
        latlng: new LatLng(this.route.cityLatitude, this.route.cityLongitude),
        searchPhotoDistance: 5000,
        placeName: this.route.cityName
      },
      dialogClass: 'animated-dialog'
    })
    .onClose.subscribe((result: any) => {
      if (result && result.uploadedImages && result.uploadedImages.length > 0 && this.route) {
        this.route.image = result.uploadedImages[0];
      }

    });
  }

  onSelectColor() {
    this.dialogService.open(SelectColorWindowComponent, {
      context: {
        selectedColor: this.routeColor,
      },
      dialogClass: 'animated-dialog'
    }).onClose.subscribe(context => {
      if (context?.selectedColor && context.selectedColor !== this.route.color) {
        this.routeColor = context.selectedColor;
        this.route.color = this.routeColor;
        this.routeColorChanged.emit(this.routeColor);
      }
    });

  }

}
