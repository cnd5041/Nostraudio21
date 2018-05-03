import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { map, catchError, switchMap } from 'rxjs/operators';
import { map as _map, take, get } from 'lodash';

import { INosArtist, ISpotifyTopTracks, ISpotifyArtist } from '../models/artist.model';

// interface ISongkickArtist {
//     id: number;
//     uri: string;
//     displayName: string;
//     onTourUntil: string;
// }

// interface ISongkickEvent {
//     id: number;
//     uri: string;

//     displayName: string;
//     type: string; // Concert
//     venue: {
//         lat: number;
//         lng: number;
//         displayName: string;
//         id: string;
//     };
//     location: {
//         lat: number;
//         lng: number;
//         city: string;
//     };
//     start: {
//         time: string; // "19:30:00"
//         date: string; // "2010-02-16",
//         datetime: string; // "2010-02-16T19:30:00+0000"
//     };
//     performance: {
//         artist: {
//             uri: string;
//             displayName: string;
//             id: number;
//             identifier: any[];
//         };
//         displayName: string;
//         billingIndex: number;
//         id: number;
//         billing: string;
//     }[];
// }

// interface ISongkickSearchResponse {
//     resultsPage: {
//         results: {
//             artist: ISongkickArtist[];
//         }
//     };
//     totalEntries: number;
//     perPage: number;
//     page: number;
//     status: string;
// }

// interface ISongkickEventSearchResponse {
//     resultsPage: {
//         results: {
//             event: ISongkickArtist[];
//         }
//     };
//     totalEntries: number;
//     perPage: number;
//     page: number;
//     status: string;
// }

export interface Identifier {
    href: string;
    mbid: string;
}

export interface Artist {
    displayName: string;
    identifier: Identifier[];
    uri: string;
    id: number;
}

export interface Performance {
    displayName: string;
    billingIndex: number;
    billing: string;
    artist: Artist;
    id: number;
}

export interface Start {
    datetime?: any;
    time?: any;
    date: string;
}

export interface End {
    datetime?: any;
    time?: any;
    date: string;
}

export interface Series {
    displayName: string;
}

export interface Location {
    city: string;
    lat: number;
    lng: number;
}

export interface Country {
    displayName: string;
}

export interface State {
    displayName: string;
}

export interface MetroArea {
    displayName: string;
    country: Country;
    uri: string;
    id: number;
    state: State;
}

export interface Venue {
    displayName: string;
    lat: number;
    lng: number;
    metroArea: MetroArea;
    uri: string;
    id: number;
}

export interface Event {
    type: string;
    popularity: number;
    displayName: string;
    status: string;
    performance: Performance[];
    ageRestriction?: any;
    start: Start;
    end: End;
    series: Series;
    location: Location;
    uri: string;
    id: number;
    venue: Venue;
}

export interface EventResults {
    event: Event[];
}

export interface EventResultsPage {
    status: string;
    results: EventResults;
    perPage: number;
    page: number;
    totalEntries: number;
}

export interface EventSearchResponse {
    resultsPage: EventResultsPage;
}


@Injectable()
export class NosSongkickService {
    readonly key = 'cF0PzfSMGAuBGPno';
    readonly baseUrl: string = 'http://api.songkick.com/api/3.0/search/artists.json?apikey=cF0PzfSMGAuBGPno';
    readonly searchBaseUrl: string = 'http://api.songkick.com/api/3.0/search/artists.json?apikey=cF0PzfSMGAuBGPno&query=';
    readonly eventSearchUrl: string = `http://api.songkick.com/api/3.0/events.json?apikey=${this.key}&artist_name=`;
    // readonly baseUrl: string = 'http://api.songkick.com/api/3.0/search/artists.json?apikey={your_api_key}&query={artist_name}';

    constructor(
        private http: Http
    ) {

    }

    private mapArtistSearch(a: any): any {

    }

    private handleError(error: Response | any): Observable<any> {
        console.error('Songkick Service Error: ', error);
        return Observable.throw(error.message || 'Server error');
    }

    searchArtists(name: string = ''): Observable<any[]> {
        if (name.length) {
            const url = `${this.searchBaseUrl}${name}`;
            return this.http.get(url)
                .pipe(
                    map((response: Response) => {
                        console.log('songkick search response', response.json());
                        return response.json();
                    }),
                    catchError(this.handleError)
                );
        } else {
            console.warn('Search param was empty');
            return Observable.of([]);
        }
    }

    getWikiImageUrl(title: string): Observable<string> {
        // this.http.get('https://en.wikipedia.org/w/api.php?action=query&format=json&titles=Image:Saosin5.png&prop=imageinfo&iiprop=url&origin=*')
        return this.http.get(`https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${title}&prop=imageinfo&iiprop=url&origin=*`)
            .map((res: Response) => {
                console.log('image', res.json());
                const result = res.json();
                const pages = result.query.pages;
                const page1 = pages[Object.keys(pages)[0]];
                if (page1.imageinfo) {
                    const imageinfo = page1.imageinfo[0];
                    const imageUrl = imageinfo.url;
                    console.log('imageUrl', imageUrl);
                    return imageUrl;
                } else {
                    console.log('no image url');
                    return null;
                }
            }, (error) => {
                console.error(error);
                return null;
            });
    }

    getPageImages(pageId: string): Observable<any> {
        return this.http.get(`https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=images&format=json&origin=*`)
            .pipe(
                map((res: Response) => {
                    const result = res.json();
                    const pages = result.query.pages;
                    const page1 = pages[Object.keys(pages)[0]];
                    const images = page1.images;
                    const imageNames = _map(images, 'title')
                        .filter((name: string) => {
                            return !name.includes('Question book-new');
                        });

                    return imageNames[0] ? encodeURIComponent(imageNames[0]) : null;
                }, (error) => {
                    console.error('getPageImages', error);
                }),
                switchMap((imageName: string) => {
                    return this.getWikiImageUrl(imageName);
                })
            );
    }

    searchWikiPagesByTitle(title: string): Observable<string> {
        // https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=Jazz%20Fest&origin=*
        return this.http.get(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=${title}&origin=*`)
            .map((res: Response) => {
                const result = res.json();
                const pageid = get(result, 'query.search[0].pageid');
                return pageid;
            }, (error) => {
                console.error('searchWikiPagesByTitle', error);
                return null;
            });
    }

    getEventImages(title: string): Observable<any> {
        // event.venue.displayName
        return this.searchWikiPagesByTitle(title).pipe(
            switchMap((pageId) => {
                if (pageId) {
                    return this.getPageImages(pageId);
                } else {
                    return Observable.of(null);
                }
            })
        );
    }

    searchEventsByArtist(name: string = ''): Observable<Event[]> {
        const url = `${this.eventSearchUrl}${name}`;

        return this.http.get(url)
            .pipe(
                map((response: Response) => {
                    const eventResults: EventSearchResponse = response.json();
                    eventResults.resultsPage.results.event.forEach((e) => {
                        (e as any).image$ = this.getEventImages(e.venue.displayName);
                        // TODO:  Leaving Off: add a button that lets them dismiss the image, funny, like whaaa am I seeing here?
                        // have a placeholder image / loading until the image resolves.
                    });
                    return eventResults.resultsPage.results.event;
                }),
                catchError(this.handleError)
            );
    }

    getArtistById(spotifyId: string): Observable<ISpotifyArtist> {
        const url = `${this.searchBaseUrl}/artists/${spotifyId}`;
        return this.http.get(url)
            .pipe(
                map((response: Response) => {
                    return this.mapArtistSearch(response.json());
                }),
                catchError(this.handleError)
            );
    }

}
