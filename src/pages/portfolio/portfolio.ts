import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ArtistPage } from '../../pages';
import { NosFirebaseService } from '../../providers';
import { INosArtist, IDbTransaction, INosPortfolioWithArtists, ITransactionWithArtist, IPortfolioShareWithArtist } from '../../models/';
// Library Imports
import { Subject } from 'rxjs/Subject';
// Store imports
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';

@Component({
    selector: 'page-portfolio',
    templateUrl: 'portfolio.html'
})
export class PortfolioPage {
    private unsubscribe$: Subject<any> = new Subject();

    userPortfolio: INosPortfolioWithArtists;
    stocks: IPortfolioShareWithArtist[];
    artistFollows: INosArtist[];
    transactions: ITransactionWithArtist[];

    constructor(
        public navCtrl: NavController,
        public store: Store<fromStore.MusicState>,
        public firebaseProvider: NosFirebaseService
    ) {
        // Start Loading
        this.store.dispatch(new fromStore.ShowLoading());

        this.store.select(fromStore.getNosPortfolioWithArtists)
            .takeUntil(this.unsubscribe$)
            .subscribe(state => {
                this.store.dispatch(new fromStore.HideLoading());
                console.log('getNosPortfolioWithArtists', state);
                this.userPortfolio = state;
                if (this.userPortfolio) {
                    this.stocks = state.sharesWithArtist;
                    this.artistFollows = state.followsWithArtist;
                    this.transactions = state.transactionsWithArtist;
                }
            });
    }

    ionViewDidLoad() {

    }

    ionViewWillUnload() {
        // End Subscriptions
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onHoldingSelect(spotifyId: string): void {
        this.navCtrl.push(ArtistPage, { spotifyId: spotifyId });
    }

    onTransHide(transaction: IDbTransaction): void {
        this.firebaseProvider.hideTransaction(transaction.firebaseKey);
    }

    getTransactionBadgeColor(trans: ITransactionWithArtist) {
        return (trans.action === 'Buy' ? 'moneygreen' : 'danger');
    }

}
