import { Component, Input } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Place } from 'src/app/@core/data/route.data';
import { ImgUploaderWindowComponent } from '../../windows/img-uploader-window/img-uploader-window.component';
import { LatLng } from 'leaflet';


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

  private defaultImgUploadLimit = 10;
  constructor(private dialogService: NbDialogService) {

  }
  openImgUploaderWindow() {

    const placeLatLng = (this.place.geoJson.geometry.type === 'Point') ?
      new LatLng(this.place.geoJson.geometry.coordinates[1], this.place.geoJson.geometry.coordinates[0]) :
      undefined;

    this.dialogService.open(ImgUploaderWindowComponent, {
      context: {
        uploadMode: 'multi',
        uploadLimit: this.defaultImgUploadLimit - ((this.place.images)? this.place.images.length: 0),
        latlng: placeLatLng,
        placeName: this.place.name,
        wikiDataId: this.place.geoJson.properties.wikidata
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

  recordingFinished(audioRecord: string) {
    this.place.audio = {
      base64: audioRecord,
      source: 'RECORD'
    };
  }

  clearAudio() {
    this.place.audio = undefined;
  }

}

