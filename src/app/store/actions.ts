import { Action } from '@ngrx/store';

import { IGenre, IDbArtist } from '../../models';

export const FETCH_GENRES = 'Fetch GENRES';
export const FETCH_GENRES_SUCCESS = 'Fetch GENRES Success';

export const FETCH_ARTIST_GENRES = 'Fetch ARTIST GENRES';
export const FETCH_ARTIST_GENRES_SUCCESS = 'Fetch ARTIST GENRES Success';

export const FETCH_ARTIST_DETAIL = 'Fetch FETCH_CURRENT_ARTIST';
export const FETCH_ARTIST_DETAIL_SUCCESS = 'Fetch FETCH_CURRENT_ARTIST_SUCCESS ';

export class FetchGenres implements Action {
    readonly type = FETCH_GENRES;
    constructor() { };
}

export class FetchGenresSuccess implements Action {
    readonly type = FETCH_GENRES_SUCCESS;
    constructor(public payload: IGenre[]) { };
}

export class FetchArtistGenres implements Action {
    readonly type = FETCH_ARTIST_GENRES;
    constructor(public payload: string) { };
}

export class FetchArtistGenresSuccess implements Action {
    readonly type = FETCH_ARTIST_GENRES_SUCCESS;
    constructor(public payload: IGenre[]) { };
}

export class FetchArtistDetail implements Action {
    readonly type = FETCH_ARTIST_DETAIL;
    constructor(public payload: string) { };
}

export class FetchArtistDetailSuccess implements Action {
    readonly type = FETCH_ARTIST_DETAIL_SUCCESS;
    constructor(public payload: IDbArtist) { };
}

export type Actions = FetchGenres | FetchGenresSuccess |
    FetchArtistGenres | FetchArtistGenresSuccess |
    FetchArtistDetail | FetchArtistDetailSuccess;
