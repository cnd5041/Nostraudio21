import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AboutPage } from '../pages/about/about';
import { SupportPage } from '../pages/support/support';
import { PortfolioPage } from '../pages/portfolio/portfolio';
import { SearchPage } from '../pages/search/search';
import { StatsPage } from '../pages/stats/stats';
import { LoginPage } from '../pages/login/login';
import { FriendsPage } from '../pages/friends/friends';

import { AuthData } from '../providers/auth-data';

import { Store } from '@ngrx/store';
import * as fromStore from '../store';

export interface IAppPage {
    title: string;
    component: any;
    icon: string;
    logsOut?: boolean;
    index?: number;
    tabComponent?: any;
}

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any;

    pages: IAppPage[] = [
        { title: 'Portfolio', component: PortfolioPage, icon: 'folder-open' },
        { title: 'Search', component: SearchPage, icon: 'search' },
        { title: 'Stats', component: StatsPage, icon: 'stats' },
        { title: 'Friends', component: FriendsPage, icon: 'people' },
        { title: 'About', component: AboutPage, icon: 'information-circle' },
        { title: 'Support', component: SupportPage, icon: 'help-buoy' },
        { title: 'Account', component: LoginPage, icon: 'cog' }
    ];

    constructor(
        public platform: Platform,
        public splashScreen: SplashScreen,
        public authData: AuthData,
        private store: Store<fromStore.MusicState>
    ) {
        this.rootPage = AboutPage;

        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            // StatusBar.styleDefault();
            this.splashScreen.hide();

            // firebase.auth().onAuthStateChanged((user) => {
            //   if (user) {
            //     //this.rootPage = PortfolioPage;
            //     this.rootPage = LoginPage;
            //     console.log("Logged in - HomePage");
            //   } else {
            //     this.rootPage = LoginPage;
            //     console.log("No User -  LoginPage");
            //   }
            // });
            //       this.navCtrl.push(ArtistPage, { spotifyId: '168dgYui7ExaU612eooDF1' });

            // Subscribe to the authState
            // When we get a new authState, get the portfolio
            this.authData.authState
                .subscribe(userState => {
                    console.log('userState Change', userState);
                    if (userState && userState.uid) {
                        this.store.dispatch(new fromStore.FetchPortfolio(userState.uid));
                        this.store.dispatch(new fromStore.FetchFriends(userState.uid));
                    } else {
                        this.store.dispatch(new fromStore.ResetPorfolio());
                    }
                }, error => {
                    console.log('getAuthState error', error);
                    this.store.dispatch(new fromStore.ResetPorfolio());
                });
        });
    }

    openPage(page: IAppPage) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}
