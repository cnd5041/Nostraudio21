import { IDbArtist } from './artist.model';

export interface IDbTransaction {
    artistId: string;
    portfolioId: string;
    numberOfShares: number;
    total: number;
    action: string;
    isHidden?: boolean;
    date: number;
    // Not in Database
    artist?: IDbArtist;
    firebaseKey?: string;
}

export class NosTransaction implements IDbTransaction {
    date;
    constructor(
        public artistId: string,
        public portfolioId: string,
        public numberOfShares: number,
        public total: number,
        public action: string,
        public isHidden: boolean = false
    ) {
        this.date = Date.now();
    }

}
