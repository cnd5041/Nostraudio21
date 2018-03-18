import { Action } from '@ngrx/store';
import { ToastOptions, AlertOptions, LoadingOptions } from 'ionic-angular';

export const SHOW_BASIC_ALERT = '[music] Show Basic Alert';
export const SHOW_TOAST = '[music] Show Toast';
export const SHOW_LOADING = '[music] Show Loading';
export const HIDE_LOADING = '[music] Hide Loading';

export class ShowBasicAlert implements Action {
    readonly type = SHOW_BASIC_ALERT;
    constructor(public payload: AlertOptions) { }
}

export class ShowToast implements Action {
    readonly type = SHOW_TOAST;
    constructor(public payload: ToastOptions) { }
}

export class ShowLoading implements Action {
    readonly type = SHOW_LOADING;
    constructor(public payload?: LoadingOptions) { }
}

export class HideLoading implements Action {
    readonly type = HIDE_LOADING;
    constructor(public payload?: string) { }
}

export type UiActions =
    ShowBasicAlert
    | ShowToast
    | ShowLoading
    | HideLoading;
