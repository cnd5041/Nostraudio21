import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromFriends from '../reducers/friends.reducers';
import { getArtistsMap } from '../selectors/artists.selectors';
import { INosPortfolioWithArtists, NosPortfolioWithArtists } from '../../models';

export const getFriendsState = createSelector(
    fromFeature.getMusicState,
    (state: fromFeature.MusicState) => state.friends
);

// Basic Slice Selectors
export const getFriendsMap = createSelector(
    getFriendsState,
    fromFriends.getFriendsMap
);

export const getFriendsList = createSelector(
    getFriendsState,
    fromFriends.getFriendsList
);

export const getFriendsSearchResults1 = createSelector(
    getFriendsState,
    fromFriends.getFriendsSearchResults
);

export const getSelectedFriend = createSelector(
    getFriendsState,
    fromFriends.getSelectedFriend
);

// Combined State
export const getFriendsSearchResults = createSelector(
    getFriendsState,
    fromFriends.getFriendsSearchResults
);

export const getFriendNosPortfolioWithArtists = createSelector(
    getSelectedFriend,
    getArtistsMap,
    (portfolio, clientArtists): INosPortfolioWithArtists => {
        if (portfolio && clientArtists) {
            return NosPortfolioWithArtists(portfolio, portfolio.shares, portfolio.transactions, clientArtists);
        } else {
            return null;
        }
    }
);

export const getFriendsSearchResultsWithFollow = createSelector(
    getFriendsSearchResults,
    getFriendsList,
    (results, friendsList) => {
        // Return a friends list - including if they are currently following them or not
        return results.map(r => {
            return {
                ...r,
                following: friendsList.some(f => f.userProfile === r.userProfile)
            };
        });
    }
);
