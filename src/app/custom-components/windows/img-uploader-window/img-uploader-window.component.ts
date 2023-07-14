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

  //create thumbnail
  thumbnailify(base64Image: string, targetHeight: number): Observable<string> {
    const img = new Image();
    img.src = base64Image;
    return new Observable((subscriber: Subscriber<any>): void => {
      img.onload = () => {
        const width = img.width,
            height = img.height,
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            whRatio = width/height,
            targetWidth = whRatio * targetHeight;

        canvas.height = targetHeight;
        canvas.width = targetWidth;
        if (ctx) {
          ctx.drawImage(
            img,
            0, 0,
            targetWidth, targetHeight
          );

          subscriber.next(canvas.toDataURL());
          subscriber.complete();
        }
      };
    });

  }

  close() {
    // convert to ImageType
    const thumbObservables: Observable<string>[] = this.selectedImages.map(item => this.thumbnailify(item, 120));

    forkJoin(thumbObservables).subscribe(res => {
      const images: ImageType[] = res.map((thumbUrl, index) => {
        return {
          src: this.selectedImages[index],
          thumb: thumbUrl,
        };
      });
      this.ref.close({
        uploadedImages: images
      });
    });
  }
}
