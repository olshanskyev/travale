import { Component,  EventEmitter,  Input, Output } from '@angular/core';
import { Mode } from '../img-uploader-window.component';

@Component({
  selector: 'travale-images-selector',
  templateUrl: './images-selector.component.html',
  styleUrls: ['./images-selector.component.scss']
})
export class ImagesSelectorComponent {

  @Input() imageUrls: string[] = [];
  @Input() selectMode: Mode = 'multi';
  @Output() selected: EventEmitter<string[]> = new EventEmitter();

  selectedArray: boolean[] = [];

  onSelectImage(index: number) {
    if (this.selectedArray.length === 0) {
      this.selectedArray = this.imageUrls.map(() => false);
    }

    if (this.selectMode === 'single') {
      this.selectedArray = this.imageUrls.map(() => false);
    }
    this.selectedArray[index] = !this.selectedArray[index];
    this.selected.emit(this.imageUrls.filter((url, index) => this.selectedArray[index]));
  }
}
