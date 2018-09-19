import * as fromArtists from '../actions/artists.actions';
import {
    IFollowsPerArtistItem, IStockholdersPerArtistItem, INosArtist, IDbArtistMap, INosArtistMap
} from '../../models';

export interface ArtistState {
    artistsMap: INosArtistMap;
    selectedArtistId: string;
    // Follows is currenlty seperate, because it might change a lot
    selectedArtistFollows: IFollowsPerArtistItem;

    query: string;
    searchResults: INosArtist[];
}

const initialState: ArtistState = {
    artistsMap: {},
    selectedArtistId: null,
    selectedArtistFollows: null,
    query: null,
    searchResults: []
};

export function reducer(
    state = initialState,
    action: fromArtists.ArtistsActions
): ArtistState {
    switch (action.type) {
        case fromArtists.SET_ARTISTS_MAP: {
            return {
                ...state,
                artistsMap: action.payload
            };
        }

        case fromArtists.ARTISTS_MAP_ADD: {
            const newMap = {
                ...state.artistsMap,
                [action.payload.key]: action.payload.artist
            };
            return {
                ...state,
                artistsMap: newMap
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

        case fromArtists.SEARCH_ARTISTS: {
            return {
                ...state,
                query: action.payload
            };
        }

        case fromArtists.SEARCH_ARTISTS_COMPLETE: {
            return {
                ...state,
                searchResults: action.payload
            };
        }

        default: {
            return state;
        }
    }
}

export const getArtistsMap = (state: ArtistState) => state.artistsMap;
export const getSelectedArtistId = (state: ArtistState) => state.selectedArtistId;
export const getSelectedArtistFollows = (state: ArtistState) => state.selectedArtistFollows;

export const getSearchArtistQuery = (state: ArtistState) => state.query;
export const getArtistSearchResults = (state: ArtistState) => state.searchResults;
