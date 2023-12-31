import { Component, Input } from '@angular/core';
import { IAlbum, Lightbox } from 'ngx-lightbox';
import { ImageType } from 'src/app/@core/data/route.data';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'travale-img-thumbs-slider',
  templateUrl: './img-thumbs-slider.component.html',
  styleUrls: ['./img-thumbs-slider.component.scss'],

})
export class ImgThumbsSliderComponent {
  @Input() images?: ImageType[] = [];

  constructor(private _lightbox: Lightbox) {
  }

  public configThumbSwiper: SwiperOptions = {

    autoHeight: true,
    spaceBetween: 10,
    slidesPerView: 'auto',
    centeredSlides: false,
    navigation: true,
    pagination: true
  };

  openImage(index: number) {
    const clonedArray: ImageType[] = [];
    this.images?.forEach(item => clonedArray.push(Object.assign({}, item)));
    if (this.images)
      this._lightbox.open(clonedArray as IAlbum[], index, {wrapAround: true});
  }


}
