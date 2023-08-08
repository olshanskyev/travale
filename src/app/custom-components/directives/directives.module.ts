// application-pipes.module.ts
// other imports
import { NgModule } from '@angular/core';
import { BadgeDirective } from './badge.directive';

@NgModule({
  imports: [
  ],
  declarations: [
    BadgeDirective
  ],
  exports: [
    BadgeDirective
  ]
})
export class DirectivesModule {}