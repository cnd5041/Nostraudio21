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
import { map, switchMap, catchError, tap, withLatestFrom, filter, take, takeUntil, takeWhile } from 'rxjs/operators';
import { forOwn, pickBy, map as _map, keysIn } from 'lodash';
// Providers
import { NosFirebaseService } from '../../providers/firebase-service';
import { UiService } from '../../providers/ui-service';
import { IReferenceDictionary, IDbPortfolio } from '../../models';

@Injectable()
export class FriendsEffects {

    private portfolioId$: BehaviorSubject<string> = new BehaviorSubject(null);

    private mapValueToKey(actions: AngularFireAction<any>[]): any {
        const map = {};
        actions.forEach((action) => {
            map[action.key] = action.payload.val();
        });
        return map;
    }

    constructor(
        private actions$: Actions,
        private store: Store<MusicState>,
        private firebaseProvider: NosFirebaseService,
        private db: AngularFireDatabase,
        private uiService: UiService,
    ) {
        // the value will be 'true', 'false', or 'pending'
        // it gets set to true when the other person accepts

        // Observe the Portfolio Id, get the friendsPerPortfolio for it
        const friendsMap$: Observable<IReferenceDictionary> = this.portfolioId$.pipe(
            switchMap((portfolioId: string) => {
                if (portfolioId) {
                    return this.db.list(`/friendsPerPortfolio/${portfolioId}`)
                        .snapshotChanges()
                        .pipe(
                            map((actions) => this.mapValueToKey(actions))
                        );
                } else {
                    return Observable.of(null);
                }
            }),
        );

        // Observe the friendsMap$, set the friends map, get all the portfolios
        friendsMap$.pipe(
            tap((value) => {
                this.store.dispatch(new appActions.SetFriendsMap(value));
            }),
            switchMap((friendsMap: IReferenceDictionary) => {
                const keys = keysIn(pickBy(friendsMap, (x) => x === true));
                return firebaseProvider.getPortfoliosByIds(keys);
                // .map((portfolios) => {
                //     return keys.map((value, index) => {
                //         return {
                //             status: friendsMap[value],
                //             portfolio: portfolios[index],
                //             key: value
                //         };
                //     });
                // });
            })
        ).subscribe((value) => {
            console.log('friends portfolios2', value);
            this.store.dispatch(new appActions.SetFriendsList(value));
        });

        /*
            Search

            Display each friend as a follow (true/false)
                Future alert that someone followed you

            click will go to their profile

            maybe adapt the get full portfolio to do a take one
        */


        // Friends of friends....I'll want to get a list of friends ids
        // then fetch their portfolios (once is fine..)
    }

    @Effect({ dispatch: false })
    FetchFriends$ = this.actions$
        .ofType(appActions.FETCH_FRIENDS)
        .pipe(
            map((action: appActions.FetchFriends) => action.payload),
            tap((portfolioId: string) => {
                console.log('effect', portfolioId);
                this.portfolioId$.next(portfolioId);
            })
        );

    @Effect()
    searchFriends$: Observable<Action> = this.actions$
        .ofType(appActions.SEARCH_FRIENDS)
        .map((action: appActions.SearchFriends) => action.payload)
        .switchMap(query => {
            if (query === '') {
                return of(new appActions.SearchFriendsComplete([]));
            }

            const nextSearch$ = this.actions$.ofType(appActions.SEARCH_FRIENDS).skip(1);

            return this.db.list<IDbPortfolio>('/portfolios').valueChanges().pipe(
                takeUntil(nextSearch$),
                map((portfolios) => {
                    return portfolios
                        .filter(p => {
                            return p.displayName.toLowerCase().includes(query.toLowerCase());
                        })
                        .map(p => {
                            return { userProfile: p.userProfile, displayName: p.displayName };
                        });
                }),
                map(results => new appActions.SearchFriendsComplete(results)),
                catchError(() => {
                    this.store.dispatch(new appActions.ShowToast({
                        message: 'There was a problem with the search.',
                        position: 'top',
                        duration: 2000
                    }));
                    return of(new appActions.SearchFriendsComplete([]));
                })
            );
            // return this.spotifyService.searchArtists(query).pipe(
            //     map(results => results.filter(x => x.spotifyPopularity > 5 && x.spotifyFollowers > 250)),
            //     takeUntil(nextSearch$),
            //     map(results => new appActions.SearchArtistsComplete(results)),
            //     catchError(() => {
            //         this.store.dispatch(new appActions.ShowToast({
            //             message: 'There was a problem with the search.',
            //             position: 'top',
            //             duration: 2000
            //         }));
            //         return of(new appActions.SearchArtistsComplete([]));
            //     })
            // );
        });

    // @Effect({ dispatch: false })
    // FetchFriendsPortfolios$ = this.actions$
    //     .ofType(appActions.SET_FRIENDS_MAP)
    //     .pipe(
    //         map((action: appActions.SetFriendsMap) => action.payload),
    //         tap((friendsMap) => {
    //             console.log('go get friends', friendsMap);
    //             const friends = pickBy(friendsMap, value => value === true);


    //         })
    //     );

    // @Effect()
    // SetSelectedArtistFollows$: Observable<Action> = this.actions$
    //     .ofType(appActions.SET_SELECTED_ARTIST_ID)
    //     .pipe(
    //         map((action: appActions.SetSelectedArtistId) => action.payload),
    //         switchMap((spotifyId: string) => {
    //             if (spotifyId) {
    //                 return this.firebaseProvider.followsPerArtistByArtistId(spotifyId)
    //                     .map((payload: IFollowsPerArtistItem) => new appActions.SetSelectedArtistFollows(payload));
    //             } else {
    //                 return of(new appActions.SetSelectedArtistFollows(null));
    //             }
    //         }));


}


