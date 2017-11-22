import { combineAll } from 'rxjs/operator/combineAll';
import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { FirebaseProvider } from '../../../providers';

import * as artistActions from './artist.actions';

@Injectable()
export class ArtistsEffects {

    constructor(
        private actions$: Actions,
        private firebaseProvider: FirebaseProvider
    ) {
    }

    @Effect()
    FetchArtists$: Observable<Action> = this.actions$
        .ofType(artistActions.FETCH_ARTISTS)
        .switchMap(() => {
            return this.firebaseProvider.artists
                .map(payload => {
                    return new artistActions.FetchArtistsSuccess(payload)
                })
                .catch(() => of(new artistActions.FetchArtistsSuccess([])));
            // TODO: Error handle the catch, don't just return empty array
        });

}


