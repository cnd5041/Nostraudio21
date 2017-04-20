import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { INosArtist } from '../../models/artist.model';
import { ArtistService } from '../../providers/';

@Component({
    selector: 'page-artist',
    templateUrl: 'artist.html'
})
export class ArtistPage {
    artist: INosArtist;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public artistService: ArtistService
    ) { }

    ionViewDidLoad() {
        let spotifyId = this.navParams.get('spotifyId');

        console.log('Hello ArtistDetail Page', spotifyId);
        this.artist = <any>{};
        this.artist.spotifyId = spotifyId;

        this.artistService.getArtistBySpotifyId(spotifyId);
    }

    loadArtistDetail(spotifyId: string) {

    }

}
