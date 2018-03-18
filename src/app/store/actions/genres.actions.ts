import { Action } from '@ngrx/store';

import { IDbGenre, IDbGenreMap } from '../../../models';

export const FETCH_GENRES = '[music] Fetch GENRES';
export const FETCH_GENRES_SUCCESS = '[music] Fetch GENRES Success';
export const FETCH_GENRES_FAIL = '[music] Fetch GENRES Fail';

export class FetchGenres implements Action {
    readonly type = FETCH_GENRES;
    constructor() { }
}

export class FetchGenresSuccess implements Action {
    readonly type = FETCH_GENRES_SUCCESS;
    constructor(public payload: IDbGenreMap) { }
}

export class FetchGenresFail implements Action {
    readonly type = FETCH_GENRES_FAIL;
    constructor(public payload?: any) { }
}

export type GenresActions =
    FetchGenres |
    FetchGenresSuccess |
    FetchGenresFail;
