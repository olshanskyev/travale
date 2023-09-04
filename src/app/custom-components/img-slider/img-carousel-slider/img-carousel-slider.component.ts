import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { ImageType } from 'src/app/@core/data/route.data';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'travale-img-carousel-slider',
  templateUrl: './img-carousel-slider.component.html',
  styleUrls: ['./img-carousel-slider.component.scss'],

})
export class ImgCarouselSliderComponent {

  @Input() editable = false;
  @Input() images?: ImageType[] = [];

  constructor(private _lightbox: Lightbox) {
  }

  public fullImgSwiperConfig: SwiperOptions = {
    autoHeight: true,
    spaceBetween: 10,
    navigation: true,
    pagination: true
  };

  public configThumbSwiper: SwiperOptions = {

    autoHeight: true,
    spaceBetween: 10,
    slidesPerView: 'auto',
    centeredSlides: false
  };

  deleteItem(index: number) {
    this.images?.splice(index, 1);
  }

  openImage(index: number) {
    // cloning array - workaround. lightbox.open changes
    // the image caption if it has f.e. cyrillic symbols. why?
    const clonedArray: ImageType[] = [];
    this.images?.forEach(item => clonedArray.push(Object.assign({}, item)));
    if (this.images)
      this._lightbox.open(clonedArray, index, {wrapAround: true});
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
