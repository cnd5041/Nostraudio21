import { Action } from '@ngrx/store';
import { ToastOptions, AlertOptions } from 'ionic-angular';

export const SHOW_BASIC_ALERT = '[music] Show Basic Alert';
export const SHOW_TOAST = '[music] Show Toast';

export class ShowBasicAlert implements Action {
    readonly type = SHOW_BASIC_ALERT;
    constructor(public payload: AlertOptions) { }
}

export class ShowToast implements Action {
    readonly type = SHOW_TOAST;
    constructor(public payload: ToastOptions) { }
}

export type UiActions =
    ShowBasicAlert
    | ShowToast;
