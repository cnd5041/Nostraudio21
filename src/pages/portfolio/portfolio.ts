import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { ArtistPage } from '../../pages';
// import { PortfolioService } from '../../providers/';
import { INosPortfolio, INosArtist } from '../../models/';

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

    stocks: INosArtist[];
    artistFollows: INosArtist[];

    constructor(
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        private store: Store<fromStore.MusicState>,
        // public portfolioService: PortfolioService
    ) {
        // Start Loading
        const loading = this.loadingCtrl.create({});
        loading.present();

        this.store.select(fromStore.getNosPortfolio)
            .takeUntil(this.unsubscribe)
            .subscribe(state => {
                loading.dismiss();
                console.log('getNosPortfolio', state);
                this.userPortfolio = state;
                if (this.userPortfolio) {
                    // Load each artist in the portfolio
                    Object.keys(this.userPortfolio.shares).forEach((key) => {
                        this.store.dispatch(new fromStore.StartArtistSubscription(key));
                    });
                    // Load each artist in the follows
                    Object.keys(this.userPortfolio.artistFollows).forEach((key) => {
                        this.store.dispatch(new fromStore.StartArtistSubscription(key));
                    });
                }
            });

        this.store.select(fromStore.getPortfolioStockNosArtists)
            .takeUntil(this.unsubscribe)
            .subscribe(state => {
                console.log('getPortfolioNosArtists', state);
                this.stocks = state;
            });

        this.store.select(fromStore.getPortfolioFollowingNosArtists)
            .takeUntil(this.unsubscribe)
            .subscribe(state => {
                console.log('getPortfolioFollowingNosArtists', state);
                this.artistFollows = state;
            });
    }

    ionViewDidLoad() {

    }

    ionViewWillUnload() {
        // Stop the artist subscriptions
        Object.keys(this.userPortfolio.shares).forEach((key) => {
            this.store.dispatch(new fromStore.StopArtistSubscription(key));
        });
        Object.keys(this.userPortfolio.artistFollows).forEach((key) => {
            this.store.dispatch(new fromStore.StopArtistSubscription(key));
        });
        // End Subscriptions
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onHoldingSelect(spotifyId: string): void {
        this.navCtrl.push(ArtistPage, { spotifyId: spotifyId });
    }

}
