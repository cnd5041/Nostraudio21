import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { INosArtist, IDbArtist, ISpotifyArtist, dbArtistFromSpotifyArtist, nosArtistFromDbArtist, IDictionary } from '../models/artist.model';
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

    getArtistById(spotifyId: string): Observable<INosArtist> {
        console.log('getArtistById', spotifyId);
        const artistSource = this.af.database.object(`/artists/${spotifyId}`);
        const stocksSource = this.af.database.list(`/stockholdersPerArtist/${spotifyId}`);

        // maybe do a once on genres here, or do it separate in view

        let stream = artistSource.combineLatest(stocksSource);

        const sourceMap = stream.map(queriedItems => {
            let artist = queriedItems[0];
            let stockholdersPerArtist: IDictionary[] = queriedItems[1];

            console.log('queriedItems', queriedItems);

            let nosArtist = nosArtistFromDbArtist(artist, stockholdersPerArtist);

            console.log('nosArtist', nosArtist);

            return nosArtist;
        });

        return sourceMap;
    }

    createArtist(spotifyId) {
        this.spotifyService.getArtistById(spotifyId)
            .subscribe(result => {
                let newArtist = dbArtistFromSpotifyArtist(result);

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

        // TODO: 
        // Set up the Artist page and then do Follows (use the Per)
    }

    followArtist(spotifyId: string, uid: string): void {
        let updates = {};
        // Add to list track all users following an artist        
        updates[`/followsPerArtist/${spotifyId}/${uid}`] = true;
        // Add to list to track which artists a user is following
        updates[`/artistFollowsPerUser/${uid}/${spotifyId}`] = true;
        // Perform the updates
        this.af.database.object('').update(updates);
    }

    unFollowArtist(spotifyId: string, uid: string): void {
        let updates = {};
        // Add to list track all users following an artist        
        updates[`/followsPerArtist/${spotifyId}/${uid}`] = false;
        // Add to list to track which artists a user is following
        updates[`/artistFollowsPerUser/${uid}/${spotifyId}`] = false;
        // Perform the updates
        this.af.database.object('').update(updates);
    }

    getArtistFollowers(spotifyId: string): Observable<IDictionary[]> {
        const source = this.af.database.list(`/followsPerArtist/${spotifyId}`);

        const sourceMap = source
            .map(list => {
                return list.filter(f => f.$value === true);
            });

        return sourceMap;
    }


}
