export interface IDbTransaction {
    artistId: string;
    portfolioId: string;
    numberOfShares: number;
    total: number;
    action: string;
}

export class NosTransaction implements IDbTransaction {
    constructor(
        public artistId: string,
        public portfolioId: string,
        public numberOfShares: number,
        public total: number,
        public action: string
    ) {

    }

}
