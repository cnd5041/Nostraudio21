import * as fromGenres from '../actions/genres.actions';
import { IDbGenreMap, IArtistsPerGenreMap } from '../../models';

export interface GenreState {
    genresMap: IDbGenreMap;
    genresFilter: string[];
    artistsPerGenreMap: IArtistsPerGenreMap;
}

const initialState: GenreState = {
    genresMap: {},
    genresFilter: [],
    artistsPerGenreMap: null
};

export function reducer(
    state = initialState,
    action: fromGenres.GenresActions
): GenreState {
    switch (action.type) {
        case fromGenres.SET_GENRES_MAP: {
            return {
                ...state,
                genresMap: action.payload
            };
        }

        case fromGenres.SET_GENRES_FILTER: {
            return {
                ...state,
                genresFilter: action.payload
            };
        }

        case fromGenres.SET_ARTISTS_PER_GENRE_MAP: {
            return {
                ...state,
                artistsPerGenreMap: action.payload
            };
        }

        default: {
            return state;
        }
    }
}

export const getGenresMap = (state: GenreState) => state.genresMap;
export const getGenresFilter = (state: GenreState) => state.genresFilter;
export const getArtistsPerGenreMap = (state: GenreState) => state.artistsPerGenreMap;
