import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Route, Place } from 'src/app/@core/data/route.data';
import { ImgUploaderWindowComponent } from '../../windows/img-uploader-window/img-uploader-window.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'travale-route-card',
  templateUrl: './route-card.component.html',
  styleUrls: ['./route-card.component.scss']
})

export class RouteCardComponent  {

  @Input() route?: Route;
  @Output() changePlaceClicked: EventEmitter<Place> = new EventEmitter();
  @Output() placesSequenceChanged: EventEmitter<Route> = new EventEmitter();
  @Output() routeTitleChanged: EventEmitter<string> = new EventEmitter();

  titleUpdate = new Subject<string>();

  constructor(private dialogService: NbDialogService ) {

    this.titleUpdate.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(value => {
        this.routeTitleChanged.emit(value);
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.route?.places) {
      moveItemInArray(this.route?.places, event.previousIndex, event.currentIndex);
      this.placesSequenceChanged.emit(this.route);
    }

  }

  onChangePlaceClick(place: Place) {
    this.changePlaceClicked.emit(place);
  }

  onDeletePlaceClick(index: number) {
    this.route?.places.splice(index, 1);
    this.placesSequenceChanged.emit(this.route);
  }

  onUploadImgClick() {
    this.dialogService.open(ImgUploaderWindowComponent, {
      context: {
        uploadMode: 'single',
      },
    })
    .onClose.subscribe((result: any) => {
      if (result && result.uploadedImages && result.uploadedImages.length > 0 && this.route) {
        this.route.image = result.uploadedImages[0];
      }

    });
  }

}
