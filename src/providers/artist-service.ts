import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { INosArtist } from '../models/artist.model';
import { SpotifyService } from './spotify-service';
import { FirebaseStore } from './firebase-store';

import * as _ from 'lodash';

import {
    AngularFire
    //FirebaseListObservable,
    //FirebaseObjectObservable,
    //FirebaseObjectFactory
} from 'angularfire2';

@Injectable()
export class ArtistService {

    private _searchResults: BehaviorSubject<INosArtist[]>;
    searchResults: Observable<INosArtist[]>;

    private _artists: BehaviorSubject<INosArtist[]>;
    artists: Observable<INosArtist[]>;

    constructor(
        private http: Http,
        private spotifyService: SpotifyService,
        private firebaseStore: FirebaseStore,
        private af: AngularFire
    ) {
        this._searchResults = <BehaviorSubject<INosArtist[]>>new BehaviorSubject([]);
        this.searchResults = this._searchResults.asObservable();

        this._artists = <any><BehaviorSubject<INosArtist[]>>new BehaviorSubject([]);
        this.artists = this._artists.asObservable();

        // Query Example
        // const source = this.af.database.list('/artists', {
        //     query: {
        //         orderByChild: 'spotifyId',
        //         equalTo: spotifyId,
        //         limitToFirst: 1
        //     }
        // });

        // .key example
        // return this.af.database.list(`/artists`)
        //     .push(newArtist).key;

        // Set Data Examples:
        // this.af.database.object(`/genres/${genreKey}/artists/${spotifyId}`)
        //     .set(true);
        // this.af.database.object(`/genres/${genreKey}/`)
        //     .update({ name: genre });
    }

    search(term: string): void {
        // Call the spotify Search function and filter to wanted results
        this.spotifyService.searchArtists(term)
            .map(results => {
                return results.filter(x => x.spotifyPopularity > 5 && x.spotifyFollowers > 250);
            })
            .subscribe(
            (results) => this._searchResults.next(results),
            (error) => {
                // TODO: Handle
            });
    }

    clearSearchResults(): void {
        this._searchResults.next([]);
    }

    getArtistById(spotifyId: string): any {
        const source = this.af.database.object(`/artists/${spotifyId}`);

        const sourceMap = source.map(queriedItems => queriedItems);

        // for testing        
        // this.spotifyService.getArtistById(spotifyId)
        //     .subscribe(result => {
        //         console.log('spotify artist', result);
        //         console.log('example create', this.dbArtistFromNosArtist(result));
        //     });

        // TODO: How to get things like 'genres'
        // maybe I get them later?

        return sourceMap;
    }

    dbArtistFromNosArtist(artist: INosArtist) {
        return {
            name: artist.name,
            spotifyId: artist.spotifyId,
            spotifyUri: artist.spotifyUri,
            spotifyUrl: artist.spotifyUrl,
            spotifyHref: artist.spotifyHref,
            spotifyPopularity: artist.spotifyPopularity,
            spotifyFollowers: artist.spotifyFollowers,
            largeImage: artist.largeImage,
            mediumImage: artist.mediumImage,
            smallImage: artist.smallImage
        };
    }

    createArtist(spotifyId) {
        this.spotifyService.getArtistById(spotifyId)
            .subscribe(result => {
                let newArtist = this.dbArtistFromNosArtist(result);

                console.log('create this artist', newArtist);

                // Set the Artist
                // Set the Artists Genres, 
                // Set the Genre, and make sure the artist is added to the list
                // set seperately 
                // genres, portoflio follows, portfolios

                let updates = {};
                // Set the Artist
                updates[`/artists/${spotifyId}`] = newArtist;
                // Set Genre and add artist to Genre list                
                result.spotifyGenres.forEach((genre) => {
                    let genreKey = _.camelCase(genre);
                    // Set the genre name in genre list
                    updates[`/genres/${genreKey}/name`] = genre;
                    // Set the genres artist list in association node
                    // updates[`/genres/${genreKey}/artists/${spotifyId}`] = true;
                    updates[`/artistsPerGenre/${genreKey}/${spotifyId}`] = true;

                    // Set the artist's genres in association node
                    updates[`/genresPerArtist/${spotifyId}/${genreKey}`] = true;
                });

                // Perform the updates                
                this.af.database.object('').update(updates);
            });

        // TODO: create the rest of the artist (genres, follows, etc)
        // create the artist..
        // have to transform the lists like genres into a list I can push 
        // into firebase (use the fan out where you get the id them update them all) 
        // - https://firebase.google.com/docs/database/web/read-and-write
    }


}
