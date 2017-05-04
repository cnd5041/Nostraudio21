import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { INosArtist } from '../../models/artist.model';
import { ArtistService } from '../../providers/';
import { ISubscription } from "rxjs/Subscription";

@Component({
    selector: 'page-artist',
    templateUrl: 'artist.html'
})
export class ArtistPage {
    artist: INosArtist;
    artistSubscription: ISubscription;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public artistService: ArtistService
    ) { }

    ionViewDidLoad() {
        const spotifyId = this.navParams.get('spotifyId');

        this.artistSubscription = this.artistService.getArtistById(spotifyId)
            .subscribe(result => {
                console.log('getArtistById result', result);
                if (result.$exists()) {
                    this.artist = result;
                } else {
                    this.artistService.createArtist(spotifyId);
                }
            });
    }

    ionViewWillUnload() {
        this.artistSubscription.unsubscribe();
    }

}
