import { IDbTransaction } from './transaction.model';
import { IDbArtist } from './artist.model';

export interface IDbPortfolio {
    balance: number;
    displayName: string;
    hitCount: number;
    imageUrl?: string;
    userProfile: string;
    userProfileLink: string;
}

export interface ISharesPerPortfolioItem {
    [spotifyId: string]: number;
}

export interface IPortfolioShare {
    sharesCount: number;
    artist: IDbArtist;
}

export interface IArtistFollowsPerUserItem {
    [spotifyId: string]: boolean;
}

export interface INosPortfolio extends IDbPortfolio {
    shares?: IPortfolioShare[];
    artistFollows?: IArtistFollowsPerUserItem;
    transactions?: IDbTransaction[];

    netWorth?: number;
    sharesValue?: number;
    getSharesByArtistId?(artistId: string): number;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export class Portfolio implements INosPortfolio {
    balance: number;
    displayName: string;
    imageUrl?: string;
    userProfile: string;
    userProfileLink: string;
    hitCount: number;

    constructor(uid: string, obj: any = {}) {
        this.balance = obj.balance || 100;
        this.displayName = obj.displayName || 'user' + getRandomInt(1, 999999);
        this.imageUrl = obj.imageUrl || '';
        this.userProfile = uid;
        this.userProfileLink = obj.userProfileLink || '';
        this.hitCount = obj.hitCount || 1;
    }
}

export function constructPortfolio(
    portfolio: IDbPortfolio,
    sharesPerPortfolio: IPortfolioShare[],
    artistFollowsPerUser: IArtistFollowsPerUserItem,
    transactions: IDbTransaction[] = []
): INosPortfolio {
    const nosPortfolio: INosPortfolio = { ...portfolio };
    nosPortfolio.shares = sharesPerPortfolio;
    nosPortfolio.artistFollows = artistFollowsPerUser;
    nosPortfolio.transactions = transactions;

    nosPortfolio.getSharesByArtistId = (artistId: string) => {
        return sharesPerPortfolio[artistId] || 0;
    };

    nosPortfolio.sharesValue = sharesPerPortfolio.reduce((accum: number, current: IPortfolioShare) => {
        return accum + (current.artist.marketPrice * current.sharesCount);
    }, 0);

    nosPortfolio.netWorth = nosPortfolio.balance + nosPortfolio.sharesValue;

    return nosPortfolio;
}
