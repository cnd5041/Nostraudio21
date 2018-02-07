import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromArtists from '../reducers/artists.reducers';

export const getArtistsState = createSelector(
    fromFeature.getMusicState,
    (state: fromFeature.MusicState) => state.artists
);

export const getArtistEntities = createSelector(
    getArtistsState,
    fromArtists.getArtists
);
