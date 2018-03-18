import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromGenres from '../reducers/genres.reducers';

import { IDbGenre } from '../../../models';

import { forOwn, startCase } from 'lodash';

export const getGenresState = createSelector(
    fromFeature.getMusicState,
    (state: fromFeature.MusicState) => state.genres
);

// Basic Slice Selectors
export const getGenreEntities = createSelector(
    getGenresState,
    fromGenres.getGenreEntities
);

// Combined Selectors

// Read-only
export const getGenreKeyNameMap = createSelector(
    getGenreEntities,
    (genreEntities): { [firebaseKey: string]: string } => {
        const map = {};

        forOwn(genreEntities, (entity: IDbGenre, key: string) => {
            map[key] = startCase(entity.name);
        });

        return map;
    }
);
