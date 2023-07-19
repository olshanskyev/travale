import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Place } from 'src/app/@core/data/route.data';

@Component({
  selector: 'travale-edit-place-window',
  templateUrl: './edit-place-window.component.html',
  styleUrls: ['./edit-place-window.component.scss']
})
export class EditPlaceWindowComponent {

  constructor(protected ref: NbDialogRef<EditPlaceWindowComponent>) { }

  @Input() place: Place;

  close() {
    this.ref.close({
      place: this.place
    });
  }
}
