import { Component, HostBinding, Input } from '@angular/core';

export type SlideType = 'from_right' | 'to_right'
@Component({
  selector: 'travale-slide-out',
  styleUrls: ['./slide-out.component.scss'],
  templateUrl: './slide-out.component.html',
})
export class SlideOutComponent {

  @Input() toggled: boolean;
  @Input () mode: SlideType = 'from_right';

  @HostBinding('style.--init-width') @Input() initWidth = '40%';
  @HostBinding('style.--md-width') @Input() mdWidth = '50%';
  @HostBinding('style.--collapsed-width') @Input() collapsedWidth = '6rem';
  @HostBinding('style.--background-opacity') @Input() backgroundOpacity = '0.9';

  @Input() disableManualOpen = false;
  @Input() disableManualClose = false;

  public toggle() {
    this.toggled = !(this.toggled);

  }

  public open() {
    this.toggled = true;
  }

  public close() {
    this.toggled = false;
  }


}
