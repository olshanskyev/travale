import { Observable } from 'rxjs';
import { ImageType } from './route.data';

export type WikiExtraction = {
    title: string;
    extract: string
}

export type WikiData = {
    wikiArticle?: WikiPageRef,
    images: ImageType[],
}
export type WikiPageRef = {
    language: string;
    title: string;
    url: string;
}

export interface WikiServiceData {
    extractTextFromArticle(language: string, title: string, sentences: number): Observable<WikiExtraction>;
    getWikiDataByWikiDataItem(preferredLanguages: string[], wikidataItem: string): Observable<WikiData>;
}