interface IFireBaseIdReference extends String {

}

export interface IPortfolio {
    $key?: string;
    balance: number;
    displayName: string;
    imageUrl?: string;
    userProfile: IFireBaseIdReference;
    userProfileLink: string;
    hitCount: number;
    //Id is reference to Firebase Object
    artists: boolean[];
    artistFollows: boolean[];
    achievements: boolean[];
    friends: boolean[];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export class Portfolio implements IPortfolio {
    balance: number;
    displayName: string;
    imageUrl?: string;
    userProfile: IFireBaseIdReference;
    userProfileLink: string;
    hitCount: number;
    //Id is reference to Firebase Object
    artists: boolean[];
    artistFollows: boolean[];
    achievements: boolean[];
    friends: boolean[];

    constructor(uid: string, obj: any = {}) {
        this.balance = obj.balance || 100;
        this.displayName = obj.displayName || 'user' + getRandomInt(1, 999999);
        this.imageUrl = obj.imageUrl || '';
        this.userProfile = uid;
        this.userProfileLink = obj.userProfileLink || '';
        this.hitCount = obj.hitCount || 1;
        this.artists = obj.artists || [];
        this.artistFollows = obj.artistFollows || [];
        this.achievements = obj.achievements || [];
        this.friends = obj.friends || [];
    }
}
