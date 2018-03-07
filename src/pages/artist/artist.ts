import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, LoadingController } from 'ionic-angular';

// Models
import { INosArtist, INosPortfolio } from '../../models';

import lodash from 'lodash';
// rxjs imports
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
// Store imports
import { Store } from '@ngrx/store';
import * as fromStore from '../../app/store';

@Component({
    selector: 'page-artist',
    templateUrl: 'artist.html'
})
export class ArtistPage {
    private unsubscribe: Subject<any> = new Subject();

    artist: INosArtist;
    userPortfolio: INosPortfolio;

    artistFollowerCount$: Observable<number>;
    isFollowing$: Observable<boolean>;
    artistGenres$: Observable<string[]>;

    action = 'buy';
    buyShareCount = 1;
    buyTotal: number;
    sellShareCount = 1;
    sellTotal: number;
    ownedShares = 0;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public actionSheetCtrl: ActionSheetController,
        public loadingCtrl: LoadingController,
        private store: Store<fromStore.MusicState>
    ) {
    }

    ionViewDidLoad() {
        const spotifyId = this.navParams.get('spotifyId');
        this.store.dispatch(new fromStore.StartArtistSubscription(spotifyId));
        this.store.dispatch(new fromStore.SetSelectedArtistId(spotifyId));

        // Start Loading
        const loading = this.loadingCtrl.create({});
        loading.present();

        this.store.select(fromStore.getSelectedNosArtist)
            .takeUntil(this.unsubscribe)
            .filter(result => !!result)
            .subscribe(state => {
                console.log('getSelectedNosArtist', state);
                // Stop Loading
                loading.dismiss();
                this.artist = <any>state;
                this.onBuySharesChange(this.buyShareCount);
                this.onSellSharesChange(this.sellShareCount);
            });

        // Setup Portfolio
        this.store.select(fromStore.getNosPortfolio)
            .takeUntil(this.unsubscribe)
            .filter(state => !!state)
            .subscribe((state) => {
                console.log('getNosPortfolio', state);
                this.userPortfolio = state;
                this.ownedShares = this.userPortfolio.getSharesByArtistId(spotifyId);
            });

        // Get a string of artist genres
        this.artistGenres$ = this.store.select(fromStore.getSelectedArtistGenres);
        // Follower Count
        this.artistFollowerCount$ = this.store.select(fromStore.getSelectedFollowersCount);
        // isFollowing
        this.isFollowing$ = this.store.select(fromStore.isFollowingCurrentArtist);
    }

    ionViewWillUnload() {
        // End Subscriptions
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    follow(): void {
        this.store.dispatch(new fromStore.UserFollowArtist(
            { artistKey: this.artist.spotifyId, portfolioKey: this.userPortfolio.userProfile }
        ));
    }

    unFollow() {
        const actionSheet = this.actionSheetCtrl.create({
            title: this.artist.name,
            buttons: [
                {
                    text: 'Unfollow',
                    role: 'destructive',
                    handler: () => {
                        this.store.dispatch(new fromStore.UserUnfollowArtist(
                            { artistKey: this.artist.spotifyId, portfolioKey: this.userPortfolio.userProfile }
                        ));
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => { }
                }
            ]
        });

        actionSheet.present();
    }

    onBuySharesChange(value: number = 0): void {
        this.buyTotal = value * (this.artist.marketPrice || 0);
    }

    onSellSharesChange(value: number = 0): void {
        this.sellTotal = value * (this.artist.marketPrice || 0);
    }

    canAfford(): boolean {
        const userBalance = (this.userPortfolio ? this.userPortfolio.balance : 0);
        return (this.buyTotal < userBalance ? true : false);
    }

    getBuyBadgeColor() {
        return (this.canAfford() ? 'moneygreen' : 'danger');
    }

    isValidNumber(value: number | string): boolean {
        const intVal = lodash.toInteger(value);
        return value !== '' && lodash.isInteger(intVal) && intVal > 0;
    }

    isSellValid(): boolean {
        if (this.sellShareCount > this.ownedShares) {
            return false;
        } else if (!this.isValidNumber(this.sellShareCount)) {
            return false;
        } else {
            return true;
        }
    }

    isBuyValid(): boolean {
        if (!this.canAfford()) {
            return false;
        } else if (!this.isValidNumber(this.buyShareCount)) {
            return false;
        } else {
            return true;
        }
    }

    onBuyClick(): void {
        const purchase = () => {
            const params = {
                portfolio: this.userPortfolio,
                artistKey: this.artist.spotifyId,
                shareCount: lodash.toInteger(this.buyShareCount),
                price: this.artist.marketPrice
            };
            this.store.dispatch(new fromStore.UserBuyArtist(params));
        };

        if (!this.isValidNumber(this.buyShareCount)) {
            return;
        }

        const actionSheet = this.actionSheetCtrl.create({
            title: this.artist.name,
            buttons: [
                {
                    text: 'Buy',
                    handler: () => {
                        purchase();
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => { }
                }
            ]
        });

        actionSheet.present();
    }

    onSellClick(): void {
        const sell = () => {
            const params = {
                portfolio: this.userPortfolio,
                artistKey: this.artist.spotifyId,
                shareCount: lodash.toInteger(this.sellShareCount),
                price: this.artist.marketPrice
            };
            this.store.dispatch(new fromStore.UserSellArtist(params));
        };

        if (!this.isValidNumber(this.sellShareCount)) {
            return;
        }

        if (this.sellShareCount > this.ownedShares) {
            return;
        }

        const actionSheet = this.actionSheetCtrl.create({
            title: this.artist.name,
            buttons: [
                {
                    text: 'Sell',
                    handler: () => {
                        sell();
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => { }
                }
            ]
        });

        actionSheet.present();
    }

}
