import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'travale-marker-icon',
    template: `
        <span #rootElem style="
            font-size: 2rem;
            color: var(--text-color);
            display: inline-block;
            font-weight: 700;
            position: relative;
            text-align: center;">
          <span style="
            font-size: var(--font-size);
            left: 0;
            position: absolute;
            right: 0;
            top:var(--text-top)"><ng-content></ng-content></span>
          <span style="color: var(--marker-color)">
            <svg style="width: var(--marker-size)" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path fill="currentColor" d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z"/>
            </svg>
          </span>
        </span>`,
  styleUrls: ['./marker-icon.component.scss']
})
export class MarkerIconComponent {
  @HostBinding('style.--text-color') @Input() textColor = 'white';
  @HostBinding('style.--marker-color') @Input() markerColor = 'blue';
  @HostBinding('style.--marker-size') @Input() markerSize = '0.75em';
  @HostBinding('style.--font-size') @Input() fontSize = '0.5em';
  @HostBinding('style.--text-top') @Input() textTop = '0.2em';
}
