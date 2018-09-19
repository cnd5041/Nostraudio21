import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

import { NosFirebaseService } from '../../providers/firebase-service';

import * as appActions from '../actions';

@Injectable()
export class PortfolioEffects {

    constructor(
        private actions$: Actions,
        private firebaseProvider: NosFirebaseService
    ) {
    }

    @Effect()
    FetchPortfolio$: Observable<Action> = this.actions$
        .ofType(appActions.FETCH_PORTFOLIO).pipe(
            map((action: appActions.FetchPortfolio) => action.payload),
            switchMap((portfolioId) => {
                return this.firebaseProvider.getUserPortfolio(portfolioId)
                    .pipe(
                        map(payload => {
                            if (payload) {
                                return new appActions.FetchPortfolioSuccess(payload);
                            } else {
                                return new appActions.CreatePorfolio(portfolioId);
                            }
                        }),
                        catchError(error => {
                            console.error('FetchPortfolio', error);
                            return of(new appActions.FetchPortfolioFail());
                        })
                    );
            })
        );

    @Effect({ dispatch: false })
    CreatePortfolio$ = this.actions$
        .ofType(appActions.CREATE_PORTFOLIO)
        .pipe(
            map((action: appActions.CreatePorfolio) => action.payload),
            tap(portfolioId => {
                this.firebaseProvider.createPortfolio(portfolioId);
            })
        );

}
