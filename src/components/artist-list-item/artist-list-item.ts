import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { INosArtist } from '../../models';
import { ArtistPage } from '../../pages';


@Component({
    selector: 'artist-list-item',
    templateUrl: 'artist-list-item.html'
})
export class ArtistListItem {
    @Input() artist: INosArtist;

    constructor(
        public navCtrl: NavController
    ) { }

    onArtistSelect(spotifyId: string): void {
        this.navCtrl.push(ArtistPage, { spotifyId: spotifyId });
    }

}
