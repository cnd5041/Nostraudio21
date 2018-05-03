import { Action } from '@ngrx/store';

import {
    IFollowsPerArtistItem, INosPortfolio, INosArtist, IDbArtistMap, IDbArtist, INosArtistMap
} from '../../models';

export const SET_ARTISTS_MAP = '[music] Set Artists Map';
export const ARTISTS_MAP_ADD = '[music] ARTISTS_MAP_ADD';

export const SET_SELECTED_ARTIST_ID = '[music] Set Selected Artist Id';

export const SET_SELECTED_ARTIST_FOLLOWS = '[music] Fetch SET_SELECTED_ARTIST_FOLLOWS';

export const USER_FOLLOW_ARTIST = '[music] USER_FOLLOW_ARTIST';
export const USER_UNFOLLOW_ARTIST = '[music] USER_UNFOLLOW_ARTIST';

export const USER_BUY_ARTIST = '[music] USER_BUY_ARTIST';
export const USER_SELL_ARTIST = '[music] USER_SELL_ARTIST';

export const SEARCH_ARTIST = '[music] SEARCH_ARTIST';

export class SetArtistsMap implements Action {
    readonly type = SET_ARTISTS_MAP;
    constructor(public payload: INosArtistMap) { }
}

export class ArtistMapAdd implements Action {
    readonly type = ARTISTS_MAP_ADD;
    constructor(public payload: { key: string, artist: INosArtist }) { }
}

export class SetSelectedArtistId implements Action {
    readonly type = SET_SELECTED_ARTIST_ID;
    constructor(public payload: string) { }
}

export class SetSelectedArtistFollows implements Action {
    readonly type = SET_SELECTED_ARTIST_FOLLOWS;
    constructor(public payload: IFollowsPerArtistItem) { }
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

export class SearchArtist implements Action {
    readonly type = SEARCH_ARTIST;
    constructor(public payload: string) { }
}

export type ArtistsActions =
    SetArtistsMap |
    ArtistMapAdd |
    SetSelectedArtistId |
    SetSelectedArtistFollows |
    UserFollowArtist |
    UserUnfollowArtist |
    UserBuyArtist |
    UserSellArtist |
    SearchArtist;
