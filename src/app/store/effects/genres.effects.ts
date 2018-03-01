import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { FirebaseProvider } from '../../../providers';

import * as appActions from '../actions';

@Injectable()
export class GenreEffects {

    constructor(
        private actions$: Actions,
        private firebaseProvider: FirebaseProvider
    ) {
    }

    @Effect()
    FetchGenres$: Observable<Action> = this.actions$
        .ofType(appActions.FETCH_GENRES)
        .switchMap(() => {
            return this.firebaseProvider.genres
                .map(payload => new appActions.FetchGenresSuccess(payload))
                .catch((error) => of(new appActions.FetchGenresFail(error)));
        });

}
