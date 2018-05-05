import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { map, catchError } from 'rxjs/operators';

import { INosArtist, ISpotifyArtist } from '../models/artist.model';

@Injectable()
export class NosSpotifyService {
    readonly baseUrl: string = 'https://nostraudio2-server.appspot.com/api';

    constructor(
        private http: Http
    ) {
        /*
        https://developer.spotify.com/web-api/authorization-guide/#implicit_grant_flow
        https://github.com/spotify/web-api-auth-examples/blob/master/implicit_grant/public/index.html
        https://stackoverflow.com/questions/44511168/logging-in-spotify-with-ionic-2#
        https://www.joshmorony.com/spotify-player-ionic/
        https://blitzr.io/
        https://www.google.com/search?q=music+metadata+api&oq=music+metadata+api+&aqs=chrome.0.0l6.2391j0j4&sourceid=chrome&ie=UTF-8
        https://github.com/thelinmichael/spotify-web-api-node

        https://cloud.google.com/nodejs/
        */

    }

    private mapArtistSearch(a: any): ISpotifyArtist {
        const result: ISpotifyArtist = <ISpotifyArtist>{};
        //result.spotifyName = a.name;
        result.name = a.name;
        result.spotifyId = a.id;
        result.spotifyUri = a.uri;
        result.spotifyUrl = a.external_urls.spotify;
        if (a.external_urls.length > 1) {
            console.log('SPOTIFY HAS MORE THAN 1 URL');
        }
        result.spotifyHref = a.href;
        result.spotifyPopularity = a.popularity;
        result.spotifyFollowers = ((a.followers) ? a.followers.total : null);
        result.spotifyGenres = a.genres || [];
        //result.spotifyGenre = ((a.genres.length) ? a.genres[0] : null);
        result.genre = ((a.genres.length) ? a.genres[0] : null);
        if (a.images.length > 0) {
            result.largeImage = (a.images[0] ? a.images[0].url : '/assets/fallback_artist.png');
            result.mediumImage = (a.images[1] ? a.images[1].url : '/assets/fallback_artist.png');
            result.smallImage = (a.images[2] ? a.images[2].url : '/assets/fallback_artist.png');
        } else {
            result.largeImage = '/assets/fallback_artist.png';
            result.mediumImage = '/assets/fallback_artist.png';
            result.smallImage = '/assets/fallback_artist.png';
        }

        return result;
    }

    private handleError(error: Response | any): Observable<any> {
        console.error('Spotify Service Error: ', error);
        return Observable.throw(error.message || 'Server error');
    }

    searchArtists(name: string = ''): Observable<INosArtist[]> {
        if (name.length) {
            // let url = `http://localhost:8080/api/search/${name}`;
            const url = `${this.baseUrl}/search/${name}`;
            return this.http.get(url)
                .pipe(
                    map((response: Response) => {
                        console.log('search response', response.json());
                        const results: INosArtist[] = response.json().artists.items
                            .map((x: any[]) => this.mapArtistSearch(x));
                        return results;
                    }),
                    catchError(this.handleError)
                );
        } else {
            console.warn('Search param was empty');
            return Observable.of([]);
        }
    }

    getArtistById(spotifyId: string): Observable<ISpotifyArtist> {
        const url = `${this.baseUrl}/artists/${spotifyId}`;
        return this.http.get(url)
            .pipe(
                map((response: Response) => {
                    return this.mapArtistSearch(response.json());
                }),
                catchError(this.handleError)
            );
    }

    // getArtistTopTracks(spotifyId: string): Observable<ISpotifyTopTracks> {
    //     //check api for more return options (there are a ton on album)
    //     let url = this.baseUrl + `artists/${spotifyId}/top-tracks`;

    //     return this.http.get(url)
    //         .map((response: Response) => {
    //             console.log('top tracks', response.json());
    //             return response.json();
    //         });

    //     // this.Spotify.getArtistTopTracks(spotifyId, 'US').then((data) => {
    //     //   var topTracks: ISpotifyTopTracks = {};
    //     //   if (data.tracks) {
    //     // new SpotifyTrack
    //     //     topTracks.list = _.uniqBy(_.map(data.tracks, trackInfo), 'name');
    //     //     topTracks.txtList = _.take(_.map(topTracks.list, 'name'), 3).join(", ");
    //     //   }
    //     //   defer.resolve(topTracks);
    //     // }, (error) => {
    //     //   this.loggingService.logError("Spotify.getArtistTopTracks Error:", error);
    //     //   defer.reject();
    //     // });
    // };

}
