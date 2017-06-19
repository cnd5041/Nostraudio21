import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { INosArtist, IPortfolio } from '../../models';
import { ArtistService, PortfolioService } from '../../providers/';
import { ISubscription } from "rxjs/Subscription";
// import 'rxjs/add/operator/combineLatest';
// import { Observable } from 'rxjs/Observable';

import { ActionSheetController } from 'ionic-angular'

@Component({
    selector: 'page-artist',
    templateUrl: 'artist.html'
})
export class ArtistPage {
    artist: INosArtist;
    artistSubscription: ISubscription;

    portfolioSubscription: ISubscription;
    userPortfolio: IPortfolio;

    artistFollowersSubscription: ISubscription;
    artistFollowers: any[];
    isFollowing = false;

    artistGenreSubscription: ISubscription;
    artistGenres = '';

    // buyForm: FormGroup;
    action = 'buy';
    numberOfShares = 1;
    total: number;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public artistService: ArtistService,
        public portfolioService: PortfolioService,
        public actionSheetCtrl: ActionSheetController
    ) {
        // this.buyForm = this.formBuilder.group({
        //     email: ['', Validators.compose([Validators.required])]
        //     // password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        // });
    }

    ionViewDidLoad() {
        // TODO: 
        // Only purchase when logged in

        const spotifyId = this.navParams.get('spotifyId');

        const artistStream = this.artistService.getArtistById(spotifyId);
        this.artistSubscription = artistStream
            .subscribe(result => {
                if (result.$exists()) {
                    this.artist = result;
                    this.onSharesChange(this.numberOfShares);
                } else {
                    this.artistService.createArtist(spotifyId);
                }
            });

        let artistGenreSubscription = artistStream
            .subscribe(result => {
                if (result.$exists()) {
                    this.artistService.getGenresByArtistId(result.spotifyId)
                        .subscribe(genres => {
                            console.log('genre sub', genres);
                            this.artistGenres = genres.map(g => g.name).join(', ');
                        });
                }
            });

        const artistFollowersStream = this.artistService.getArtistFollowers(spotifyId);
        this.artistFollowersSubscription = artistFollowersStream
            .subscribe(artistFollowers => {
                console.log('artistFollowers', artistFollowers);
                this.artistFollowers = artistFollowers;

                // Check if the current user is one of the followers
                if (artistFollowers.find(x => x.$key === this.userPortfolio.$key)) {
                    this.isFollowing = true;
                } else {
                    this.isFollowing = false;
                }
            });

        const portfolioStream = this.portfolioService.userPortfolio$;
        this.portfolioSubscription = portfolioStream
            .subscribe(portfolio => {
                this.userPortfolio = portfolio;
            });
    }

    ionViewWillUnload() {
        this.artistSubscription.unsubscribe();
        this.portfolioSubscription.unsubscribe();
        this.artistFollowersSubscription.unsubscribe();
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

    onSharesChange(value: number) {
        this.total = this.calcTotal(value, this.artist.marketPrice);
    }

    calcTotal(shares: number = 0, price: number = 0): number {
        return shares * price;
    }

    canAfford(): boolean {
        let userBalance = (this.userPortfolio ? this.userPortfolio.balance : 0);
        return (this.total < userBalance ? true : false);
    }

    getColor() {
        return (this.canAfford() ? 'moneygreen' : 'danger');
    }

    /**
     * TODO:
     *set up buy option
    turn text/button red if it's beyond their account cash
    add a currency color or something for a green
     */

}
