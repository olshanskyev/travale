import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WikiExtraction, WikiPageRef, WikiServiceData } from '../data/wiki.data';
import { environment } from 'src/environments/environment';



@Injectable()
export class WikiService implements WikiServiceData {

    constructor(private _http: HttpClient) {
    }

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

    private mapWikiDataIntoWikipediaPage(preferredLanguages: string[], item: any): WikiPageRef | null {
        const foundLang = preferredLanguages.find(lang => item.sitelinks?.[lang + 'wiki']);
        return (foundLang)?
            {
                language: foundLang,
                title: item.sitelinks?.[foundLang + 'wiki'].title,
                url: item.sitelinks?.[foundLang + 'wiki'].url,
            }
        : null;
    }

    getWikiPageByWikiData(preferredLanguages: string[], wikidataItem: string): Observable<WikiPageRef | null> {
        const url = environment.wikidataEndpoint + 'entities/items/' + wikidataItem;
        return this._http.get<any>(url).pipe(map( item => this.mapWikiDataIntoWikipediaPage(preferredLanguages, item)));
    }


}