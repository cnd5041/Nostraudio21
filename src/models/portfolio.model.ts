import { IDbTransaction, ITransactionWithArtist } from './transaction.model';
import { IDbArtist, INosArtist, INosArtistMap } from './artist.model';
import { cloneDeep } from 'lodash';
import { getArtistsByKeys } from './helpers.model';

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
    artistKey: string;
}

export interface IPortfolioShareWithArtist {
    sharesCount: number;
    artistKey: string;
    artist: INosArtist;
    sharesValue?: number;
}

export interface IDbArtistFollowsPerUserItem {
    [artistKey: string]: boolean;
}

export interface INosPortfolio extends IDbPortfolio {
    shares?: IPortfolioShare[];
    artistFollows?: IDbArtistFollowsPerUserItem;
    transactions?: IDbTransaction[];

    getSharesByArtistId?(artistId: string): number;
}

export interface INosPortfolioWithArtists extends INosPortfolio {
    sharesWithArtist: IPortfolioShareWithArtist[];
    followsWithArtist: INosArtist[];
    transactionsWithArtist: ITransactionWithArtist[];

    netWorth: number;
    sharesValue: number;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export class DbPortfolio implements IDbPortfolio {
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
    artistFollowsPerUser: IDbArtistFollowsPerUserItem,
    transactions: IDbTransaction[] = []
): INosPortfolio {
    const nosPortfolio: INosPortfolio = { ...portfolio };
    nosPortfolio.shares = sharesPerPortfolio;
    nosPortfolio.artistFollows = artistFollowsPerUser;
    nosPortfolio.transactions = transactions;

    nosPortfolio.getSharesByArtistId = (artistId: string) => {
        const artist = sharesPerPortfolio.find(s => s.artistKey === artistId);
        if (artist) {
            return artist.sharesCount || 0;
        } else {
            return 0;
        }
    };

    return nosPortfolio;
}

export function NosPortfolioWithArtists(
    portfolio: INosPortfolio,
    shares: IPortfolioShare[],
    transactions: IDbTransaction[],
    artists: INosArtistMap
): INosPortfolioWithArtists {
    const nosPortfolio = cloneDeep(portfolio) as INosPortfolioWithArtists;

    if (portfolio.artistFollows) {
        nosPortfolio.followsWithArtist = getArtistsByKeys(artists, portfolio.artistFollows);
    } else {
        nosPortfolio.followsWithArtist = [];
    }
    // Add Artists to transactions
    nosPortfolio.transactionsWithArtist = transactions.map((trans) => {
        return {
            ...trans,
            artist: artists[trans.artistKey]
        };
    });
    // Add Artists to shares
    nosPortfolio.sharesWithArtist = shares.map((share) => {
        return {
            ...share,
            artist: artists[share.artistKey],
            sharesValue: artists[share.artistKey] ? share.sharesCount + artists[share.artistKey].marketPrice : 0
        };
    });
    // Calculate total sharesValue
    nosPortfolio.sharesValue = nosPortfolio.sharesWithArtist.reduce((accum: number, current: IPortfolioShareWithArtist) => {
        return current.artist ? accum + (current.artist.marketPrice * current.sharesCount) : accum;
    }, 0);
    // Calculate net worth
    nosPortfolio.netWorth = nosPortfolio.balance + nosPortfolio.sharesValue;

    return nosPortfolio;
}
