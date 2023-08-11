import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'travale-text-area-window',
  templateUrl: './textarea-window.component.html',
  styleUrls: ['./textarea-window.component.scss']
})
export class TextAreaWindowComponent {

  constructor(protected ref: NbDialogRef<TextAreaWindowComponent>) {
  }

  @Input() value?: string;
  @Input() readonly = false;
  @Input() placeholder?: string;

  done() {
    this.ref.close(this.value);
  }
}
