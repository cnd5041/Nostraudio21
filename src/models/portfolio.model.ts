import { IDictionary } from '../models';


interface IFireBaseIdReference extends String {

}

export interface IDbPortfolio extends IDictionary {
    balance: number;
    displayName: string;
    hitCount: number;
    imageUrl?: string;
    userProfile: IFireBaseIdReference;
    userProfileLink: string;
}


export interface INosPortfolio extends IDbPortfolio {
    // artists: boolean[];
    // artistFollows: boolean[];
    // achievements: boolean[];
    // friends: boolean[];
    shares?: IDictionary[];
    artistFollows?: IDictionary[];

    sharesPerArtist?(artistId: string): number;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export class Portfolio implements INosPortfolio {
    balance: number;
    displayName: string;
    imageUrl?: string;
    userProfile: IFireBaseIdReference;
    userProfileLink: string;
    hitCount: number;
    // artists: boolean[];
    // artistFollows: boolean[];
    // achievements: boolean[];
    // friends: boolean[];

    constructor(uid: string, obj: any = {}) {
        this.balance = obj.balance || 100;
        this.displayName = obj.displayName || 'user' + getRandomInt(1, 999999);
        this.imageUrl = obj.imageUrl || '';
        this.userProfile = uid;
        this.userProfileLink = obj.userProfileLink || '';
        this.hitCount = obj.hitCount || 1;
        // this.artists = obj.artists || [];
        // this.artistFollows = obj.artistFollows || [];
        // this.achievements = obj.achievements || [];
        // this.friends = obj.friends || [];
    }
}

export function constructPortfolio(portfolio: IDbPortfolio, sharesPerPortfolio: IDictionary[], artistFollowsPerUser: IDictionary[]) {
    // let nosPortfolio: INosPortfolio = Object.assign({}, portfolio);
    let nosPortfolio: INosPortfolio = Object.create(portfolio);
    nosPortfolio.shares = sharesPerPortfolio;
    nosPortfolio.artistFollows = artistFollowsPerUser;

    nosPortfolio.sharesPerArtist = (artistId: string) => {
        const isOwned = (nosPortfolio.shares ? nosPortfolio.shares.find(share => share.$key === artistId) : 0);
        return (isOwned ? isOwned.$value : 0);
    };

    return nosPortfolio;
};
