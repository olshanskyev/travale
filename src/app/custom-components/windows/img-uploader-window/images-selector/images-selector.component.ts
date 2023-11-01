import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Mode } from '../img-uploader-window.component';
import { ImageType } from 'src/app/@core/data/route.data';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'travale-images-selector',
  templateUrl: './images-selector.component.html',
  styleUrls: ['./images-selector.component.scss']
})
export class ImagesSelectorComponent implements OnChanges {

  @Input() images: ImageType[] = [];
  @Input() selectMode: Mode = 'multi';
  @Input() selectLimit?: number;
  @Output() selected: EventEmitter<ImageType[]> = new EventEmitter();
  @Output() scrollEnd: EventEmitter<void> = new EventEmitter();
  selectedArray: boolean[] = [];

  constructor(private toastrService: NbToastrService,
    private translateService: TranslateService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images'] && changes['images'].currentValue) {
      this.selectedArray = [];
    }
  }

  onSelectImage(index: number) {
    if (this.selectedArray.length === 0) {
      this.selectedArray = this.images.map(() => false);
    }

    if (this.selectMode === 'single') {
      this.selectedArray = this.images.map(() => false);
    } else {
      if (this.selectLimit !== undefined &&
        !this.selectedArray[index] // new selection (previous value == false)
        ) {
        // number of already selected
        const numberOfAlreadySelected = this.selectedArray.filter(itemSelected => itemSelected).length;
        if (numberOfAlreadySelected >= this.selectLimit) {
          this.toastrService.show(this.translateService.instant('imgUploader.maxNumberOfImgsSelected'), this.translateService.instant('common.warning'), {status: 'warning'});
          return; // do not select new image
        }
      }
    }
    this.selectedArray[index] = !this.selectedArray[index];
    this.selected.emit(this.images.filter((url, index) => this.selectedArray[index]));
  }

  onScroll(event: any) {
    // visible height + pixel scrolled >= total height
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 1) {
      this.scrollEnd.emit();
    }
}

}
