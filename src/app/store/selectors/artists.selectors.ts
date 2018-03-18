import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromArtists from '../reducers/artists.reducers';

import * as fromGenresSelector from './genres.selectors';

import * as fromModels from '../../../models';

import { forOwn, values } from 'lodash';


export const getArtistsState = createSelector(
    fromFeature.getMusicState,
    (state: fromFeature.MusicState) => state.artists
);

// Basic Slice Selectors
export const getArtistsMap = createSelector(
    getArtistsState,
    fromArtists.getArtistsMap
);

export const getSelectedArtistId = createSelector(
    getArtistsState,
    fromArtists.getSelectedArtistId
);

export const getSelectedArtistFollows = createSelector(
    getArtistsState,
    fromArtists.getSelectedArtistFollows
);

// Combined Selectors
export const getSelectedNosArtist = createSelector(
    getSelectedArtistId,
    getArtistsMap,
    (id, entities): fromModels.INosArtist => {
        return entities[id];
    }
);

// TODO: refactor the be off of getSelectedNosArtist
// the follows would have to be a part of the Artist sub
export const getSelectedFollowersCount = createSelector(
    getSelectedArtistFollows,
    (selectedArtistFollows): number => {
        if (selectedArtistFollows) {
            const followValues: boolean[] = values(selectedArtistFollows.value);
            const trueFollowValues: boolean[] = followValues.filter(val => val === true);
            return trueFollowValues.length;
        } else {
            return null;
        }
    }
);
