import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'travale-select-color-window',
  templateUrl: './select-color-window.component.html',
  styleUrls: ['./select-color-window.component.scss']
})
export class SelectColorWindowComponent {

  @Input() selectedColor: string;
  colors: string[] = ['rgb(104, 156, 84)', 'rgb(70, 205, 207)', 'rgb(52, 152, 219)', 'rgb(63, 82, 227)',
                      'rgb(119, 87, 130)', 'rgb(226, 62, 87)', 'rgb(247, 89, 64)', 'rgb(236, 155, 59)',
                      'rgb(12, 93, 60)', 'rgb(33, 91, 99)', 'rgb(0, 74, 124)', 'rgb(44, 54, 93)',
                      'rgb(74, 38, 106)', 'rgb(136, 48, 78)', 'rgb(166, 73, 66)', 'rgb(178, 90, 48)'
                    ];

  constructor(protected ref: NbDialogRef<SelectColorWindowComponent>) {
  }

  onColorClick(color: string) {
    this.selectedColor = color;
  }

  close() {
    this.ref.close({
      selectedColor: this.selectedColor
    });
  }

}
