import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromPortfolio from '../reducers/portfolio.reducers';

import * as fromArtistSelectors from './artists.selectors';

import lodash from 'lodash';
import { INosArtist } from '../../../models';

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
        return portfolio && selectedArtistFollows && selectedArtistFollows.value[portfolio.userProfile];
    }
);

export const getPortfolioStockNosArtists = createSelector(
    getNosPortfolio,
    fromArtistSelectors.getClientArtists,
    (portfolio, clientArtists): INosArtist[] => {
        const result = [];
        if (portfolio && portfolio.shares) {
            const artistKeys = portfolio.shares;
            Object.keys(portfolio.shares).forEach((key) => {
                if (clientArtists[key]) {
                    result.push(clientArtists[key]);
                }
            });
        }
        return result;
    }
);

export const getPortfolioFollowingNosArtists = createSelector(
    getNosPortfolio,
    fromArtistSelectors.getClientArtists,
    (portfolio, clientArtists): INosArtist[] => {
        const result = [];
        if (portfolio && portfolio.artistFollows) {
            const artistKeys = portfolio.artistFollows;
            Object.keys(portfolio.artistFollows).forEach((key) => {
                if (clientArtists[key]) {
                    result.push(clientArtists[key]);
                }
            });
        }
        return result;
    }
);
