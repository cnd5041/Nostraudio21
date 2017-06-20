import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { IDbArtist, IGenre } from '../models/artist.model';
import * as _ from 'lodash';


@Injectable()
export class FirebaseStore {

  artists: FirebaseListObservable<IDbArtist[]>;
  genres: Observable<IGenre[]>;


  constructor(
    private db: AngularFireDatabase
  ) {
    this.artists = db.list('/artists');

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




}
