import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PortfolioPage, ArtistPage, StatsPage, LoginPage, SearchPage } from '../../pages/';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams
    ) { }

    ionViewDidLoad() {
        // testing    
        setTimeout(() => {
            // this.navCtrl.push(ArtistPage, { spotifyId: '168dgYui7ExaU612eooDF1' });
            // this.navCtrl.push(StatsPage);
            // this.navCtrl.push(LoginPage);
            // this.navCtrl.push(PortfolioPage);
            this.navCtrl.push(SearchPage);
        }, 500);

    }

}
