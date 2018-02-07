import { combineAll } from 'rxjs/operator/combineAll';
import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { FirebaseProvider } from '../../../providers';

import * as appActions from '../actions';
import * as reducer from '../reducers';


@Injectable()
export class ArtistEffects {

    constructor(
        private actions$: Actions,
        private firebaseProvider: FirebaseProvider,
        private store: Store<reducer.MusicState>
    ) {
    }

    @Effect()
    FetchArtists$: Observable<Action> = this.actions$
        .ofType(appActions.FETCH_ARTISTS)
        .switchMap(() => {
            return this.firebaseProvider.artists
                .map(payload => new appActions.FetchArtistsSuccess(payload))
                .catch(() => of(new appActions.FetchArtistsSuccess([])));
            // TODO: Error handle the catch, don't just return empty array
        });


    // Example From: https://www.youtube.com/watch?v=13nWhUndQo4
    // @Effect()
    // FetchPost$: Observable<Action> = this.actions$
    //     .ofType(appActions.GET_POST)
    //     .map((action) => action.payload)
    //     .mergeMap((key) => this.db.object(key))
    //     .map((post) => {
    //         post.pushKey = post.$key
    //         return new Action.success
    //     });


    // @Effect()
    // FetchGenres$: Observable<Action> = this.actions$
    //     .ofType(appActions.FETCH_GENRES)
    //     .switchMap(() => {
    //         return this.firebaseProvider.genres
    //             .map(payload => new appActions.FetchGenresSuccess(payload))
    //             .catch(() => of(new appActions.FetchGenresSuccess([])));
    //         // TODO: Error handle the catch, don't just return empty array
    //     });

    // @Effect()
    // FetchArtistGenres$: Observable<Action> = this.actions$
    //     .ofType(appActions.FETCH_ARTIST_GENRES)
    //     .map((action: appActions.FetchArtistGenres) => { return action.payload })
    //     .switchMap((spotifyId: string) => {

    //         return this.firebaseProvider.genresByArtist(spotifyId)
    //             .withLatestFrom(this.store.select(state => state.app.genres))
    //             .map((results) => {
    //                 let artistGenres = results[0];
    //                 let genres = results[1];
    //                 return genres.filter(genre => {
    //                     let result = artistGenres.findIndex(g => g.$key === genre.$key);
    //                     return (result ? true : false);
    //                 });
    //             })
    //             .map(payload => new appActions.FetchArtistGenresSuccess(payload));
    //     });

    // @Effect()
    // FetchArtistDetail$: Observable<Action> = this.actions$
    //     .ofType(appActions.FETCH_ARTIST_DETAIL)
    //     .map((action: appActions.FetchArtistDetail) => { return action.payload })

    //     .switchMap((spotifyId: string) => {

    //         // TODO: Error handle the catch, don't just return empty array
    //     });

}


