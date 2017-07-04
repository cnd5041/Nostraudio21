import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { IDbArtist, IGenre, IDbTransaction } from '../models';
import * as _ from 'lodash';


@Injectable()
export class FirebaseStore {

    artists: FirebaseListObservable<IDbArtist[]>;
    genres: Observable<IGenre[]>;
    transactions: FirebaseListObservable<IDbTransaction[]>;


    constructor(
        private db: AngularFireDatabase
    ) {
        this.artists = db.list('/artists');
        this.transactions = db.list('/transactions');

        const genresSource: FirebaseListObservable<IGenre[]> = db.list('/genres');
        this.genres = genresSource
            .map(genres => {
                return genres.map(genre => {
                    genre.name = _.startCase(genre.name);
                    return genre;
                });
            });


        // example of how to do multiple
        // // Compose an observable based on the genresPerArtist:
        //     return this.db.list(`/genresPerArtist/${spotifyId}`)
        //         // Each time the genresPerArtist emits, switch to unsubscribe/ignore any pending user queries:
        //         .switchMap(genres => {
        //             // Map the genres to the array of observables that are to be joined.
        //             let genreObservables = genres.map(genre => this.db.object(`/genres/${genre.$key}`).first());
        //             return Observable.forkJoin(...genreObservables);
        //         });


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

    updateStockholdersPerArtist(artistId: string, portfolioId: string, numberOfShares: number): void {
        this.db.object(`/stockholdersPerArtist/${artistId}/${portfolioId}`)
            .take(1)
            .subscribe(stockholdersPerArtist => {
                let updatedShareCount = numberOfShares;
                // If they already have shares - update the count
                if (stockholdersPerArtist.$exists()) {
                    updatedShareCount += stockholdersPerArtist.$value;
                }
                // Update the endpoint with the share count
                this.db.object(`/stockholdersPerArtist/${artistId}/${portfolioId}`)
                    .set(updatedShareCount);
            });
    }

    updateSharesPerPortolio(artistId: string, portfolioId: string, numberOfShares: number): void {
        this.db.object(`/sharesPerPortolio/${portfolioId}/${artistId}`)
            .take(1)
            .subscribe(sharesPerPortolio => {
                let updatedShareCount = numberOfShares;
                // If they already have shares - update the count
                if (sharesPerPortolio.$exists()) {
                    updatedShareCount += sharesPerPortolio.$value;
                }
                // Update the endpoint with the share count
                this.db.object(`/sharesPerPortolio/${portfolioId}/${artistId}`)
                    .set(updatedShareCount);
            });
    }



}
