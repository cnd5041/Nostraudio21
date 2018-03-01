// import { combineAll } from 'rxjs/operator/combineAll';
import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { FirebaseProvider } from '../../../providers';

import * as appActions from '../actions';
import * as fromReducers from '../reducers';
import * as fromSelectors from '../selectors';
// import * as fromStore from '../';



@Injectable()
export class ArtistEffects {

    constructor(
        private actions$: Actions,
        private firebaseProvider: FirebaseProvider,
        private store: Store<fromReducers.MusicState>
    ) {
    }

    @Effect()
    FetchArtists$: Observable<Action> = this.actions$
        .ofType(appActions.FETCH_ARTISTS)
        .switchMap(() => {
            return this.firebaseProvider.artists
                .map(payload => new appActions.FetchArtistsSuccess(payload))
                .catch((error) => of(new appActions.FetchArtistsFail(error)));
        });

    @Effect()
    FetchGenresPerArtist$: Observable<Action> = this.actions$
        .ofType(appActions.FETCH_GENRES_PER_ARTIST)
        .switchMap(() => {
            return this.firebaseProvider.genresPerArtist
                .map(payload => new appActions.FetchGenresPerArtistSuccess(payload))
                .catch((error) => of(new appActions.FetchGenresPerArtistSuccess({})));
        });

    @Effect()
    SetSelectedArtistFollows$: Observable<Action> = this.actions$
        .ofType(appActions.SET_SELECTED_ARTIST_ID)
        .map((action: appActions.SetSelectedArtistId) => action.payload)
        .switchMap((spotifyId) => {
            if (spotifyId) {
                return this.firebaseProvider.followsPerArtistByArtistId(spotifyId)
                    .map(payload => new appActions.SetSelectedArtistFollows(payload));
                // .catch((error) => of(new appActions.FetchGenresPerArtistSuccess({})));
            } else {
                return of(new appActions.SetSelectedArtistFollows(null));
            }
        });

    @Effect()
    SetSelectedArtistStockholders$: Observable<Action> = this.actions$
        .ofType(appActions.SET_SELECTED_ARTIST_ID)
        .map((action: appActions.SetSelectedArtistId) => action.payload)
        .switchMap((spotifyId) => {
            if (spotifyId) {
                return this.firebaseProvider.stockholdersPerArtistByArtistId(spotifyId)
                    .map(payload => new appActions.SetSelectedArtistStockholders(payload));
                // .catch((error) => of(new appActions.FetchGenresPerArtistSuccess({})));
            } else {
                return of(new appActions.SetSelectedArtistStockholders(null));
            }
        });

    @Effect({ dispatch: false })
    UserFollowArtist$ = this.actions$
        .ofType(appActions.USER_FOLLOW_ARTIST)
        .map((action: appActions.UserFollowArtist) => action.payload)
        .do(payload => {
            this.firebaseProvider.followArtist(payload.artistKey, payload.portfolioKey, 'follow');
        });

    @Effect({ dispatch: false })
    UserUnfollowArtist$ = this.actions$
        .ofType(appActions.USER_UNFOLLOW_ARTIST)
        .map((action: appActions.UserUnfollowArtist) => action.payload)
        .do(payload => {
            this.firebaseProvider.followArtist(payload.artistKey, payload.portfolioKey, 'unfollow');
        });

    @Effect({ dispatch: false })
    UserBuyArtist$ = this.actions$
        .ofType(appActions.USER_BUY_ARTIST)
        .map((action: appActions.UserBuyArtist) => action.payload)
        .switchMap((payload) => {
            return this.firebaseProvider
                .userBuyArtist(payload.portfolio, payload.artistKey, payload.shareCount, payload.price)
                .map((result) => {
                    this.store.dispatch(new appActions.ShowToast({
                        message: 'Purchase was successful!',
                        position: 'top',
                        duration: 4000
                    }));
                })
                .catch((error) => {
                    this.store.dispatch(new appActions.ShowBasicAlert({
                        title: 'Error',
                        subTitle: error,
                        buttons: ['Ok']
                    }));
                    return Observable.of();
                });
        });

    @Effect({ dispatch: false })
    UserSellArtist$ = this.actions$
        .ofType(appActions.USER_SELL_ARTIST)
        .map((action: appActions.UserSellArtist) => action.payload)
        .switchMap((payload) => {
            return this.firebaseProvider
                .userSellArtist(payload.portfolio, payload.artistKey, payload.shareCount, payload.price)
                .map((result) => {
                    this.store.dispatch(new appActions.ShowToast({
                        message: 'Sale was successful!',
                        position: 'top',
                        duration: 4000
                    }));
                })
                .catch((error) => {
                    this.store.dispatch(new appActions.ShowBasicAlert({
                        title: 'Error',
                        subTitle: error,
                        buttons: ['Ok']
                    }));
                    return Observable.of();
                });
        });


    // Example From: https://www.youtube.com/watch?v=13nWhUndQo4
    // see example below for .update
    // https://github.com/codediodeio/ngrx-fire/blob/master/src/app/state/posts/post.facade.ts
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


