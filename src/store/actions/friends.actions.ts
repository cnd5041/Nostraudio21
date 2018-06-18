import { Action } from '@ngrx/store';
import { IReferenceDictionary, IDbPortfolio } from '../../models';

export const FETCH_FRIENDS = '[friends] FETCH_FRIENDS';

export const SET_FRIENDS_MAP = '[friends] SET_FRIENDS_MAP';

export const SET_FRIENDS_LIST = '[friends] SET_FRIENDS_LIST';

export const SEARCH_FRIENDS = '[friends] SEARCH_FRIENDS';
export const SEARCH_FRIENDS_COMPLETE = '[friends] SEARCH_FRIENDS_COMPLETE';

export class FetchFriends implements Action {
    readonly type = FETCH_FRIENDS;
    constructor(public payload: string) { }
}

export class SetFriendsMap implements Action {
    readonly type = SET_FRIENDS_MAP;
    constructor(public payload: IReferenceDictionary) { }
}

export class SetFriendsList implements Action {
    readonly type = SET_FRIENDS_LIST;
    constructor(public payload: IDbPortfolio[]) { }
}

export class SearchFriends implements Action {
    readonly type = SEARCH_FRIENDS;
    constructor(public payload: string) { }
}

export class SearchFriendsComplete implements Action {
    readonly type = SEARCH_FRIENDS_COMPLETE;
    constructor(public payload: any[]) { }
}

export type FriendsActions =
    FetchFriends |
    SetFriendsMap |
    SetFriendsList |
    SearchFriends |
    SearchFriendsComplete;
