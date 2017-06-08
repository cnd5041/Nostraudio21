import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { IDbArtist } from '../models/artist.model';


@Injectable()
export class FirebaseStore {

  artists: FirebaseListObservable<IDbArtist[]>;
  genres: FirebaseListObservable<string[]>;


  constructor(
    private db: AngularFireDatabase
  ) {
    this.artists = db.list('/artists');

    this.genres = db.list('/genres');


    this.genres.subscribe(genres => {
      console.log('genres', genres);
    });

    /**
     Genres: probably want to normalize genre names and then
     have the text as the value, that way I can do /genre_name
    to see if it exists rather than searching
    genreArtistXref
    
     */

  }




}
