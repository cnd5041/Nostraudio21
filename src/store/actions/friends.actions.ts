import { Action } from '@ngrx/store';
import { IReferenceDictionary, IDbPortfolio, INosPortfolioWithArtists, INosPortfolio } from '../../models';

export const FETCH_FRIENDS = '[friends] FETCH_FRIENDS';
export const SET_FRIENDS_MAP = '[friends] SET_FRIENDS_MAP';
export const SET_FRIENDS_LIST = '[friends] SET_FRIENDS_LIST';

export const FETCH_FRIEND_PORTFOLIO = '[friends] FETCH_FRIEND_PORTFOLIO';
export const FETCH_FRIEND_PORTFOLIO_SUCCESS = '[friends] FETCH_FRIEND_PORTFOLIO_SUCCESS';

export const SEARCH_FRIENDS = '[friends] SEARCH_FRIENDS';
export const SEARCH_FRIENDS_COMPLETE = '[friends] SEARCH_FRIENDS_COMPLETE';

export const ADD_FRIEND = '[friends] ADD_FRIEND';
export const REMOVE_FRIEND = '[friends] REMOVE_FRIEND';

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

export class FetchFriendPortfolio implements Action {
    readonly type = FETCH_FRIEND_PORTFOLIO;
    constructor(public payload: string) { }
}

export class FetchFriendPortolioSuccess implements Action {
    readonly type = FETCH_FRIEND_PORTFOLIO_SUCCESS;
    constructor(public payload: INosPortfolio) { }
}

export class SearchFriends implements Action {
    readonly type = SEARCH_FRIENDS;
    constructor(public payload: string) { }
}

export class SearchFriendsComplete implements Action {
    readonly type = SEARCH_FRIENDS_COMPLETE;
    constructor(public payload: any[]) { }
}

export class AddFriend implements Action {
    readonly type = ADD_FRIEND;
    constructor(public payload: string) { }
}

export class RemoveFriend implements Action {
    readonly type = REMOVE_FRIEND;
    constructor(public payload: string) { }
}

export type FriendsActions =
    FetchFriends |
    SetFriendsMap |
    SetFriendsList |
    FetchFriendPortfolio |
    FetchFriendPortolioSuccess |
    SearchFriends |
    SearchFriendsComplete |
    AddFriend |
    RemoveFriend;
