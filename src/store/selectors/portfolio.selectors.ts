import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromPortfolio from '../reducers/portfolio.reducers';

import * as fromArtistSelectors from './artists.selectors';

import { isEmpty } from 'lodash';

import {
    IPortfolioShareWithArtist,
    NosPortfolioWithArtists,
    INosPortfolioWithArtists
} from '../../models/portfolio.model';

import {
    INosArtist
} from '../../models/artist.model';

import {
    ITransactionWithArtist,
} from '../../models/transaction.model';

import {
    getArtistsByKeys,
} from '../../models/helpers.model';

export const getPortfolioState = createSelector(
    fromFeature.getMusicState,
    (state: fromFeature.MusicState) => state.portfolio
);

export const getPortfolioLoading = createSelector(
    getPortfolioState,
    fromPortfolio.getPortfolioLoading
);

export const getPortfolioLoaded = createSelector(
    getPortfolioState,
    fromPortfolio.getPortfolioLoaded
);

export const getUserId = createSelector(
    getPortfolioState,
    fromPortfolio.getUserId
);

export const getNosPortfolio = createSelector(
    getPortfolioState,
    fromPortfolio.getNosPortfolio
);

// Combined Selectors
export const isFollowingCurrentArtist = createSelector(
    getNosPortfolio,
    fromArtistSelectors.getSelectedArtistFollows,
    (portfolio, selectedArtistFollows): boolean => {
        return portfolio && selectedArtistFollows && selectedArtistFollows.value && selectedArtistFollows.value[portfolio.userProfile];
    }
);

export const getFollowingNosArtists = createSelector(
    getNosPortfolio,
    fromArtistSelectors.getArtistsMap,
    (portfolio, clientArtists): INosArtist[] => {
        if (portfolio && portfolio.artistFollows) {
            return getArtistsByKeys(clientArtists, portfolio.artistFollows);
        } else {
            return [];
        }
    }
);

export const getTransactionsWithArtists = createSelector(
    getNosPortfolio,
    fromArtistSelectors.getArtistsMap,
    (portfolio, clientArtists): ITransactionWithArtist[] => {
        if (portfolio && portfolio.transactions) {
            // add artist to the transaction
            return portfolio.transactions
                .map((transaction) => {
                    return {
                        ...transaction,
                        artist: clientArtists[transaction.artistKey]
                    };
                })
                .filter(trans => trans.artist);
        } else {
            return [];
        }
    }
);

export const getSharesWithArtists = createSelector(
    getNosPortfolio,
    fromArtistSelectors.getArtistsMap,
    (portfolio, clientArtists): IPortfolioShareWithArtist[] => {
        if (portfolio && portfolio.shares && !isEmpty(clientArtists)) {
            return portfolio.shares
                .map((share) => {
                    const artist = clientArtists[share.artistKey];
                    const sharesValue = artist ? share.sharesCount + artist.marketPrice : 0;
                    return {
                        ...share,
                        artist: clientArtists[share.artistKey],
                        sharesValue: sharesValue
                    };
                })
                .filter(share => share.artist);
        } else {
            return [];
        }
    }
);

export const getNosPortfolioWithArtists = createSelector(
    getNosPortfolio,
    getSharesWithArtists,
    getFollowingNosArtists,
    getTransactionsWithArtists,
    (portfolio, shares, following, transactions): INosPortfolioWithArtists => {
        if (portfolio) {
            return NosPortfolioWithArtists(portfolio, shares, following, transactions);
        } else {
            return null;
        }
    }
);
