import { IReferenceDictionary, ICountReferenceDictionary } from './firebase-objects.model';
import { IDbPortfolio } from './portfolio.model';

// Genre Per Artist
export interface IFriendsPerPortfolioMap {
    [portfolioKey: string]: IReferenceDictionary;
}

export interface INosFriend {
    status: boolean | 'pending';
    portfolio: IDbPortfolio;
    key: string;
}
