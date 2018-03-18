import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { Subject } from "rxjs/Subject";
// Store imports
import { Store } from '@ngrx/store';
import * as fromStore from '../../app/store';

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html'
})
export class StatsPage {
    private unsubscribe: Subject<any> = new Subject();

  artists: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    // this.artists = this.artistService.artists;
  }

}
