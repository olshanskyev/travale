import { Component, Input } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Place } from 'src/app/@core/data/route.data';
import { ImgUploaderWindowComponent } from '../../windows/img-uploader-window/img-uploader-window.component';


type ModeType = 'full' | 'compact';

@Component({
  selector: 'travale-place-card',
  templateUrl: './place-card.component.html',
  styleUrls: ['./place-card.component.scss']
})
export class PlaceCardComponent {

  @Input() mode: ModeType = 'compact';
  @Input() editable = false;
  @Input() place: Place;

  constructor(private dialogService: NbDialogService) {

  }
  openImgUploaderWindow() {
    this.dialogService.open(ImgUploaderWindowComponent, {
      context: {
        uploadMode: 'multi',
      },
      dialogClass: 'animated-dialog'
    })
    .onClose.subscribe((result: any) => {
      if (result && result.uploadedImages)
        if (this.place.images)
          this.place.images = this.place.images?.concat(result.uploadedImages);
        else
          this.place.images = result.uploadedImages;
    });
    }
  }

