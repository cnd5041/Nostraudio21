import * as fromActions from '../actions/friends.actions';
import { IDbPortfolio } from '../../models';

export interface FriendsState {
    portfolioId: string;
    friendsMap: { [firebaseKey: string]: any };
    friendsList: IDbPortfolio[];
    query: string;
    searchResults: any[];
}

const initialState: FriendsState = {
    portfolioId: null,
    friendsMap: {},
    friendsList: [],
    query: null,
    searchResults: []
};

export function reducer(
    state = initialState,
    action: fromActions.FriendsActions
): FriendsState {
    switch (action.type) {
        case fromActions.FETCH_FRIENDS: {
            return {
                ...state,
                portfolioId: action.payload
            };
        }

        case fromActions.SET_FRIENDS_MAP: {
            return {
                ...state,
                friendsMap: action.payload
            };
        }

        case fromActions.SET_FRIENDS_LIST: {
            return {
                ...state,
                friendsList: action.payload
            };
        }

        case fromActions.SEARCH_FRIENDS: {
            return {
                ...state,
                query: action.payload
            };
        }

        case fromActions.SEARCH_FRIENDS_COMPLETE: {
            return {
                ...state,
                searchResults: action.payload
            };
        }

        default: {
            return state;
        }
    }
}

export const getFriendsMap = (state: FriendsState) => state.friendsMap;
export const getFriendsList = (state: FriendsState) => state.friendsList;
export const getFriendsSearchResults = (state: FriendsState) => state.searchResults;
