import * as GenreActions from './actions';
import { IGenre, IDbArtist, IDictionary } from '../../models';

import { ActionReducerMap } from '@ngrx/store';

export const reducers: ActionReducerMap<State> = {
  app: appReducer
};

export type State = { app: AppState };

// Define initial state
export type AppState = {
    genres: IGenre[],
    artistGenres: IGenre[],
    artistDetail: IDbArtist
};
export const initialState: State = {
    app: {
        genres: [],
        artistGenres: [],
        artistDetail: null
    }
}

/**
 * they have a collection state, so i'd have a collection state of artists
 * and genres, etc. then they have specific books state which is just
 * the selected one, then they use selectors to combine the state of the
 * selected book id with the actual book info from the collection
 *
 *** nix the above, I misunderstood the collection reducer and what it is used for
 ..see what it's used for (collection is just the users personal colllection, so it's
    just a reference of ids)
 ...because the book reducer contains the books list and objectss
 through the entitiy mapping

    I could have an artist reducer, a genre reducer, a ** reducer
    and then use selectors to combine the state? maybe one for search on artist

    Artist Collection State:
        TODO: Figure out @ngrx/entity and how to use them with my collections
            see if I'd want to use them and if it's a good fit with firebase
            seems like it might be? since firebase is usually a collection, keyed by ids
 */

// reducer
export function appReducer(state: AppState, action: GenreActions.Actions): AppState {
    switch (action.type) {
        case GenreActions.FETCH_GENRES: {
            // console.log('NGRX: reducer: FETCH_GENRES', state);
            return { ...state };
        }
        case GenreActions.FETCH_GENRES_SUCCESS: {
            // console.log('NGRX: reducer: FETCH_GENRES_SUCCESS', action.payload);
            return { ...state, genres: action.payload };
        }
        case GenreActions.FETCH_ARTIST_GENRES: {
            console.log('NGRX: reducer: FETCH_ARTIST_GENRES', state);
            return { ...state };
        }
        case GenreActions.FETCH_ARTIST_GENRES_SUCCESS: {
            console.log('NGRX: reducer: FETCH_ARTIST_GENRES_SUCCESS', action.payload);
            return { ...state, artistGenres: action.payload };
        }
        case GenreActions.FETCH_ARTIST_DETAIL: {
            console.log('NGRX: reducer: FETCH_ARTIST_DETAIL', state);
            return { ...state };
        }
        case GenreActions.FETCH_ARTIST_DETAIL_SUCCESS: {
            console.log('NGRX: reducer: FETCH_ARTIST_DETAIL_SUCCESS', action.payload);
            return { ...state, artistDetail: action.payload };
        }
        default: {
            console.log('NGRX: reducer: default', state);
            return state;
        }
    }
}


