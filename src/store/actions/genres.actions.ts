import { Action } from '@ngrx/store';

import { IDbGenreMap, IArtistsPerGenreMap } from '../../models';

export const SET_GENRES_MAP = '[music] SET_GENRES_MAP';
export const SET_GENRES_FILTER = '[music] SET_GENRES_FILTER';
export const SET_ARTISTS_PER_GENRE_MAP = '[music] SET_ARTISTS_PER_GENRE';

export class SetGenresMap implements Action {
    readonly type = SET_GENRES_MAP;
    constructor(public payload: IDbGenreMap) { }
}

export class SetGenresFilter implements Action {
    readonly type = SET_GENRES_FILTER;
    constructor(public payload: string[]) { }
}

export class SetArtistsPerGenreMap implements Action {
    readonly type = SET_ARTISTS_PER_GENRE_MAP;
    constructor(public payload: IArtistsPerGenreMap) { }
}

export type GenresActions =
    SetGenresMap |
    SetGenresFilter |
    SetArtistsPerGenreMap;
