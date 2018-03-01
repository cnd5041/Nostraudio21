import * as fromArtists from '../actions/artists.actions';
import {
    IArtistEntityList, IGenresPerArtistEntityList, IFollowsPerArtistItem, IStockholdersPerArtistItem
} from '../../../models';

export interface ArtistState {
    artistEntities: IArtistEntityList;
    loading: boolean;
    loaded: boolean;
    selectedArtistId: string;
    genresPerArtistEntities: IGenresPerArtistEntityList;
    // These Reference Tables will be mapped per selectedArtistId
    selectedArtistFollows: IFollowsPerArtistItem;
    selectedArtistStockholders: IStockholdersPerArtistItem;
}
/*
    do /artists and each /*PerArtist so all relevant data is here.
*/

const initialState: ArtistState = {
    artistEntities: {},
    loading: false,
    loaded: false,
    selectedArtistId: null,
    genresPerArtistEntities: {},
    // followsPerArtistEntities: {},
    // stockholdersPerArtistEntities: {}
    selectedArtistFollows: null,
    selectedArtistStockholders: null
};

export function reducer(
    state = initialState,
    action: fromArtists.ArtistsActions
): ArtistState {
    switch (action.type) {
        case fromArtists.FETCH_ARTISTS: {
            return {
                ...state,
                loading: true
            };
        }

        case fromArtists.FETCH_ARTISTS_SUCCESS: {
            return {
                ...state,
                loading: false,
                loaded: true,
                artistEntities: action.payload,
            };
        }

        case fromArtists.FETCH_ARTISTS_FAIL: {
            return {
                ...state,
                loaded: false,
                loading: false
            };
        }

        case fromArtists.SET_SELECTED_ARTIST_ID: {
            return {
                ...state,
                selectedArtistId: action.payload
            };
        }

        case fromArtists.SET_SELECTED_ARTIST_FOLLOWS: {
            return {
                ...state,
                selectedArtistFollows: action.payload
            };
        }

        case fromArtists.SET_SELECTED_ARTIST_STOCKHOLDERS: {
            return {
                ...state,
                selectedArtistStockholders: action.payload
            };
        }

        case fromArtists.FETCH_GENRES_PER_ARTIST: {
            return {
                ...state
            };
        }

        case fromArtists.FETCH_GENRES_PER_ARTIST_SUCCESS: {
            return {
                ...state,
                genresPerArtistEntities: action.payload,
            };
        }

        default: {
            return state;
        }
    }
}

export const getArtists = (state: ArtistState) => state.artistEntities;
export const getSelectedArtistId = (state: ArtistState) => state.selectedArtistId;

export const getSelectedArtistFollows = (state: ArtistState) => state.selectedArtistFollows;
export const getSelectedArtistStockholders = (state: ArtistState) => state.selectedArtistStockholders;

export const getArtistsLoading = (state: ArtistState) => state.loading;
export const getArtistsLoaded = (state: ArtistState) => state.loaded;

export const getGenresPerArtistEntities = (state: ArtistState) => state.genresPerArtistEntities;
