import { Component, Input, SecurityContext, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NbDialogRef, NbIconConfig, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageType, PhotoSource } from 'src/app/@core/data/route.data';
import { Observable, Subscriber, Subscription, debounceTime, distinctUntilChanged, filter, forkJoin, fromEvent, map, of } from 'rxjs';
import { PastvuService } from 'src/app/@core/service/pastvu.service';
import { LatLng } from 'leaflet';
import { PixabayService } from 'src/app/@core/service/pixabay.service';

export type Mode = 'multi' | 'single';

@Component({
  selector: 'travale-img-uploader-window',
  templateUrl: './img-uploader-window.component.html',
  styleUrls: ['./img-uploader-window.component.scss']
})
export class ImgUploaderWindowComponent implements OnInit {

  @Input() uploadMode: Mode = 'multi';
  @Input() latlng?: LatLng; // for searching nearby photos
  @Input() searchPhotoDistance = 600; // for searching nearby photos
  @Input() placeName: string;
  @ViewChild('input', { static: true }) input: ElementRef;
  private pixabaySearchSubscription$: Subscription;

  allowedImgTypes = ['image/jpeg', 'image/png' ,'image/webp' ,'image/avif', 'image/tiff', 'image/gif', 'image/svg+xml'];
  defaultThumbHeight = 120;
  defaultImgMaxSize = 1024;
  defaultImgType = 'image/jpeg';
  defaultImgQuality = 0.8;

  uploadedPhotos: ImageType[] = [];
  droppedPhotos: ImageType[] = [];
  pastvuPhotos: ImageType[] = [];
  pixabayPhotos: ImageType[] = [];
  selectedImages: ImageType[] = [];
  pastvuPhotoSearched = 0;
  pixabayPhotoSearched = 0;
  defaultPageSize = 10;

  tabId: PhotoSource = 'DROPPED';
  pixabaySearchString: string;

  pastvuIconConfig: NbIconConfig = { icon: 'pastvu', pack: 'other' };

  constructor(private toastrService: NbToastrService,
    private translateService: TranslateService,
    protected ref: NbDialogRef<ImgUploaderWindowComponent>,
    private sanitizer: DomSanitizer,
    private pastvuService: PastvuService,
    private pixabayService: PixabayService,
    ) {

  }

  ngOnInit(): void {
    this.pixabaySearchString = this.placeName;
    fromEvent(this.input.nativeElement, 'keyup').pipe(
      map((event: any) => {
        const value = event.target.value;
        if (value.length <= 2) {
          if (this.pixabaySearchSubscription$)
            this.pixabaySearchSubscription$.unsubscribe();
        }
        return value;
      }),
      debounceTime(300),
      distinctUntilChanged(),
      filter(res => (res && res.length > 2)),
    ).subscribe((text: string) => {
      this.firstPixabaySearch(text);
    });
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


  private resizeImageAndConvertIntoBase64(uploadedPhoto: ImageType): Observable<ImageType> {
    return forkJoin([
      (uploadedPhoto.thumb)? this.resizeThumb(uploadedPhoto.thumb) : this.resizeThumb(uploadedPhoto.src),
      this.resizeImage(uploadedPhoto.src)
    ]).pipe(map(([thumb, src]) => {
      return {
        ...uploadedPhoto,
        src: src,
        thumb: thumb
      };
    }));
  }

  private resizeThumb(src: string): Observable<string> { // ToDo losing quality than resizing from big image size
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    return new Observable((subscriber: Subscriber<string>): void => {
      img.onload = () => {
          const whRatio = img.width/img.height,
              targetThumbWidth = whRatio * this.defaultThumbHeight;
          subscriber.next(
              this.imageToDataUri(img, targetThumbWidth, this.defaultThumbHeight),
            );
          subscriber.complete();
        };
      });
  }

  private resizeImage(src: string): Observable<string> {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    return new Observable((subscriber: Subscriber<string>): void => {
      img.onload = () => {
          const whRatio = img.width/img.height;

          let targetImgWidth: number;
          let targetImgHeight: number;
          if (whRatio > 1) {
            targetImgWidth = this.defaultImgMaxSize;
            targetImgHeight = targetImgWidth / whRatio;
          } else {
            targetImgHeight = this.defaultImgMaxSize;
            targetImgWidth = targetImgHeight * whRatio;
          }

          subscriber.next(
            (img.width > this.defaultImgMaxSize || img.height > this.defaultImgMaxSize) ?
                  this.imageToDataUri(img, targetImgWidth, targetImgHeight) : // resize only if image bigger than targetImgSize
                  this.imageToDataUri(img, img.width, img.height)
            );
          subscriber.complete();
        };
      });

  }

  private firstPixabaySearch(pattern: string) {
    if (this.pixabaySearchSubscription$) //unsubscribe if there is still no response
      this.pixabaySearchSubscription$.unsubscribe();
    this.pixabayService.findPhotosByTitle(pattern, this.defaultPageSize, 1).subscribe(res => {
      this.pixabayPhotos = res;
      this.pixabayPhotoSearched = 1;
      this.uploadedPhotos = this.pixabayPhotos;
    });

  }

  onTabChange(event: any) {
    this.selectedImages = [];
    this.tabId = event.tabId;
    if (event.tabId === 'DROPPED') {
      this.uploadedPhotos = this.droppedPhotos;
    } else if (this.tabId === 'PASTVU') {
      this.uploadedPhotos = this.pastvuPhotos;
      if (this.latlng && !this.pastvuPhotoSearched) {
        this.pastvuService.findNearbyPhotos(this.latlng, this.searchPhotoDistance, this.defaultPageSize, 1).subscribe(res => {
          this.pastvuPhotos = res;
          this.pastvuPhotoSearched = 1;
          this.uploadedPhotos = this.pastvuPhotos;
        });
      }

    } else { // PIXABAY
      this.uploadedPhotos = this.pixabayPhotos;
      if (!this.pixabayPhotoSearched && this.pixabaySearchString) {
        this.firstPixabaySearch(this.pixabaySearchString);
      }
    }
  }

  onScrollEnd() {
    // upload further pages
    if (this.tabId === 'PASTVU' && this.latlng && this.pastvuPhotoSearched > 0 && this.pastvuPhotoSearched < 4) {
      this.pastvuService.findNearbyPhotos(this.latlng, this.searchPhotoDistance, this.defaultPageSize, this.pastvuPhotoSearched + 1).subscribe(res => {
        this.pastvuPhotos.push(...res);
        this.pastvuPhotoSearched++;
      });
    }

    if (this.tabId === 'PIXABAY' && this.pixabaySearchString && this.pixabayPhotoSearched > 0 && this.pixabayPhotoSearched < 4) {
      this.pixabayService.findPhotosByTitle(this.pixabaySearchString, this.defaultPageSize, this.pixabayPhotoSearched + 1).subscribe(res => {
        this.pixabayPhotos.push(...res);
        this.pixabayPhotoSearched++;
      });
    }

  }

  close() {
    // resize images
    const thumbObservables: Observable<ImageType>[] = this.selectedImages.map(item =>
      // pastvu images cannot be converted into base64 in a such way (CORS restrictions)
      (item.source !== 'PASTVU')? this.resizeImageAndConvertIntoBase64(item) : of(item)
      );
    forkJoin(thumbObservables).subscribe(res => {
      this.ref.close({
        uploadedImages: res
      });
    });
  }
}
