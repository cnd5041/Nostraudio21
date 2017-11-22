import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromArtists from './artists/artist.reducers';
// import * as fromReducer from './reducers';


export const reducers = {
    artists: fromArtists.reducer
    // books: fromBooks.reducer
};
