import * as fromArtists from '../actions/artists.actions';
import {
    IFollowsPerArtistItem, IStockholdersPerArtistItem, INosArtist, IDbArtistMap, INosArtistMap
} from '../../../models';

import { cloneDeep } from 'lodash';

export interface ArtistState {
    artistsMap: INosArtistMap;

    selectedArtistId: string;
    // These Reference Tables will be mapped per selectedArtistId
    selectedArtistFollows: IFollowsPerArtistItem;
}
/*
    do /artists and each /*PerArtist so all relevant data is here.
*/

const initialState: ArtistState = {
    artistsMap: {},
    selectedArtistId: null,
    selectedArtistFollows: null
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
            // console.log('woot woot', newMap);
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

        default: {
            return state;
        }
    }
}

export const getArtistsMap = (state: ArtistState) => state.artistsMap;
export const getSelectedArtistId = (state: ArtistState) => state.selectedArtistId;

export const getSelectedArtistFollows = (state: ArtistState) => state.selectedArtistFollows;
