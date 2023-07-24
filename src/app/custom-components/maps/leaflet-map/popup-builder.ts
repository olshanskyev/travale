import { CustomFeature } from 'src/app/@core/data/poi.data';
import { BadgeDirective } from '../../directives/badge.directive';
import { IconsService } from 'src/app/@core/service/icons.service';
import { TranslateService } from '@ngx-translate/core';

export class PopupBuilder {

    constructor(
        private addToRouteCallback: (feature: CustomFeature)=> void,
        private iconsService: IconsService,
        private translateService: TranslateService ) {

    }


    public buildPopupDiv(feature: CustomFeature) {
        const div = document.createElement('div');

        const historic = feature.properties?.categories?.['historic'];
        const tourism = feature.properties?.categories?.['tourism'];
        const historicString = (historic)?
            `<span class="travale-badge" style="background-color: ${this.iconsService.getIconColorByKey(historic)}"> ${this.translateService.instant('leafletMap.' + historic)} </span>` : '';
        const tourismString = (tourism)?
            `<span class="travale-badge" style="background-color: ${this.iconsService.getIconColorByKey(tourism)}"> ${this.translateService.instant('leafletMap.' + tourism)} </span>` : '';

        const nameString = `<div class="subtitle w-100"> ${(feature.properties?.['name'])?feature.properties?.['name']: ''}</div>`;
        div.innerHTML = nameString + historicString + tourismString;

        const button = document.createElement('button');
        button.setAttribute('nbButton','');
        button.setAttribute('class', 'appearance-filled full-width size-small shape-round status-primary mt-2');
        button.innerHTML = this.translateService.instant('leafletMap.addToRoute');
        button.onclick = () => this.addToRouteCallback(feature);
        div.setAttribute('style', 'max-width: 300px; min-width: 100px');
        div.appendChild(button);
        return div;
    }
}