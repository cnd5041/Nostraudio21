import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { INosArtist, ISpotifyTopTracks, ISpotifyArtist } from '../models/artist.model';

// Auth: https://www.discogs.com/developers/#page:authentication,header:authentication-discogs-auth-flow

// DB Artist: https://www.discogs.com/developers/#page:database,header:database-artist


// Consumer Key	iwbwyZfQbzcPiyIqEtOc
// Consumer Secret	oDmpYELCrwMcdrRvShgWogtFlHgicOpW  TODO: hide in firebase 
// Request Token URL	https://api.discogs.com/oauth/request_token
// Authorize URL	https://www.discogs.com/oauth/authorize
// Access Token URL	https://api.discogs.com/oauth/access_token



    export interface IDCImage {
        height: number;
        resource_url: string;
        type: string;
        uri: string;
        uri150: string;
        width: number;
    }

    export interface IDCMember {
        active: boolean;
        id: number;
        name: string;
        resource_url: string;
    }

    export interface IDCArtist {
        namevariations: string[];
        profile: string;
        releases_url: string;
        resource_url: string;
        uri: string;
        urls: string[];
        data_quality: string;
        id: number;
        images: IDCImage[];
        members: IDCMember[];
    }


@Injectable()
export class DiscogsService {
    baseUrl: string = 'https://api.discogs.com/database';
    // check the integrety of the search
    // see if there's a way to match spotify and discogs
    // if there no ranking on discogs, use spotify and discogs as metadata 

    constructor(
        private http: Http
    ) {
    }

    searchArtists(): Observable<any> {
        let url = ``;
        let headers = new Headers();
        headers.append('Authorization', 'Discogs key=iwbwyZfQbzcPiyIqEtOc, secret=oDmpYELCrwMcdrRvShgWogtFlHgicOpW');

        let options: RequestOptionsArgs = {
            headers: headers
        };

        let body: {};

        return this.http.post(url, body, options)
            .map((response: Response) => {
                console.log('response', response);
            })
            .catch(this.handleError);
    }

    handleError(error): Observable<any> {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

}
