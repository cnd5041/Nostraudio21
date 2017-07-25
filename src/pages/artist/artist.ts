import { Component } from '@angular/core';
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
    numberOfShares = 1;
    total: number;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public artistService: ArtistService,
        public portfolioService: PortfolioService,
        public actionSheetCtrl: ActionSheetController,
        public loadingCtrl: LoadingController
    ) {
        // this.buyForm = this.formBuilder.group({
        //     email: ['', Validators.compose([Validators.required])]
        //     // password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        // });

    }

    ionViewDidLoad() {
        const spotifyId = this.navParams.get('spotifyId');
        const loadingOptions: LoadingOptions = {
            dismissOnPageChange: true
        };
        const loader = this.loadingCtrl.create(loadingOptions);

        loader.present();

        // Setup Artist Stream and Subscription
        const artistStream = this.artistService.getArtistById(spotifyId);
        this.artistSubscription = artistStream
            .subscribe(result => {
                if (result.$exists()) {
                    loader.dismiss();
                    // Set artist and trigger share change
                    this.artist = result;
                    this.onSharesChange(this.numberOfShares);
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

    onSharesChange(value: number = 0): void {
        // this.total = this.calcTotal(value, this.artist.marketPrice);
        this.total = value * (this.artist.marketPrice || 0);
    }

    canAfford(): boolean {
        const userBalance = (this.userPortfolio ? this.userPortfolio.balance : 0);
        return (this.total < userBalance ? true : false);
    }

    getBuyBadgeColor() {
        return (this.canAfford() ? 'moneygreen' : 'danger');
    }

    onBuyClick(): void {
        const purchase = () => {
            this.artistService.userBuyArtist(this.userPortfolio, this.artist, this.numberOfShares);
        };

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

    //Sell - make sure they have shares

}
