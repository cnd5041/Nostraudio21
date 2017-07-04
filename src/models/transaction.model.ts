import { IDictionary } from '../models';

export interface INosTransaction {
    artistId: string;
    portfolioId: string;
    numberOfShares: number;
    total: number;
    action: string;
}

export interface IDbTransaction extends INosTransaction, IDictionary {

}

export class NosTransaction implements INosTransaction {
    constructor(
        public artistId: string,
        public portfolioId: string,
        public numberOfShares: number,
        public total: number,
        public action: string
    ) {

    }

}
