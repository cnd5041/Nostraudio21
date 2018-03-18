import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ArtistPage } from '../../pages';
import { FirebaseProvider } from '../../providers';
import { INosPortfolio, INosArtist, IDbTransaction, IPortfolioShare } from '../../models/';

import { Subject } from "rxjs/Subject";
// Store imports
import { Store } from '@ngrx/store';
import * as fromStore from '../../app/store';

@Component({
    selector: 'page-portfolio',
    templateUrl: 'portfolio.html'
})
export class PortfolioPage {
    private unsubscribe: Subject<any> = new Subject();

    userPortfolio: INosPortfolio;

    stocks: IPortfolioShare[];
    artistFollows: INosArtist[];
    transactions: IDbTransaction[];

    constructor(
        public navCtrl: NavController,
        public store: Store<fromStore.MusicState>,
        public firebaseProvider: FirebaseProvider
    ) {
        // Start Loading
        this.store.dispatch(new fromStore.ShowLoading());

        this.store.select(fromStore.getNosPortfolio)
            .takeUntil(this.unsubscribe)
            .subscribe(state => {
                this.store.dispatch(new fromStore.HideLoading());
                console.log('getNosPortfolio', state);
                this.userPortfolio = state;
                if (this.userPortfolio) {
                    // Get transactions that are not hidden
                    this.transactions = this.userPortfolio.transactions;
                    this.stocks = this.userPortfolio.shares;
                    // Load each artist in the follows
                    Object.keys(this.userPortfolio.artistFollows).forEach((key) => {
                        // this.store.dispatch(new fromStore.StartArtistSubscription(key));
                    });
                }
            });

        this.store.select(fromStore.getPortfolioFollowingNosArtists)
            .takeUntil(this.unsubscribe)
            .subscribe(state => {
                console.log('getPortfolioFollowingNosArtists', state);
                this.artistFollows = state;
            });

            this.store.select(fromStore.getArtistsMap)
            .takeUntil(this.unsubscribe)
            .subscribe(state => {
                console.log('getArtistsMap', state);
            });
    }

    ionViewDidLoad() {

    }

    ionViewWillUnload() {
        // Stop the artist subscriptions
        Object.keys(this.userPortfolio.artistFollows).forEach((key) => {
            // this.store.dispatch(new fromStore.StopArtistSubscription(key));
        });
        // End Subscriptions
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onHoldingSelect(spotifyId: string): void {
        this.navCtrl.push(ArtistPage, { spotifyId: spotifyId });
    }

    onTransHide(transaction: IDbTransaction): void {
        this.firebaseProvider.hideTransaction(transaction.firebaseKey);
    }

}
