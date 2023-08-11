import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'travale-confirm-window',
  templateUrl: './confirm-window.component.html'
})
export class ConfirmWindowComponent {

  @Input() text: string;
  constructor(protected ref: NbDialogRef<ConfirmWindowComponent>) { }

}
