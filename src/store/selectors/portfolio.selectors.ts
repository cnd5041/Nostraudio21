import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromPortfolio from '../reducers/portfolio.reducers';

import * as fromArtistSelectors from './artists.selectors';

import {
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
        return portfolio
            && selectedArtistFollows
            && selectedArtistFollows.value
            && selectedArtistFollows.value[portfolio.userProfile];
    }
);

export const getNosPortfolioWithArtists = createSelector(
    getNosPortfolio,
    fromArtistSelectors.getArtistsMap,
    (portfolio, clientArtists): INosPortfolioWithArtists => {
        if (portfolio && clientArtists) {
            // TODO: make sure all client artists are loaded
            return NosPortfolioWithArtists(portfolio, portfolio.shares, portfolio.transactions, clientArtists);
        } else {
            return null;
        }
    }
);
