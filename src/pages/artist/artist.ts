﻿import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, LoadingController, LoadingOptions } from 'ionic-angular';

import { INosArtist, INosPortfolio } from '../../models';
import { ArtistService, PortfolioService } from '../../providers/';
import { ISubscription } from "rxjs/Subscription";


@Component({
    selector: 'page-artist',
    templateUrl: 'artist.html'
})
export class ArtistPage {
    artist: INosArtist;
    artistSubscription: ISubscription;

    portfolioSubscription: ISubscription;
    userPortfolio: INosPortfolio;

    artistFollowersSubscription: ISubscription;
    artistFollowers: any[];
    isFollowing = false;

    artistGenres = '';

    // buyForm: FormGroup;
    action = 'buy';
    buyShareCount = 1;
    buyTotal: number;
    sellShareCount = 1;
    sellTotal: number;
    ownedShares = 0;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public artistService: ArtistService,
        public portfolioService: PortfolioService,
        public actionSheetCtrl: ActionSheetController,
        public loadingCtrl: LoadingController
    ) {
    }

    ionViewDidLoad() {
        const spotifyId = this.navParams.get('spotifyId');

        const loading = this.loadingCtrl.create({});
        loading.present();

        // Setup Artist Stream and Subscription
        const artistStream = this.artistService.getArtistById(spotifyId);
        this.artistSubscription = artistStream
            .subscribe(result => {
                if (result.$exists()) {
                    loading.dismiss();
                    // Set artist and trigger share change
                    this.artist = result;
                    this.onBuySharesChange(this.buyShareCount);
                    this.onSellSharesChange(this.sellShareCount);
                    // Get Genres
                    this.artistService.getGenresByArtistId(result.spotifyId)
                        .subscribe(genres => {
                            this.artistGenres = genres.map(g => g.name).join(', ');
                        });
                } else {
                    this.artistService.createArtist(spotifyId);
                }
            });

        // Setup Artist Followers Stream and Subscription
        const artistFollowersStream = this.artistService.getArtistFollowers(spotifyId);
        this.artistFollowersSubscription = artistFollowersStream
            .subscribe(artistFollowers => {
                this.artistFollowers = artistFollowers;
                // Check if the current user is one of the followers
                this.setIsFollowing();
            });

        // Setup Portfolio Stream and Subscription
        const portfolioStream = this.portfolioService.userPortfolio$;
        this.portfolioSubscription = portfolioStream
            .subscribe(portfolio => {
                console.log('portfolio', portfolio);
                this.userPortfolio = portfolio;
                this.ownedShares = this.userPortfolio.sharesPerArtist(spotifyId);
            });
    }

    setIsFollowing(): void {
        // Check if the current user is one of the followers
        if (this.userPortfolio && this.artistFollowers.find(x => x.$key === this.userPortfolio.$key)) {
            this.isFollowing = true;
        } else {
            this.isFollowing = false;
        }
    }

    ionViewWillUnload() {
        this.artistSubscription.unsubscribe();
        this.artistFollowersSubscription.unsubscribe();
        this.portfolioSubscription.unsubscribe();
    }

    follow(): void {
        this.artistService.followArtist(this.artist.spotifyId, this.userPortfolio.$key);
    }

    unFollow() {
        let actionSheet = this.actionSheetCtrl.create({
            title: this.artist.name,
            buttons: [
                {
                    text: 'Unfollow',
                    role: 'destructive',
                    handler: () => {
                        this.artistService.unFollowArtist(this.artist.spotifyId, this.userPortfolio.$key)
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

    isValidNumber(value: number): boolean {
        console.log('Number.isInteger(value)', Number.isInteger(value));
        console.log('value > 0', value > 0);
        return Number.isInteger(value) && value > 0;
    }

    onBuyClick(): void {
        const purchase = () => {
            this.artistService.userBuyArtist(this.userPortfolio, this.artist, this.buyShareCount);
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
            alert('sell');
        };

        if (!this.isValidNumber(this.sellShareCount)) {
            return;
        }

        if (this.sellShareCount > this.ownedShares){
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
