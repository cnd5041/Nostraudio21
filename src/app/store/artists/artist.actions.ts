import { Action } from '@ngrx/store';

import { IGenre, IDbArtist } from '../../../models';

export const FETCH_ARTISTS = 'Fetch ARTISTS';
export const FETCH_ARTISTS_SUCCESS = 'Fetch ARTISTS Success';

export class FetchArtists implements Action {
    readonly type = FETCH_ARTISTS;
    constructor() { };
}

export class FetchArtistsSuccess implements Action {
    readonly type = FETCH_ARTISTS_SUCCESS;
    constructor(public payload: IDbArtist[]) { };
}


export type Actions = FetchArtists | FetchArtistsSuccess;
