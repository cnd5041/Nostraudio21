import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { IGenre, IDictionary, IDbArtist } from '../models';

import {
    AngularFireDatabase,
    FirebaseListObservable
} from 'angularfire2/database';

@Injectable()
export class FirebaseProvider {
    artists: FirebaseListObservable<IDbArtist[]>;
    genres: FirebaseListObservable<IGenre[]>;

    constructor(
        private db: AngularFireDatabase
    ) {
        this.artists = this.db.list('/artists');
        this.genres = this.db.list('/genres');
    }

    genresByArtist(spotifyId: string): Observable<IDictionary[]> {
        return this.db.list(`/genresPerArtist/${spotifyId}`);
    }

    // artistById(spotifyId: string): Observable<IDbArtist[]> {
    //     return this.db.list(`/artists/${spotifyId}`);
    // }

    // getGenresByArtistId(spotifyId: string): Observable<IGenre[]> {
    //     return this.db.list(`/genresPerArtist/${spotifyId}`)
    //         .combineLatest(this.genres)
    //         .map((results) => {
    //             let artistGenres = results[0];
    //             let genres = results[1];

    //             return genres.filter(genre => {
    //                 let result = artistGenres.findIndex(g => g.$key === genre.$key);
    //                 return (result ? true : false);
    //             });
    //         });
    // }

}
