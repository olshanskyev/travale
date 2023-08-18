import { Component, Input, SecurityContext } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageType } from 'src/app/@core/data/route.data';
import { Observable, Subscriber, forkJoin } from 'rxjs';

export type Mode = 'multi' | 'single';

@Component({
  selector: 'travale-img-uploader-window',
  templateUrl: './img-uploader-window.component.html',
  styleUrls: ['./img-uploader-window.component.scss']
})
export class ImgUploaderWindowComponent {

  @Input() uploadMode: Mode = 'multi';

  allowedImgTypes = ['image/jpeg', 'image/png' ,'image/webp' ,'image/avif', 'image/tiff', 'image/gif', 'image/svg+xml'];
  defaultThumbHeight = 120;
  defaultImgMaxSize = 1024;
  defaultImgType = 'image/jpeg';
  defaultImgQuality = 0.8;

  constructor(private toastrService: NbToastrService,
    private translateService: TranslateService,
    protected ref: NbDialogRef<ImgUploaderWindowComponent>,
    private sanitizer: DomSanitizer) {

  }

  droppedImgUrls: string[] = [];
  selectedImages: string[] = [];

  private readBlobAsImage(blob: Blob) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(blob);
    fileReader.onloadend = () => {
      const src = this.sanitizer.sanitize(SecurityContext.URL, this.sanitizer.bypassSecurityTrustUrl('' + fileReader.result));
      if (src) {
        this.droppedImgUrls.push(src);
      }

    };
  }

  public dropped(files: NgxFileDropEntry[]) {
    files.forEach(item => {
      if (!item.fileEntry.isFile) {
        this.toastrService.show(this.translateService.instant('imgSlider.errors.isNotAFile', {name: item.fileEntry.name}), this.translateService.instant('common.warning'), {status: 'warning'});
      }

      const fileEntry = item.fileEntry as FileSystemFileEntry;
      fileEntry.file(file => {
        if (!this.allowedImgTypes.includes(file.type)) {
          this.toastrService.show(this.translateService.instant('imgSlider.errors.notAllowedFileType'), this.translateService.instant('common.error'), {status: 'danger'});
          return;
        }
        this.readBlobAsImage(file.slice(0, file.size, 'string'));
      });
    });

  }

  onImgSelected(images: string[]) {
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
  private resizeImage(base64Image: string, targetThumbHeight: number, targetImgSize: number): Observable<ImageType> {
    const img = new Image();
    img.src = base64Image;
    return new Observable((subscriber: Subscriber<any>): void => {
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

          subscriber.next({
            src: this.imageToDataUri(img, targetImgWidth, targetImgHeight),
            thumb: this.imageToDataUri(img, targetThumbWidth, targetThumbHeight)
            });
          subscriber.complete();
        };
      });

  }

  close() {
    // resize images
    const thumbObservables: Observable<ImageType>[] = this.selectedImages.map(item => this.resizeImage(item, this.defaultThumbHeight, this.defaultImgMaxSize));
    forkJoin(thumbObservables).subscribe(res => {
      this.ref.close({
        uploadedImages: res
      });
    });
  }
}
