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
import { map, switchMap, catchError, tap, withLatestFrom, takeUntil } from 'rxjs/operators';
import { pickBy, keysIn } from 'lodash';
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
            })
        ).subscribe((value) => {
            this.store.dispatch(new appActions.SetFriendsList(value));
        });
    }

    @Effect({ dispatch: false })
    FetchFriends$ = this.actions$
        .ofType(appActions.FETCH_FRIENDS)
        .pipe(
            map((action: appActions.FetchFriends) => action.payload),
            tap((portfolioId: string) => {
                this.portfolioId$.next(portfolioId);
            })
        );

    @Effect()
    fetchFriendPortfolio$ = this.actions$
        .ofType(appActions.FETCH_FRIEND_PORTFOLIO)
        .pipe(
            map((action: appActions.FetchFriendPortfolio) => action.payload),
            switchMap((porfolioId: string) => {
                return this.firebaseProvider.getFullPortfolio(porfolioId)
                    .pipe(
                        map(portfolio => new appActions.FetchFriendPortolioSuccess(portfolio)),
                        catchError(() => {
                            this.store.dispatch(new appActions.ShowToast({
                                message: 'There was a problem.',
                                position: 'top',
                                duration: 2000
                            }));
                            return of(new appActions.FetchFriendPortolioSuccess(null));
                        })
                    );
            }),
        // map((portfolioId)=> {
        //     return new appActions.FetchPortfolioSuccess(null);
        // })
        // Leaving off. I'll have to rework the portfolio selector that combines
        // all the stuff into a usable service call that does a single GET
        // switchMap((portfolioId: string)=> {
        //     // this.firebaseProvider.get
        //     console.log(portfolioId);
        //     // return
        // })
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
        });

    @Effect({ dispatch: false })
    AddFriend$ = this.actions$
        .ofType(appActions.ADD_FRIEND)
        .pipe(
            map((action: appActions.AddFriend) => action.payload),
            withLatestFrom(this.portfolioId$),
            tap(([friendId, portfolioId]) => {
                this.updateFriendStatus(friendId, portfolioId, true);
            })
        );

    @Effect({ dispatch: false })
    RemoveFriend$ = this.actions$
        .ofType(appActions.REMOVE_FRIEND)
        .pipe(
            map((action: appActions.RemoveFriend) => action.payload),
            withLatestFrom(this.portfolioId$),
            tap(([friendId, portfolioId]) => {
                this.updateFriendStatus(friendId, portfolioId, false);
            })
        );

    private updateFriendStatus(friendId: string, portfolioId: string, value: boolean): void {
        if (friendId && portfolioId) {
            this.db.object(`/friendsPerPortfolio/${portfolioId}/${friendId}`).set(value);
        } else {
            console.error('Missing Friend or PortfolioId');
            this.store.dispatch(new appActions.ShowToast({
                message: 'There was a problem.',
                position: 'top',
                duration: 2000
            }));
        }
    }
}


