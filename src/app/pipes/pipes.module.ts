// application-pipes.module.ts
// other imports
import { NgModule } from '@angular/core';
import { ShortUrlPipe } from './short-domain.pipe';

@NgModule({
  imports: [
  ],
  declarations: [
    ShortUrlPipe
  ],
  exports: [
    ShortUrlPipe
  ]
})
export class PipesModule {}