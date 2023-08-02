import { AggregatedFeatureInfo, CustomFeature } from 'src/app/@core/data/poi.data';
import { IconsService } from 'src/app/@core/service/icons.service';
import { TranslateService } from '@ngx-translate/core';
import { ShortUrlPipe } from 'src/app/pipes/short-domain.pipe';
import { Observable, of } from 'rxjs';
import { WikiService } from 'src/app/@core/service/wiki.service';
import { WikiExtraction, WikiPageRef } from 'src/app/@core/data/wiki.data';

export class PopupBuilder {

    private wikiExtranction: WikiExtraction | null;
    shortDomainPipe: ShortUrlPipe = new ShortUrlPipe();

    public static popUpOptions = {
        maxWidth: 350
    };

    constructor(
        private addToRouteCallback: (featureInfo: AggregatedFeatureInfo)=> void,
        private iconsService: IconsService,
        private translateService: TranslateService ) {

    }

    addToRouteClicked(featureInfo: AggregatedFeatureInfo) {
        this.addToRouteCallback(featureInfo);
        this.addToRouteButton.setAttribute('disabled', '');
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

    private buildWikipediaDiv(wikipedia: WikiPageRef) {
        if (!wikipedia)
            return '';

        return `
        <div class="subtitle w-100" style="font-size: small">
            <i class="fa-brands fa-wikipedia-w" style="color: var(--color-basic-600);"></i>
            <a href="${wikipedia.url}">Wikipedia</a>
            (${wikipedia.language})
        </div>`;
    }

    private buildWikiExtractionDiv(wikiExtraction: WikiExtraction) {
        return `
        <div id='wikicontainer' style='max-height: inherit; overflow-y: scroll; text-align: justify;' class='scrollable-container ps-1 pe-1 pt-1'>
            ${wikiExtraction.extract}
        </div>`;
    }

    addToRouteButton: HTMLElement;
    popupDiv: HTMLElement;
    public buildPopupDiv(feature: CustomFeature, wikiService: WikiService | null, preferredLanguage: string, alreadyInRoute: boolean): Observable<HTMLElement> {
        this.wikiExtranction = null;
        this.popupDiv = document.createElement('div');
        const mainInfoDiv = document.createElement('div');
        this.popupDiv.appendChild(mainInfoDiv);

        const historic = feature.properties?.categories?.['historic'];
        const tourism = feature.properties?.categories?.['tourism'];
        const amenity = feature.properties?.categories?.['amenity'];
        const website = feature.properties?.website;
        const openingHours = feature.properties?.openingHours;
        const phone = feature.properties?.phone;
        const wikipedia = feature.properties?.wikipedia;
        const wikidata = feature.properties?.wikidata;
        const historicString = (historic)? this.buildBadgeSpan(this.translateService.instant('leafletMap.' + historic), this.iconsService.getIconColorByKey(historic)): '';
        const tourismString = (tourism)? this.buildBadgeSpan(this.translateService.instant('leafletMap.' + tourism), this.iconsService.getIconColorByKey(tourism)): '';
        const amenityString = (amenity)? this.buildBadgeSpan(this.translateService.instant('leafletMap.' + amenity), this.iconsService.getIconColorByKey(amenity)): '';

        mainInfoDiv.innerHTML = this.buildNameDiv(feature) + historicString + tourismString + amenityString
        + this.buildWebsiteDiv(website) + this.buildOpeningHoursDiv(openingHours) + this.buildPhoneDiv(phone);

        if (!alreadyInRoute) {
            this.addToRouteButton = document.createElement('button');
            this.addToRouteButton.setAttribute('nbButton','');
            this.addToRouteButton.setAttribute('class', 'appearance-filled full-width size-small shape-round status-primary mt-2 add-button');
            this.addToRouteButton.innerHTML = this.translateService.instant('leafletMap.addToRoute');
            this.addToRouteButton.onclick = () => this.addToRouteClicked({feature: feature, wikiExtraction: this.wikiExtranction});
            this.popupDiv.appendChild(this.addToRouteButton);
        }

        this.popupDiv.setAttribute('style', 'max-width: 320px; min-width: 250px');
        if (wikiService && wikidata && wikipedia) { // if wikipedia tag presents in reply, we can find wikipedia page on wikidata
            const defLangPrefix = wikipedia?.substring(0, wikipedia.indexOf(':'));
            wikiService.getWikiPageByWikiData([preferredLanguage, 'en', defLangPrefix], wikidata).subscribe( article => {
                if (article) {
                    mainInfoDiv.innerHTML += this.buildWikipediaDiv(article);
                } else {  //article not found, take wikipedia string and parse

                    const wikiName = wikipedia?.substring(wikipedia.indexOf(':') + 1, wikipedia.length);
                    article = {
                        title: wikiName,
                        language: defLangPrefix,
                        url: `https://${defLangPrefix}.wikipedia.org/wiki/${wikiName}`
                    };
                    mainInfoDiv.innerHTML += this.buildWikipediaDiv(article);
                }
                wikiService.extractTextFromArticle(article.language, article.title, 10).subscribe( wikiRes => {
                    this.wikiExtranction = wikiRes;
                    const wikiDiv = document.createElement('div');
                    wikiDiv.setAttribute('style', 'max-height: 0');
                    wikiDiv.innerHTML += this.buildWikiExtractionDiv(wikiRes);
                    const buttonShowWiki = document.createElement('a');
                    buttonShowWiki.innerHTML = 'show more';
                    buttonShowWiki.setAttribute('href', 'javascript:void(0);');
                    buttonShowWiki.onclick = () => {
                        wikiDiv.setAttribute('style', 'max-height: 150px; ');
                        buttonShowWiki.setAttribute('hidden','');
                    };
                    mainInfoDiv.appendChild(buttonShowWiki);
                    mainInfoDiv.appendChild(wikiDiv);
                });

            });
        }
        return of(this.popupDiv);
    }
}