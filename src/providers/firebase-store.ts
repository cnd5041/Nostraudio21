import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class FirebaseStore {

  artists: FirebaseListObservable<any[]>;


  constructor(
    public af: AngularFire
  ) {
    this.artists = af.database.list('/artists');

  }




}
