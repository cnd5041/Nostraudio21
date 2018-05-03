import { Injectable } from '@angular/core';
// NGRX
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import * as appActions from '../actions';
import { MusicState } from '../reducers';
// Firebase
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
// Library Imports
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError, tap, withLatestFrom, filter, take } from 'rxjs/operators';
import { forOwn } from 'lodash';
// Providers
import { NosFirebaseService } from '../../providers/firebase-service';
import { UiService } from '../../providers/ui-service';
// Models
import {
    IFollowsPerArtistItem, nosArtistFromDbArtist, ICountReferenceDictionary, IDbArtist,
    IReferenceDictionary, IDbGenre, IDbGenreMap, IDbGenreNameMap, IArtistsPerGenreMap, INosArtist
} from '../../models';

@Injectable()
export class ArtistEffects {

    constructor(
        private actions$: Actions,
        private store: Store<MusicState>,
        private firebaseProvider: NosFirebaseService,
        private db: AngularFireDatabase,
        private uiService: UiService
    ) {
        // Artists
        this.firebaseProvider.nosArtists$
            .subscribe((value: { key: string, artist: INosArtist }) => {
                this.store.dispatch(new appActions.ArtistMapAdd({ key: value.key, artist: value.artist }));
            });

        // Genres Per Artist
        this.firebaseProvider.artistsPerGenre$
            .subscribe((value: IArtistsPerGenreMap) => {
                this.store.dispatch(new appActions.SetArtistsPerGenreMap(value));
            });

        // Genres
        this.firebaseProvider.genresList$
            .subscribe((value: IDbGenreMap) => {
                this.store.dispatch(new appActions.SetGenresMap(value));
            });
    }

    @Effect()
    SetSelectedArtistFollows$: Observable<Action> = this.actions$
        .ofType(appActions.SET_SELECTED_ARTIST_ID)
        .pipe(
            map((action: appActions.SetSelectedArtistId) => action.payload),
            switchMap((spotifyId: string) => {
                if (spotifyId) {
                    return this.firebaseProvider.followsPerArtistByArtistId(spotifyId)
                        .map((payload: IFollowsPerArtistItem) => new appActions.SetSelectedArtistFollows(payload));
                } else {
                    return of(new appActions.SetSelectedArtistFollows(null));
                }
            }));

    @Effect({ dispatch: false })
    CheckArtistExistence$ = this.actions$
        .ofType(appActions.SET_SELECTED_ARTIST_ID)
        .pipe(
            map((action: appActions.SetSelectedArtistId) => action.payload),
            switchMap((spotifyId) => {
                return this.firebaseProvider.checkSpotifyId(spotifyId);
            }),
            map((result) => {
                // DO NOTHING
            }),
            catchError((error) => {
                this.store.dispatch(new appActions.ShowBasicAlert({
                    title: 'Error',
                    subTitle: 'There was an error getting the artist.',
                    buttons: ['Ok']
                }));

                this.uiService.goBack();
                return of();
            })
        );

    @Effect({ dispatch: false })
    UserFollowArtist$ = this.actions$
        .ofType(appActions.USER_FOLLOW_ARTIST)
        .pipe(
            map((action: appActions.UserFollowArtist) => action.payload),
            tap((payload) => {
                this.firebaseProvider.followArtist(payload.artistKey, payload.portfolioKey, 'follow');
            })
        );

    @Effect({ dispatch: false })
    UserUnfollowArtist$ = this.actions$
        .ofType(appActions.USER_UNFOLLOW_ARTIST)
        .pipe(
            map((action: appActions.UserUnfollowArtist) => action.payload),
            tap(payload => {
                this.firebaseProvider.followArtist(payload.artistKey, payload.portfolioKey, 'unfollow');
            })
        );

    @Effect({ dispatch: false })
    UserBuyArtist$ = this.actions$
        .ofType(appActions.USER_BUY_ARTIST)
        .pipe(
            map((action: appActions.UserBuyArtist) => action.payload),
            switchMap((payload) => {
                return this.firebaseProvider
                    .userBuyArtist(payload.portfolio, payload.artistKey, payload.shareCount, payload.price)
                    .pipe(
                        map((result) => {
                            this.store.dispatch(new appActions.ShowToast({
                                message: 'Purchase was successful!',
                                position: 'top',
                                duration: 4000
                            }));
                        }),
                        catchError((error) => {
                            this.store.dispatch(new appActions.ShowBasicAlert({
                                title: 'Error',
                                subTitle: error,
                                buttons: ['Ok']
                            }));
                            return Observable.of();
                        })
                    );
            })
        );

    @Effect({ dispatch: false })
    UserSellArtist$ = this.actions$
        .ofType(appActions.USER_SELL_ARTIST)
        .pipe(
            map((action: appActions.UserSellArtist) => action.payload),
            switchMap((payload) => {
                return this.firebaseProvider
                    .userSellArtist(payload.portfolio, payload.artistKey, payload.shareCount, payload.price)
                    .pipe(
                        map((result) => {
                            this.store.dispatch(new appActions.ShowToast({
                                message: 'Sale was successful!',
                                position: 'top',
                                duration: 4000
                            }));
                        }),
                        catchError((error) => {
                            this.store.dispatch(new appActions.ShowBasicAlert({
                                title: 'Error',
                                subTitle: error,
                                buttons: ['Ok']
                            }));
                            return Observable.of();
                        })
                    );
            })
        );


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


