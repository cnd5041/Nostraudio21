import * as fromGenres from '../actions/genres.actions';
import { IGenreEntityList } from '../../../models';

export interface GenreState {
    genreEntities: IGenreEntityList;
}
/*
    do /genres and each /*PerGenre so all relevant data is here.
*/

const initialState: GenreState = {
    genreEntities: {}
};

export function reducer(
    state = initialState,
    action: fromGenres.GenresActions
): GenreState {
    switch (action.type) {
        case fromGenres.FETCH_GENRES: {
            return {
                ...state
            };
        }

        case fromGenres.FETCH_GENRES_SUCCESS: {
            return {
                ...state,
                genreEntities: action.payload,
            };
        }

        case fromGenres.FETCH_GENRES_FAIL: {
            return {
                ...state
            };
        }

        default: {
            return state;
        }
    }
}

export const getGenreEntities = (state: GenreState) => state.genreEntities;
