import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PortfolioService } from '../../providers/portfolio-service';

@Component({
  selector: 'page-portfolio',
  templateUrl: 'portfolio.html'
})
export class PortfolioPage {

  portfolio: any;
  item: any;

  constructor(
    public navCtrl: NavController,
    public portfolioService: PortfolioService
  ) { }

  ionViewDidLoad() {
    // this.item = this.portfolioService.getExamplePortfolio();
  }

}
