import { IDbArtist } from './artist.model';

export interface IDbTransaction {
    artistKey: string;
    portfolioId: string;
    numberOfShares: number;
    total: number;
    action: string;
    isHidden?: boolean;
    timestamp: number;
    // Not in Database
    firebaseKey?: string;
}

export interface ITransactionWithArtist extends IDbTransaction{
    artist: IDbArtist;
}

export class NosTransaction implements IDbTransaction {
    public timestamp;
    constructor(
        public artistKey: string,
        public portfolioId: string,
        public numberOfShares: number,
        public total: number,
        public action: string,
        public isHidden: boolean = false
    ) {
        this.timestamp = Date.now();
    }

}
