import { CustomFeature } from 'src/app/@core/data/poi.data';
import { IconsService } from 'src/app/@core/service/icons.service';
import { TranslateService } from '@ngx-translate/core';
import { ShortUrlPipe } from 'src/app/pipes/short-domain.pipe';

export class PopupBuilder {

    shortDomainPipe: ShortUrlPipe = new ShortUrlPipe();

    public static popUpOptions = {
        maxWidth: 350
    };

    constructor(
        private addToRouteCallback: (feature: CustomFeature)=> void,
        private iconsService: IconsService,
        private translateService: TranslateService ) {

    }

    private buildBadgeSpan(text: string, color: string): string {
        return `<span class="travale-badge" style="background-color: ${color}"> ${text} </span>`;
    }

    private buildNameDiv(feature: CustomFeature): string {
        const name = (feature.properties?.['name_loc'])? feature.properties?.['name_loc']:
            ((feature.properties?.['name_en'])? feature.properties?.['name_en']: feature.properties?.['name']);
        if (!name)
            return '';
        return `<div class="subtitle w-100"> ${name}</div>`;
    }

    private buildWebsiteDiv(website: string | undefined): string {
        if (!website)
            return '';
        return `
        <div class="subtitle w-100" style="font-size: small">
            <i class="fa fa-globe" style="color: var(--color-basic-600);"></i>
            <a href='${website}'> ${this.shortDomainPipe.transform(website)} </a>
        </div>`;
    }

    private buildOpeningHoursDiv(openingHours: string | undefined) {
        if (!openingHours)
            return '';
        return `
        <div class="subtitle w-100" style="font-size: small">
            <i class="fa-regular fa-clock" style="color: var(--color-basic-600);"></i>
            ${openingHours}
        </div>`;
    }

    private buildPhoneDiv(phone: string | undefined) {
        if (!phone)
            return '';
        return `
        <div class="subtitle w-100" style="font-size: small">
            <i class="fa fa-phone" style="color: var(--color-basic-600);"></i>
            ${phone}
        </div>`;
    }

    private buildWikipediaDiv(wikipedia: string | undefined) {
        if (!wikipedia)
            return '';

        const languagePrefix = wikipedia?.substring(0, wikipedia.indexOf(':'));
        const wikiName = wikipedia?.substring(wikipedia.indexOf(':') + 1, wikipedia.length);

        return `
        <div class="subtitle w-100" style="font-size: small">
            <i class="fa-brands fa-wikipedia-w" style="color: var(--color-basic-600);"></i>
            <a href="https://${languagePrefix}.wikipedia.org/wiki/${wikiName}">Wikipedia</a>
            (${languagePrefix})
        </div>`;
    }

    public buildPopupDiv(feature: CustomFeature) {
        const div = document.createElement('div');

        const historic = feature.properties?.categories?.['historic'];
        const tourism = feature.properties?.categories?.['tourism'];
        const amenity = feature.properties?.categories?.['amenity'];
        const website = feature.properties?.website;
        const openingHours = feature.properties?.openingHours;
        const phone = feature.properties?.phone;
        const wikipedia = feature.properties?.wikipedia;
        const historicString = (historic)? this.buildBadgeSpan(this.translateService.instant('leafletMap.' + historic), this.iconsService.getIconColorByKey(historic)): '';
        const tourismString = (tourism)? this.buildBadgeSpan(this.translateService.instant('leafletMap.' + tourism), this.iconsService.getIconColorByKey(tourism)): '';
        const amenityString = (amenity)? this.buildBadgeSpan(this.translateService.instant('leafletMap.' + amenity), this.iconsService.getIconColorByKey(amenity)): '';

        div.innerHTML = this.buildNameDiv(feature) + historicString + tourismString + amenityString
        + this.buildWebsiteDiv(website) + this.buildOpeningHoursDiv(openingHours) + this.buildPhoneDiv(phone) + this.buildWikipediaDiv(wikipedia);

        const button = document.createElement('button');
        button.setAttribute('nbButton','');
        button.setAttribute('class', 'appearance-filled full-width size-small shape-round status-primary mt-2');
        button.innerHTML = this.translateService.instant('leafletMap.addToRoute');
        button.onclick = () => this.addToRouteCallback(feature);
        div.setAttribute('style', 'max-width: 350px; min-width: 100px');
        div.appendChild(button);
        return div;
    }
}