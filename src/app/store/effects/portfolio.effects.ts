import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { FirebaseProvider } from '../../../providers';

import * as appActions from '../actions';

@Injectable()
export class PortfolioEffects {

    constructor(
        private actions$: Actions,
        private firebaseProvider: FirebaseProvider
    ) {
    }

    @Effect()
    FetchPortfolio$: Observable<Action> = this.actions$
        .ofType(appActions.FETCH_PORTFOLIO)
        .map((action: appActions.FetchPortfolio) => action.payload)
        .switchMap((portfolioId) => {
            return this.firebaseProvider.getUserPortfolio(portfolioId)
                .map(payload => {
                    if (payload) {
                        return new appActions.FetchPortfolioSuccess(payload);
                    } else {
                        return new appActions.CreatePorfolio(portfolioId);
                    }
                })
                .catch((error) => of(new appActions.FetchPortfolioFail(error)));
        });

    @Effect({ dispatch: false })
    CreatePortfolio$ = this.actions$
        .ofType(appActions.CREATE_PORTFOLIO)
        .map((action: appActions.CreatePorfolio) => action.payload)
        .do(portfolioId => {
            this.firebaseProvider.createPortfolio(portfolioId);
        });

}
