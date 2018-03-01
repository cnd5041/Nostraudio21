import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromGenres from '../reducers/genres.reducers';

import * as fromModels from '../../../models';

import * as _ from 'lodash';

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

        _.forOwn(genreEntities, (entity: fromModels.IGenreEntity, key: string) => {
            map[key] = _.startCase(entity.value.name);
        });

        return map;
    }
);
