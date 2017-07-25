import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { IDbArtist, IGenre, IDbTransaction, IDictionary, IDbPortfolio } from '../models';
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


         // //Example of getting list
    // examples() {
    //   //List
    //   // this.af.database.list('items').subscribe(items => console.log(items));
    //   // //1 item - where 1 is the id
    //   // this.af.database.object('items/1').subscribe(items => console.log(items));

    //   //Not having to subscribe
    //   // this.exampleItem = this.af.database.object('items/1');
    //   //rtFYvr3Q3YM5ULh0kWzpUXBKh5b2

    //   //Filter Example
    //   // let exampleFilter: Observable<any> = this.af.database.list('items')
    //   //   .map(items => {
    //   //     return items.filter(item => item.name === 'Jeff');
    //   //   })
    //   //   .do(item => console.log('good for debugs - but bad practice', item));
    // }

    // // getExamplePortfolio(): FirebaseObjectObservable<any> {
    // getExamplePortfolio(): any {
    //   return this.exampleItem;
    // }

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

    updateSharesPerPortfolio(artistId: string, portfolioId: string, numberOfShares: number): void {
        this.db.object(`/sharesPerPortfolio/${portfolioId}/${artistId}`)
            .take(1)
            .subscribe(sharesPerPortfolio => {
                let updatedShareCount = numberOfShares;
                // If they already have shares - update the count
                if (sharesPerPortfolio.$exists()) {
                    updatedShareCount += sharesPerPortfolio.$value;
                }
                // Update the endpoint with the share count
                this.db.object(`/sharesPerPortfolio/${portfolioId}/${artistId}`)
                    .set(updatedShareCount);
            });
    }

    sharesPerPortfolio(uid: string): FirebaseListObservable<IDictionary[]> {
        return this.db.list(`/sharesPerPortfolio/${uid}`);
    }

    artistFollowsPerUser(uid: string): FirebaseListObservable<IDictionary[]> {
        return this.db.list(`/artistFollowsPerUser/${uid}`);
    }

    portfolioById(uid: string): FirebaseObjectObservable<IDbPortfolio> {
        return this.db.object(`/portfolios/${uid}`);
    }

}
