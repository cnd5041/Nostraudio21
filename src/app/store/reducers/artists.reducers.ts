import * as fromArtists from '../actions/artists.actions';
import {
    IArtistEntityList, IGenresPerArtistEntityList, IFollowsPerArtistItem, IStockholdersPerArtistItem, INosArtist
} from '../../../models';

import lodash from 'lodash';

export interface ArtistState {
    artistEntities: IArtistEntityList;
    loading: boolean;
    loaded: boolean;
    selectedArtistId: string;
    genresPerArtistEntities: IGenresPerArtistEntityList;
    // These Reference Tables will be mapped per selectedArtistId
    selectedArtistFollows: IFollowsPerArtistItem;
    selectedArtistStockholders: IStockholdersPerArtistItem;
    // doing stockHoldersPerArtist
    // might be too much data at once.
    /// have an array of viewed artists.
    /// push each time something is viewed
    /// will have to basically create observables for each one
    /// in that array of artist ids....
    /// for each of those, if the price is different, update it
    loadingClientArtistIds: string[];
    loadedClientArtistIds: string[];
    activeArtistSubscriptions: { [key: string]: boolean };
    clientArtists: { [spotifyId: string]: INosArtist };
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
    selectedArtistFollows: null,
    selectedArtistStockholders: null,
    loadingClientArtistIds: [],
    loadedClientArtistIds: [],
    activeArtistSubscriptions: {},
    clientArtists: {}
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

        case fromArtists.START_ARTIST_SUBSCRIPTION: {
            // Add to array if it's not already loaded
            const isLoaded = state.loadedClientArtistIds.indexOf(action.payload);
            let ids = state.loadingClientArtistIds;
            if (isLoaded < 0) {
                ids = lodash.uniq(ids.concat([action.payload]));
            }
            const subs = {
                ...state.activeArtistSubscriptions,
                [action.payload]: true
            };

            return {
                ...state,
                loadingClientArtistIds: ids,
                activeArtistSubscriptions: subs
            };
        }

        case fromArtists.STOP_ARTIST_SUBSCRIPTION: {
            const subs = {
                ...state.activeArtistSubscriptions,
                [action.payload]: false
            };

            return {
                ...state,
                activeArtistSubscriptions: subs
            };
        }

        case fromArtists.SET_CLIENT_ARTIST: {
            const nosArtist = action.payload;
            const clientArtists = lodash.cloneDeep(state.clientArtists);
            clientArtists[nosArtist.spotifyId] = nosArtist;
            // remove the successful id from the loading
            const loadingIds = lodash.without(state.loadingClientArtistIds, nosArtist.spotifyId);
            // add successfull id to loaded
            const loadedIds = state.loadedClientArtistIds.concat([nosArtist.spotifyId]);
            return {
                ...state,
                clientArtists: clientArtists,
                loadingClientArtistIds: loadingIds,
                loadedClientArtistIds: loadedIds
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

export const getLoadingClientArtistIds = (state: ArtistState) => state.loadingClientArtistIds;
export const getLoadedClientArtistIds = (state: ArtistState) => state.loadedClientArtistIds;
export const getClientArtists = (state: ArtistState) => state.clientArtists;
