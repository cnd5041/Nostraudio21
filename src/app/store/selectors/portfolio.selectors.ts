import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromPortfolio from '../reducers/portfolio.reducers';

import * as fromArtistSelectors from './artists.selectors';

import * as fromModels from '../../../models';

import lodash from 'lodash';

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
