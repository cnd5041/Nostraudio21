import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PortfolioService } from '../../providers/';
import { IPortfolio } from '../../models/';

@Component({
    selector: 'page-portfolio',
    templateUrl: 'portfolio.html'
})
export class PortfolioPage {

    userPortfolio: IPortfolio;

    constructor(
        public navCtrl: NavController,
        public portfolioService: PortfolioService
    ) { 
        this.portfolioService.userPortfolio$
            .subscribe(portfolio => {
                this.userPortfolio = portfolio;
            });
    }

    ionViewDidLoad() {
        
    }

}
