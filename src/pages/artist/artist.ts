import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { INosArtist } from '../../models/artist.model';

@Component({
  selector: 'page-artist',
  templateUrl: 'artist.html'
})
export class ArtistPage {
  artist: INosArtist;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  ionViewDidLoad() {
    let spotifyId = this.navParams.get('spotifyId');

    console.log('Hello ArtistDetail Page', spotifyId);
    this.artist = <any>{};
    this.artist.spotifyId = spotifyId;
  }

  loadArtistDetail(spotifyId: string) {

  }

}
