import { Directive, HostBinding, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: 'span[travaleBadge]',
})
export class BadgeDirective {
  @Input() @HostBinding('style.background-color') badgeColor: string;
  constructor(renderer: Renderer2,
            elementRef: ElementRef) {

    renderer.addClass(elementRef.nativeElement, 'travale-badge');

   }
}
