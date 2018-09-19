import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromGenres from '../reducers/genres.reducers';

import { IDbGenre } from '../../models';

import { forOwn, startCase, values, keys, uniq } from 'lodash';

export const getGenresState = createSelector(
    fromFeature.getMusicState,
    (state: fromFeature.MusicState) => state.genres
);

// Basic Slice Selectors
export const getGenresMap = createSelector(
    getGenresState,
    fromGenres.getGenresMap
);

export const getGenresFilter = createSelector(
    getGenresState,
    fromGenres.getGenresFilter
);

export const getArtistsPerGenreMap = createSelector(
    getGenresState,
    fromGenres.getArtistsPerGenreMap
);

// Combined Selectors
export const getGenreFilteredArtists = createSelector(
    getGenresFilter,
    getArtistsPerGenreMap,
    (genresFilter, artistsPerGenre) => {
        if (genresFilter.length > 0 && artistsPerGenre) {
            let results = [];
            genresFilter.forEach((key) => {
                results = [
                    ...results,
                    ...keys(artistsPerGenre[key])
                ];
            });
            return uniq(results);
        } else {
            return null;
        }
    }
);

// Read-only
export const getGenresArray = createSelector(
    getGenresMap,
    (genreMap): IDbGenre[] => {
        if (genreMap) {
            // return values(genreMap);
            const result = [];
            forOwn(genreMap, function (value, key) {
                result.push({
                    ...value,
                    name: startCase(value.name),
                    firebaseKey: key
                });
            });
            return result;
        } else {
            return [];
        }
    }
);
