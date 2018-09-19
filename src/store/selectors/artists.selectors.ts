import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromArtists from '../reducers/artists.reducers';
import { INosArtist } from '../../models';

import { values, orderBy, keyBy } from 'lodash';


export const getArtistsState = createSelector(
    fromFeature.getMusicState,
    (state: fromFeature.MusicState) => state.artists
);

// Basic Slice Selectors
export const getArtistsMap = createSelector(
    getArtistsState,
    fromArtists.getArtistsMap
);

export const getSelectedArtistId = createSelector(
    getArtistsState,
    fromArtists.getSelectedArtistId
);

export const getSelectedArtistFollows = createSelector(
    getArtistsState,
    fromArtists.getSelectedArtistFollows
);

export const getSearchArtistQuery = createSelector(
    getArtistsState,
    fromArtists.getSearchArtistQuery
);

export const getArtistSearchResults = createSelector(
    getArtistsState,
    fromArtists.getArtistSearchResults
);

// Combined Selectors
export const getArtistsArray = createSelector(
    getArtistsMap,
    (artistMap): INosArtist[] => {
        if (artistMap) {
            const artists = values(artistMap);
            // if (artists && artists.length > 0) { // for testing
            //     for (let index = 1; index < 20; index++) {
            //         const artistCopy = cloneDeep(artists[0]);

            //         artistCopy.name = artistCopy.name + index;
            //         artistCopy.spotifyId = artistCopy.spotifyId + index;

            //         artistCopy.marketCap += index;
            //         artistCopy.marketPrice += index;

            //         artists.push(artistCopy);
            //     }
            // }
            return artists;
        } else {
            return [];
        }
    }
);

export const getArtistsRankMap = createSelector(
    getArtistsArray,
    (artists): { [spotifyId: string]: { id: string, marketCapRank: number, marketPriceRank: number } } => {
        const priceRank = orderBy(artists, ['marketPrice'], ['desc']);
        const marketCapRank = orderBy(artists, ['marketCap'], ['desc']);
        const ranks = artists.map(artist => {
            return {
                spotifyId: artist.spotifyId,
                marketPriceRank: priceRank.indexOf(artist) + 1,
                marketCapRank: marketCapRank.indexOf(artist) + 1
            };
        });
        return keyBy(ranks, 'spotifyId');
    }
);

export const getSelectedNosArtist = createSelector(
    getSelectedArtistId,
    getArtistsMap,
    (id, entities): INosArtist => {
        return entities[id];
    }
);

// TODO: refactor the be off of getSelectedNosArtist
// the follows would have to be a part of the Artist sub
export const getSelectedFollowersCount = createSelector(
    getSelectedArtistFollows,
    (selectedArtistFollows): number => {
        if (selectedArtistFollows) {
            const followValues: boolean[] = values(selectedArtistFollows.value);
            const trueFollowValues: boolean[] = followValues.filter(val => val === true);
            return trueFollowValues.length;
        } else {
            return null;
        }
    }
);

// export const getSearchArtistResults = createSelector(
//     getSearchArtistQuery,
//     getArtistsArray,
//     (query, artistArray) => {
//         return [];
//     }
// );
