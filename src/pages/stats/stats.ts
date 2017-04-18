import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { ArtistService } from '../../providers/artist-service';

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html'
})
export class StatsPage {
  artists: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public artistService: ArtistService
  ) {

  }

  ionViewDidLoad() {
    this.artists = this.artistService.artists;
  }

}
