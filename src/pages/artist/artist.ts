import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';

// App Imports
import { INosArtist, INosPortfolio } from '../../models';
import { UiService, NosSongkickService } from '../../providers';
import { EventsModal } from '../events-modal/events-modal';

// library imports
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { toInteger, isInteger } from 'lodash';
// Store imports
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';

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
    artistGenres: string[];

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
        public modalCtrl: ModalController,
        public store: Store<fromStore.MusicState>,
        public uiService: UiService,
        public songkick: NosSongkickService
    ) {
    }

    ionViewDidLoad() {
        const spotifyId = this.navParams.get('spotifyId');
        this.store.dispatch(new fromStore.SetSelectedArtistId(spotifyId));

        // Start Loading
        this.store.dispatch(new fromStore.ShowLoading());

        this.uiService.navBackSubject$
            .filter(state => state === true)
            .takeUntil(this.unsubscribe)
            .subscribe((navBack) => {
                this.store.dispatch(new fromStore.HideLoading());
                this.navCtrl.pop();
            });

        this.store.select(fromStore.getSelectedNosArtist)
            .takeUntil(this.unsubscribe)
            .filter(result => !!result)
            .subscribe(state => {
                console.log('getSelectedNosArtist', state);
                // Stop Loading
                this.store.dispatch(new fromStore.HideLoading());
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
        const intVal = toInteger(value);
        return value !== '' && isInteger(intVal) && intVal > 0;
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
                shareCount: toInteger(this.buyShareCount),
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
                shareCount: toInteger(this.sellShareCount),
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

    onEventsClick() {
        const modal = this.modalCtrl.create(EventsModal);
        modal.present();
    }

}
