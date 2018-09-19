import * as fromActions from '../actions/friends.actions';
import { IDbPortfolio, INosPortfolio } from '../../models';

export interface FriendsState {
    portfolioId: string;
    friendsMap: { [firebaseKey: string]: boolean };
    friendsList: IDbPortfolio[];
    query: string;
    searchResults: { displayName: string, userProfile: string }[];
    selectedFriend: INosPortfolio;
}

const initialState: FriendsState = {
    portfolioId: null,
    friendsMap: {},
    friendsList: [],
    query: null,
    searchResults: [],
    selectedFriend: null
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

        case fromActions.FETCH_FRIEND_PORTFOLIO: {
            return {
                ...state
            };
        }

        case fromActions.FETCH_FRIEND_PORTFOLIO_SUCCESS: {
            return {
                ...state,
                selectedFriend: action.payload
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
export const getSelectedFriend = (state: FriendsState) => state.selectedFriend;
