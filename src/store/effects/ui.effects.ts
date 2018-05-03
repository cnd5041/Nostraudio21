import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import * as uiActions from '../actions/ui.actions';
import { UiService } from '../../providers/ui-service';

@Injectable()
export class UiEffects {

    constructor(
        private actions$: Actions,
        private uiService: UiService
    ) {
    }

    @Effect({ dispatch: false })
    ShowBasicAlert$ = this.actions$
        .ofType(uiActions.SHOW_BASIC_ALERT)
        .map((action: uiActions.ShowBasicAlert) => action.payload)
        .do(payload => {
            this.uiService.showBasicAlert(payload);
        });


    @Effect({ dispatch: false })
    ShowToast$ = this.actions$
        .ofType(uiActions.SHOW_TOAST)
        .map((action: uiActions.ShowToast) => action.payload)
        .do(payload => {
            this.uiService.showToast(payload);
        });

    @Effect({ dispatch: false })
    ShowLoading$ = this.actions$
        .ofType(uiActions.SHOW_LOADING)
        .map((action: uiActions.ShowLoading) => action.payload)
        .do(payload => {
            this.uiService.showLoading(payload);
        });

    @Effect({ dispatch: false })
    HideLoading$ = this.actions$
        .ofType(uiActions.HIDE_LOADING)
        .map((action: uiActions.HideLoading) => action.payload)
        .do(payload => {
            this.uiService.hideLoading();
        });

}
