import * as fromActions from '../actions/portfolio.actions';
import {
    IDbPortfolio, INosPortfolio
} from '../../../models';

export interface PortfolioState {
    loading: boolean;
    loaded: boolean;
    // genresPerArtistEntities: IGenresPerArtistEntityList;
    userId: string;
    nosPortfolio: INosPortfolio;
}

const initialState: PortfolioState = {
    loading: false,
    loaded: false,
    userId: null,
    nosPortfolio: null
};

export function reducer(
    state = initialState,
    action: fromActions.PortfolioActions
): PortfolioState {
    switch (action.type) {
        case fromActions.FETCH_PORTFOLIO: {
            return {
                ...state,
                loading: true,
                userId: action.payload
            };
        }

        case fromActions.FETCH_PORTFOLIO_SUCCESS: {
            return {
                ...state,
                loading: false,
                loaded: true,
                nosPortfolio: action.payload
            };
        }

        case fromActions.FETCH_PORTFOLIO_FAIL: {
            return {
                ...state,
                loaded: false,
                loading: false
            };
        }

        case fromActions.RESET_PORTFOLIO: {
            return {
                ...state,
                nosPortfolio: null,
                userId: null
            };
        }

        default: {
            return state;
        }
    }
}

export const getPortfolioLoading = (state: PortfolioState) => state.loading;
export const getPortfolioLoaded = (state: PortfolioState) => state.loaded;
export const getUserId = (state: PortfolioState) => state.userId;
export const getNosPortfolio = (state: PortfolioState) => state.nosPortfolio;
