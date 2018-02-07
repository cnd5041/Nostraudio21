import * as fromArtists from '../actions/artists.actions';
import { IGenre, IDbArtist, IDictionary } from '../../../models';

export interface ArtistState {
    // artists: IDbArtist[]
    // artists: any[]
    artists: { [id: number]: IDbArtist };
    loading: boolean;
    loaded: boolean;
}
/*
    do /artists and each /*PerArtist so all relevant data is here.
    consider mapping artists as entities
*/

const initialState: ArtistState = {
    artists: {},
    loading: false,
    loaded: false
};

export function convertArrayToEntities(artists: any[], existing: any) {
    const entities = artists.reduce((entities: { [id: number]: any }, artist: any) => {
        return {
            ...entities,
            [artist.spotifyId]: artist
        };
    },
        { ...existing }
    );
    return entities;
}

export function reducer(
    state = initialState,
    action: fromArtists.Actions
): ArtistState {
    switch (action.type) {
        case fromArtists.FETCH_ARTISTS: {
            return {
                ...state,
                loading: true
            };
        }
        case fromArtists.FETCH_ARTISTS_SUCCESS: {

            // Have see how to get either the spotifyId
            // or the $key in here. Make sure I have the right thing
            // to Key off of
            const artistEntities = convertArrayToEntities(action.payload, state.artists);

            return {
                ...state,
                loading: false,
                loaded: true,
                artists: artistEntities,
            };
        }
        default: {
            return state;
        }
    }
}

export const getArtists = (state: ArtistState) => state.artists;
