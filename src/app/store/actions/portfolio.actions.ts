import { Action } from '@ngrx/store';

import {
    IDbPortfolio, INosPortfolio
} from '../../../models';

export const FETCH_PORTFOLIO = '[music] Fetch PORTFOLIO';
export const FETCH_PORTFOLIO_SUCCESS = '[music] Fetch PORTFOLIO Success';
export const FETCH_PORTFOLIO_FAIL = '[music] Fetch PORTFOLIO Fail';

export const CREATE_PORTFOLIO = '[music] Create PORTFOLIO';

export const RESET_PORTFOLIO = '[music] RESET_PORTFOLIO';

export class FetchPortfolio implements Action {
    readonly type = FETCH_PORTFOLIO;
    constructor(public payload: string) { }
}

export class FetchPortfolioSuccess implements Action {
    readonly type = FETCH_PORTFOLIO_SUCCESS;
    constructor(public payload: INosPortfolio) { }
}

export class FetchPortfolioFail implements Action {
    readonly type = FETCH_PORTFOLIO_FAIL;
    constructor(public payload?: any) { }
}

export class ResetPorfolio implements Action {
    readonly type = RESET_PORTFOLIO;
    constructor() { }
}

export class CreatePorfolio implements Action {
    readonly type = CREATE_PORTFOLIO;
    constructor(public payload: string) { }
}

export type PortfolioActions =
    FetchPortfolio |
    FetchPortfolioSuccess |
    FetchPortfolioFail |
    ResetPorfolio |
    CreatePorfolio;
