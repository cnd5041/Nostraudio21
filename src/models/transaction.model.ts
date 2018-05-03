import { IDbArtist } from './artist.model';

export interface IDbTransaction {
    artistKey: string;
    portfolioId: string;
    numberOfShares: number;
    total: number;
    action: string;
    isHidden?: boolean;
    date: number;
    // Not in Database
    firebaseKey?: string;
}

export interface ITransactionWithArtist extends IDbTransaction{
    artist: IDbArtist;
}

export class NosTransaction implements IDbTransaction {
    public date;
    constructor(
        public artistKey: string,
        public portfolioId: string,
        public numberOfShares: number,
        public total: number,
        public action: string,
        public isHidden: boolean = false
    ) {
        this.date = Date.now();
    }

}
