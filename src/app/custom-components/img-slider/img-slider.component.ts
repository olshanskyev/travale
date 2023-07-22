import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, HostBinding, Input } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { ImageType } from 'src/app/@core/data/route.data';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'travale-img-slider',
  templateUrl: './img-slider.component.html',
  styleUrls: ['./img-slider.component.scss'],

})
export class ImgSliderComponent {

  @Input() editable = false;
  @Input() images?: ImageType[] = [];

  @Input() @HostBinding('style.--swiper-max-width') swiperMaxWidth = '545px';

  constructor(private _lightbox: Lightbox) {
  }

  public fullImgSwiperConfig: SwiperOptions = {
    autoHeight: true,
    spaceBetween: 10,
    navigation: true,
  };

  public configThumbSwiper: SwiperOptions = {

    autoHeight: true,
    spaceBetween: 5,
    //navigation: true,

    slidesPerView: 'auto',
    centeredSlides: false,
    /*injectStyles: [
      `
          :root {
            --swiper-navigation-size: 20px;
            --swiper-navigation-color: grey;
          }
          .swiper-button-next, .swiper-button-prev {
            margin-top: calc(-5px - (var(--swiper-navigation-size)/ 2));
            width: var(--swiper-navigation-size);
            border-radius: 100%;
            background-color: rgba(255,255,255,0.6);
            padding: 5px;
          }

      `
    ],*/

  };

  deleteItem(index: number) {
    this.images?.splice(index, 1);
  }

  openImage(index: number) {
    if (this.images)
      this._lightbox.open(this.images, index);
  }

  moveToLeft(index: number) {
    if (this.images)
     moveItemInArray(this.images, index, index - 1);
  }

  moveToRight(index: number) {
    if (this.images)
      moveItemInArray(this.images, index, index + 1);
  }

}
