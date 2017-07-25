import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PortfolioService } from '../../providers/';
import { INosPortfolio } from '../../models/';

import { ISubscription } from "rxjs/Subscription";

@Component({
    selector: 'page-portfolio',
    templateUrl: 'portfolio.html'
})
export class PortfolioPage {

    userPortfolio: INosPortfolio;
    portfolioSubscription: ISubscription;

    constructor(
        public navCtrl: NavController,
        public portfolioService: PortfolioService
    ) {
        this.portfolioSubscription = this.portfolioService.userPortfolio$
            .subscribe(portfolio => {
                this.userPortfolio = portfolio;
            });
    }

    ionViewDidLoad() {

    }

    ionViewWillUnload() {
        this.portfolioSubscription.unsubscribe();
    }

}
