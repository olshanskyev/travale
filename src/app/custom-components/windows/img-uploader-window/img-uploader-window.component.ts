import { Component, Input, SecurityContext } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageType } from 'src/app/@core/data/route.data';
import { Observable, Subscriber, forkJoin, of } from 'rxjs';
import { PastvuService } from 'src/app/@core/service/pastvu.service';
import { LatLng } from 'leaflet';

export type Mode = 'multi' | 'single';

@Component({
  selector: 'travale-img-uploader-window',
  templateUrl: './img-uploader-window.component.html',
  styleUrls: ['./img-uploader-window.component.scss']
})
export class ImgUploaderWindowComponent {

  @Input() uploadMode: Mode = 'multi';
  @Input() latlng?: LatLng; // for searching nearby photos
  @Input() searchPhotoDistance = 600; // for searching nearby photos
  @Input() placeName: string;

  allowedImgTypes = ['image/jpeg', 'image/png' ,'image/webp' ,'image/avif', 'image/tiff', 'image/gif', 'image/svg+xml'];
  defaultThumbHeight = 120;
  defaultImgMaxSize = 1024;
  defaultImgType = 'image/jpeg';
  defaultImgQuality = 0.8;

  uploadedPhotos: ImageType[] = [];
  droppedPhotos: ImageType[] = [];
  pastvuPhotos: ImageType[] = [];
  selectedImages: ImageType[] = [];
  pastvuPhotoSearched = 0;
  defaultPageSize = 10;

  tabId = '1';

  constructor(private toastrService: NbToastrService,
    private translateService: TranslateService,
    protected ref: NbDialogRef<ImgUploaderWindowComponent>,
    private sanitizer: DomSanitizer,
    private pastvuService: PastvuService
    ) {

  }

  private readBlobAsImage(blob: Blob) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(blob);
    fileReader.onloadend = () => {
      const src = this.sanitizer.sanitize(SecurityContext.URL, this.sanitizer.bypassSecurityTrustUrl('' + fileReader.result));
      if (src) {
        this.droppedPhotos.push({src: src, source: 'DROPPED'});
      }

    };
  }

  public dropped(files: NgxFileDropEntry[]) {
    files.forEach(item => {
      if (!item.fileEntry.isFile) {
        this.toastrService.show(this.translateService.instant('imgUploader.errors.isNotAFile', {name: item.fileEntry.name}), this.translateService.instant('common.warning'), {status: 'warning'});
      }

      const fileEntry = item.fileEntry as FileSystemFileEntry;
      fileEntry.file(file => {
        if (!this.allowedImgTypes.includes(file.type)) {
          this.toastrService.show(this.translateService.instant('imgUploader.errors.notAllowedFileType'), this.translateService.instant('common.error'), {status: 'danger'});
          return;
        }
        this.readBlobAsImage(file.slice(0, file.size, 'string'));
      });
    });

  }

  onImgSelected(images: ImageType[]) {
    this.selectedImages = images;
  }

  private imageToDataUri(img: HTMLImageElement, width: number, height: number) {
    // create an off-screen canvas
    const canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d');
    // set its dimension to target size
    canvas.width = width;
    canvas.height = height;
    if (ctx)
      // draw source image into the off-screen canvas:
      ctx.drawImage(img, 0, 0, width, height);

    // encode image to data-uri with base64 version of compressed image
    return canvas.toDataURL(this.defaultImgType, this.defaultImgQuality);
  }

  //create thumbnail and reduce img size
  private resizeImage(uploadedPhoto: ImageType, targetThumbHeight: number, targetImgSize: number): Observable<ImageType> {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = uploadedPhoto.src;
    return new Observable((subscriber: Subscriber<ImageType>): void => {
      img.onload = () => {
        const whRatio = img.width/img.height,
              targetThumbWidth = whRatio * targetThumbHeight;
        let targetImgWidth: number;
        let targetImgHeight: number;
        if (whRatio > 1) {
          targetImgWidth = targetImgSize;
          targetImgHeight = targetImgWidth / whRatio;
        } else {
          targetImgHeight = targetImgSize;
          targetImgWidth = targetImgHeight * whRatio;
        }
          uploadedPhoto.src = this.imageToDataUri(img, targetImgWidth, targetImgHeight);
          uploadedPhoto.thumb = this.imageToDataUri(img, targetThumbWidth, targetThumbHeight);
          subscriber.next({
            ...uploadedPhoto,
            src: this.imageToDataUri(img, targetImgWidth, targetImgHeight),
            thumb: this.imageToDataUri(img, targetThumbWidth, targetThumbHeight),
            });
          subscriber.complete();
        };
      });

  }

  onTabChange(event: any) {
    this.selectedImages = [];
    this.tabId = event.tabId;
    if (event.tabId === '1') {
      this.uploadedPhotos = this.droppedPhotos;
    } else { // tabId === '2' pastvu
      this.uploadedPhotos = this.pastvuPhotos;
      if (this.latlng && !this.pastvuPhotoSearched) {
        this.pastvuService.findNearbyPhotos(this.latlng, this.searchPhotoDistance, this.defaultPageSize, 1).subscribe(res => {
          this.pastvuPhotos = res;
          this.pastvuPhotoSearched = 1;
          this.uploadedPhotos = this.pastvuPhotos;
        });
      }

    }
  }

  onScrollEnd() {
    if (this.tabId === '2' && this.latlng && this.pastvuPhotoSearched > 0 && this.pastvuPhotoSearched < 4) { // upload second page for pastvu
      this.pastvuService.findNearbyPhotos(this.latlng, this.searchPhotoDistance, this.defaultPageSize, this.pastvuPhotoSearched + 1).subscribe(res => {
        this.pastvuPhotos.push(...res);
        this.pastvuPhotoSearched++;
      });
    }
  }

  close() {
    // resize images
    const thumbObservables: Observable<ImageType>[] = this.selectedImages.map(item =>
      (!item.caption)? this.resizeImage(item, this.defaultThumbHeight, this.defaultImgMaxSize) : of(item)
      );
    forkJoin(thumbObservables).subscribe(res => {
      this.ref.close({
        uploadedImages: res
      });
    });
  }
}
