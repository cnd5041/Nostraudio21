import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import {
    INosArtist, dbArtistFromSpotifyArtist, nosArtistFromDbArtist,
    IGenre, INosPortfolio, IDbTransaction, NosTransaction
} from '../models';

import { NosSpotifyService } from './spotify-service';
import { FirebaseStore } from './firebase-store';

import * as _ from 'lodash';

import { AngularFireDatabase } from 'angularfire2/database';


@Injectable()
export class ArtistService {

    private _searchResults: BehaviorSubject<INosArtist[]>;
    searchResults: Observable<INosArtist[]>;

    private _artists: BehaviorSubject<INosArtist[]>;
    artists: Observable<INosArtist[]>;

    constructor(
        private http: Http,
        private spotifyService: NosSpotifyService,
        private firebaseStore: FirebaseStore,
        private db: AngularFireDatabase
    ) {
        this._searchResults = <BehaviorSubject<INosArtist[]>>new BehaviorSubject([]);
        this.searchResults = this._searchResults.asObservable();

        this._artists = <any><BehaviorSubject<INosArtist[]>>new BehaviorSubject([]);
        this.artists = this._artists.asObservable();
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
        const artistSource = this.db.object(`/artists/${spotifyId}`);
        const stocksSource = this.db.list(`/stockholdersPerArtist/${spotifyId}`);
        // TODO: see if I can refactor this with more info like genres, and if a switchmap will help

        // maybe do a once on genres here, or do it separate in view

        // let stream = artistSource.combineLatest(stocksSource);

        // const sourceMap = stream.map(queriedItems => {
        //     let artist = queriedItems[0];
        //     let stockholdersPerArtist: IDictionary[] = queriedItems[1];
        //     let nosArtist = nosArtistFromDbArtist(artist, stockholdersPerArtist);

        //     console.log('nosArtist', nosArtist);

        //     return nosArtist;
        // });

        return Observable.of(null);

        // return sourceMap;
    }

    createArtist(spotifyId) {
        // TODO: make sure I update the firebase artist with this info sometimes
        this.spotifyService.getArtistById(spotifyId)
            .subscribe(result => {
                const newArtist = dbArtistFromSpotifyArtist(result);

                console.log('create this artist', newArtist);
                // set seperately
                // genres, portoflio follows, portfolios

                const updates = {};
                // Set the Artist
                updates[`/artists/${spotifyId}`] = newArtist;
                // Set Genre and add artist to Genre list
                result.spotifyGenres.forEach((genre) => {
                    const genreKey = _.camelCase(genre);
                    // Set the genre name in genre list
                    updates[`/genres/${genreKey}/name`] = genre;
                    // Set the genres artist list in association node
                    // updates[`/genres/${genreKey}/artists/${spotifyId}`] = true;
                    updates[`/artistsPerGenre/${genreKey}/${spotifyId}`] = true;

                    // Set the artist's genres in association node
                    updates[`/genresPerArtist/${spotifyId}/${genreKey}`] = true;
                });

                // Perform the updates
                this.db.object('/').update(updates);
            });
    }

    followArtist(spotifyId: string, uid: string): void {
        const updates = {};
        // Add to list track all users following an artist
        updates[`/followsPerArtist/${spotifyId}/${uid}`] = true;
        // Add to list to track which artists a user is following
        updates[`/artistFollowsPerUser/${uid}/${spotifyId}`] = true;
        // Perform the updates
        this.db.object('/').update(updates);
    }

    unFollowArtist(spotifyId: string, uid: string): void {
        const updates = {};
        // Add to list track all users following an artist
        updates[`/followsPerArtist/${spotifyId}/${uid}`] = false;
        // Add to list to track which artists a user is following
        updates[`/artistFollowsPerUser/${uid}/${spotifyId}`] = false;
        // Perform the updates
        this.db.object('/').update(updates);
    }

    // getArtistFollowers(spotifyId: string): Observable<IDictionary[]> {
    //     const source = this.db.list(`/followsPerArtist/${spotifyId}`);

    //     // const sourceMap = source
    //     //     .map(list => {
    //     //         return list.filter(f => f.$value === true);
    //     //     });

    //     // return sourceMap;
    //     return Observable.of([]);
    // }

    getGenresByArtistId(spotifyId: string): Observable<IGenre[]> {
        // return this.db.list(`/genresPerArtist/${spotifyId}`)
        //     .combineLatest(this.firebaseStore.genres)
        //     .map((results) => {
        //         let artistGenres = results[0];
        //         let genres = results[1];
        //         return genres.filter(genre => {
        //             let result = artistGenres.findIndex(g => g.$key === genre.$key);
        //             return (result ? true : false);
        //         });
        //     });
        return Observable.of([]);
    }

    userBuyArtist(portfolio: INosPortfolio, artist: INosArtist, numberOfShares: number = 0): void {
        const total = artist.marketPrice * numberOfShares;
        const newBalance = portfolio.balance - total;
        // Safety Checks:
        // If no shares - do not continue
        if (numberOfShares < 1) {
            return;
        }
        // If new balance will be negative - do not continue
        if (newBalance < 0) {
            return;
        }
        // Record the Transaction
        // const transaction: IDbTransaction = new NosTransaction(artist.$key, portfolio.$key, numberOfShares, total, 'buy');

        // this.firebaseStore.transactions.push(transaction);
        // // Add Shares to Portfolio
        // this.firebaseStore.updateSharesPerPortfolio(artist.$key, portfolio.$key, numberOfShares);
        // // Add Shares to Artist
        // this.firebaseStore.updateStockholdersPerArtist(artist.$key, portfolio.$key, numberOfShares);
        // // Update Portfolio Balance
        // const portfolioObservable = this.db.object(`/portfolios/${portfolio.$key}`);
        // portfolioObservable.update({ balance: newBalance });
    }


}
