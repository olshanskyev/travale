import { Observable } from 'rxjs';

export type WikiExtraction = {
    title: string;
    extract: string
}

export type WikiPageRef = {
    language: string;
    title: string;
    url: string;
}

export interface WikiServiceData {
    extractTextFromArticle(language: string, title: string, sentences: number): Observable<WikiExtraction>;
    getWikiPageByWikiData(preferredLanguages: string[], wikidataItem: string): Observable<WikiPageRef | null>;
}