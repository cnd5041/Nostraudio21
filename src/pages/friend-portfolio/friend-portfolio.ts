import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ArtistPage } from '../../pages';
import { NosFirebaseService } from '../../providers';
import { INosArtist, INosPortfolioWithArtists, ITransactionWithArtist, IPortfolioShareWithArtist } from '../../models/';
// Library Imports
import { Subject } from 'rxjs/Subject';
// Store imports
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';

@Component({
    selector: 'page-friend-portfolio',
    templateUrl: 'friend-portfolio.html'
})
export class FriendPortfolioPage {
    private unsubscribe$: Subject<any> = new Subject();

    userPortfolio: INosPortfolioWithArtists;
    stocks: IPortfolioShareWithArtist[];
    artistFollows: INosArtist[];
    transactions: ITransactionWithArtist[];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public store: Store<fromStore.MusicState>,
        public firebaseProvider: NosFirebaseService
    ) {
        // Start Loading
        this.store.dispatch(new fromStore.ShowLoading());

        const portfolioId = this.navParams.get('portfolioId');
        this.store.dispatch(new fromStore.FetchFriendPortfolio(portfolioId));

        this.store.select(fromStore.getFriendNosPortfolioWithArtists)
            .takeUntil(this.unsubscribe$)
            .subscribe(state => {
                this.store.dispatch(new fromStore.HideLoading());
                console.log('getFriendNosPortfolioWithArtists', portfolioId, state);
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

    getTransactionBadgeColor(trans: ITransactionWithArtist) {
        return (trans.action === 'Buy' ? 'moneygreen' : 'danger');
    }

}
