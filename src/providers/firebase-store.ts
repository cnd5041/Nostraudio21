import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

import * as _ from 'lodash';

@Injectable()
export class FirebaseStore {

  artists: FirebaseListObservable<any[]>;
  genres: FirebaseListObservable<string[]>;


  constructor(
    public af: AngularFire
  ) {
    this.artists = af.database.list('/artists');

    this.genres = af.database.list('/genres');


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
