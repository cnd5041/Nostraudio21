import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromFriends from '../reducers/friends.reducers';

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

export const getFriendsSearchResults = createSelector(
    getFriendsState,
    fromFriends.getFriendsSearchResults
);

export const getSelectedFriend = createSelector(
    getFriendsState,
    fromFriends.getSelectedFriend
);

export const getFriendsSearchResultsWithFollow = createSelector(
    getFriendsSearchResults,
    getFriendsList,
    (results, friendsList) => {
        return results.map(r => {
            return {
                ...r,
                following: friendsList.some(f => f.userProfile === r.userProfile)
            };
        });
    }
);
