import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Mode } from '../img-uploader-window.component';
import { ImageType } from 'src/app/@core/data/route.data';


@Component({
  selector: 'travale-images-selector',
  templateUrl: './images-selector.component.html',
  styleUrls: ['./images-selector.component.scss']
})
export class ImagesSelectorComponent implements OnChanges {

  @Input() images: ImageType[] = [];
  @Input() selectMode: Mode = 'multi';
  @Output() selected: EventEmitter<ImageType[]> = new EventEmitter();
  @Output() scrollEnd: EventEmitter<void> = new EventEmitter();
  selectedArray: boolean[] = [];

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
