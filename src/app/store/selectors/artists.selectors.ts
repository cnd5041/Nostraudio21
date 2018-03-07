import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromArtists from '../reducers/artists.reducers';

import * as fromGenresSelector from './genres.selectors';

import * as fromModels from '../../../models';

import lodash from 'lodash';

export const getArtistsState = createSelector(
    fromFeature.getMusicState,
    (state: fromFeature.MusicState) => state.artists
);

// Basic Slice Selectors
export const getArtistEntities = createSelector(
    getArtistsState,
    fromArtists.getArtists
);

export const getSelectedArtistId = createSelector(
    getArtistsState,
    fromArtists.getSelectedArtistId
);

export const getArtistsLoading = createSelector(
    getArtistsState,
    fromArtists.getArtistsLoading
);

export const getArtistsLoaded = createSelector(
    getArtistsState,
    fromArtists.getArtistsLoaded
);

export const getGenresPerArtistEntities = createSelector(
    getArtistsState,
    fromArtists.getGenresPerArtistEntities
);

export const getSelectedArtistFollows = createSelector(
    getArtistsState,
    fromArtists.getSelectedArtistFollows
);

export const getSelectedArtistStockholders = createSelector(
    getArtistsState,
    fromArtists.getSelectedArtistStockholders
);

export const getLoadingClientArtistIds = createSelector(
    getArtistsState,
    fromArtists.getLoadingClientArtistIds
);

export const getLoadedClientArtistIds = createSelector(
    getArtistsState,
    fromArtists.getLoadedClientArtistIds
);

export const getClientArtists = createSelector(
    getArtistsState,
    fromArtists.getClientArtists
);


// Combined Selectors

// Return an artist key with an array of genres as the value
export const getGenreListPerArtistEntity = createSelector(
    getGenresPerArtistEntities,
    fromGenresSelector.getGenreKeyNameMap,
    (genresPerArtistEntities, genreEntities): { [artistKey: string]: string[] } => {
        const genresPerArtistWithGenreList = {};
        // Loop the artist keys
        lodash.forOwn(genresPerArtistEntities, (entity: fromModels.IGenresPerArtistEntity, artistKey: string) => {
            genresPerArtistWithGenreList[artistKey] = [];
            // Loop the genre keys
            // TODO: try _.values
            lodash.forOwn(entity.value, (value, genreKey: string) => {
                // push the string value of the genre
                genresPerArtistWithGenreList[artistKey].push(genreEntities[genreKey]);
            });
        });
        return genresPerArtistWithGenreList;
    }
);

export const getSelectedNosArtist = createSelector(
    getSelectedArtistId,
    getClientArtists,
    (id, entities): fromModels.INosArtist => {
        return entities[id];
    }
);

// Return array of genres per artist
export const getSelectedArtistGenres = createSelector(
    getSelectedArtistId,
    getGenreListPerArtistEntity,
    (id, entities) => {
        return entities[id];
    }
);


// TODO: refactor the be off of getSelectedNosArtist
// the follows would have to be a part of the Artist sub
export const getSelectedFollowersCount = createSelector(
    getSelectedArtistFollows,
    (selectedArtistFollows): number => {
        if (selectedArtistFollows) {
            const followValues: boolean[] = lodash.values(selectedArtistFollows.value);
            const trueFollowValues: boolean[] = followValues.filter(val => val === true);
            return trueFollowValues.length;
        } else {
            return null;
        }
    }
);
