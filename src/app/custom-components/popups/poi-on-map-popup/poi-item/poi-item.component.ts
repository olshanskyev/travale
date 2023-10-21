import { Component, Input } from '@angular/core';
import { CustomFeature } from 'src/app/@core/data/poi.data';
import { ImageType } from 'src/app/@core/data/route.data';
import { WikiExtraction, WikiPageRef } from 'src/app/@core/data/wiki.data';
import { IconsService } from 'src/app/@core/service/icons.service';

@Component({
  selector: 'travale-poi-item',
  templateUrl: './poi-item.component.html',
  styleUrls: ['./poi-item.component.scss']
})
export class PoiItemComponent {

  @Input() feature: CustomFeature;
  @Input() preferredLanguage: string;
  @Input() wikiPageRef?: WikiPageRef;
  @Input() wikiExtraction?: WikiExtraction;
  @Input() wikiImages?: ImageType[];

  showWikiInfo = false;

  constructor(
    protected iconsService: IconsService) {
  }

}
