import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WikiData, WikiExtraction, WikiServiceData } from '../data/wiki.data';
import { environment } from 'src/environments/environment';
import { ImageType } from '../data/route.data';



@Injectable()
export class WikiService implements WikiServiceData {

    constructor(private _http: HttpClient) {
    }
    private defaultImageWidth = 1024;
    private defaultThumbWidth = 180;

    private mapExtractReply(item: any): {title: string; extract: string} {
        return {
            title: item.query.pages[0]?.title,
            extract: item.query.pages[0]?.extract
        };
    }
    extractTextFromArticle(language: string, title: string, sentences: number): Observable<WikiExtraction> {
        let wikiUrl = environment.wikipediaEndpoint.replace('{{lng}}', language);
        wikiUrl += `?action=query&exlimit=1&explaintext=1&exsentences=${sentences}&formatversion=2&prop=extracts&titles=${title}&format=json&origin=*`;
        return this._http.get<any>(wikiUrl).pipe(map(item => this.mapExtractReply(item)));
    }

    private mapWikiData(preferredLanguages: string[], item: any): WikiData {
        const foundLang = preferredLanguages.find(lang => item.sitelinks?.[lang + 'wiki']);
        const wikiArticle = (foundLang)?
            {
                language: foundLang,
                title: item.sitelinks?.[foundLang + 'wiki'].title,
                url: item.sitelinks?.[foundLang + 'wiki'].url,
            }
        : undefined;

        let images: ImageType[] = [];
        if (item.statements?.P18) {
            images = item.statements?.P18.map((itemP18: any) => {
                return {
                    src: `${environment.wikimediaEndpiint}thumb.php?width=${this.defaultImageWidth}&f=${itemP18.value?.content}`,
                    thumb: `${environment.wikimediaEndpiint}thumb.php?width=${this.defaultThumbWidth}&f=${itemP18.value?.content}`,
                    source: 'WIKIDATA'
                } as ImageType;
            });
        }
        return {
            wikiDataId: item.id,
            wikiArticle: wikiArticle,
            images: images
        };
    }

    getWikiDataByWikiDataItem(preferredLanguages: string[], wikidataItem: string): Observable<WikiData> {
        const url = environment.wikidataEndpoint + 'entities/items/' + wikidataItem;
        return this._http.get<any>(url).pipe(map( item => this.mapWikiData(preferredLanguages, item)));
    }


}