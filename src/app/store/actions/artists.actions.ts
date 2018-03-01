import { Action } from '@ngrx/store';

import {
    IArtistEntityList, IGenresPerArtistEntityList, IStockholdersPerArtistItem, IFollowsPerArtistEntity,
    IFollowsPerArtistItem, INosPortfolio
} from '../../../models';

export const FETCH_ARTISTS = '[music] Fetch ARTISTS';
export const FETCH_ARTISTS_SUCCESS = '[music] Fetch ARTISTS Success';
export const FETCH_ARTISTS_FAIL = '[music] Fetch ARTISTS Fail';

export const SET_SELECTED_ARTIST_ID = '[music] Set Selected Artist Id';

export const FETCH_GENRES_PER_ARTIST = '[music] Fetch FETCH_GENRES_PER_ARTIST';
export const FETCH_GENRES_PER_ARTIST_SUCCESS = '[music] Fetch FETCH_GENRES_PER_ARTIST Success';

export const SET_SELECTED_ARTIST_FOLLOWS = '[music] Fetch SET_SELECTED_ARTIST_FOLLOWS';
export const SET_SELECTED_ARTIST_STOCKHOLDERS = '[music] Fetch SET_SELECTED_ARTIST_STOCKHOLDERS';

export const USER_FOLLOW_ARTIST = '[music] USER_FOLLOW_ARTIST';
export const USER_UNFOLLOW_ARTIST = '[music] USER_UNFOLLOW_ARTIST';

export const USER_BUY_ARTIST = '[music] USER_BUY_ARTIST';
export const USER_SELL_ARTIST = '[music] USER_SELL_ARTIST';

export class FetchArtists implements Action {
    readonly type = FETCH_ARTISTS;
    constructor() { }
}

export class FetchArtistsSuccess implements Action {
    readonly type = FETCH_ARTISTS_SUCCESS;
    constructor(public payload: IArtistEntityList) { }
}

export class FetchArtistsFail implements Action {
    readonly type = FETCH_ARTISTS_FAIL;
    constructor(public payload: any) { }
}

export class SetSelectedArtistId implements Action {
    readonly type = SET_SELECTED_ARTIST_ID;
    constructor(public payload: string) { }
}

export class FetchGenresPerArtist implements Action {
    readonly type = FETCH_GENRES_PER_ARTIST;
    constructor() { }
}

export class FetchGenresPerArtistSuccess implements Action {
    readonly type = FETCH_GENRES_PER_ARTIST_SUCCESS;
    constructor(public payload: IGenresPerArtistEntityList) { }
}

export class SetSelectedArtistFollows implements Action {
    readonly type = SET_SELECTED_ARTIST_FOLLOWS;
    constructor(public payload: IFollowsPerArtistItem) { }
}

export class SetSelectedArtistStockholders implements Action {
    readonly type = SET_SELECTED_ARTIST_STOCKHOLDERS;
    constructor(public payload: IStockholdersPerArtistItem) { }
}

export class UserFollowArtist implements Action {
    readonly type = USER_FOLLOW_ARTIST;
    constructor(public payload: { artistKey: string, portfolioKey: string }) { }
}

export class UserUnfollowArtist implements Action {
    readonly type = USER_UNFOLLOW_ARTIST;
    constructor(public payload: { artistKey: string, portfolioKey: string }) { }
}

export class UserBuyArtist implements Action {
    readonly type = USER_BUY_ARTIST;
    constructor(public payload: { portfolio: INosPortfolio, artistKey: string, shareCount: number, price: number }) { }
}

export class UserSellArtist implements Action {
    readonly type = USER_SELL_ARTIST;
    constructor(public payload: { portfolio: INosPortfolio, artistKey: string, shareCount: number, price: number }) { }
}

export type ArtistsActions =
    FetchArtists |
    FetchArtistsSuccess |
    FetchArtistsFail |
    SetSelectedArtistId |
    FetchGenresPerArtist |
    FetchGenresPerArtistSuccess |
    SetSelectedArtistFollows |
    SetSelectedArtistStockholders |
    UserFollowArtist |
    UserUnfollowArtist |
    UserBuyArtist |
    UserSellArtist;
