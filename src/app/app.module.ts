import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

// Installing Firebase (AngularFire2): https://javebratt.com/ionic2rc0-firebase-angularfire2/
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { SupportPage } from '../pages/support/support';
import { PortfolioPage } from '../pages/portfolio/portfolio';
import { SearchPage } from '../pages/search/search';
import { ArtistPage } from '../pages/artist/artist';
import { StatsPage } from '../pages/stats/stats';
import { LoginPage } from '../pages/login/login';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SignupPage } from '../pages/signup/signup';

//Import Components
import { ArtistListItem } from '../components/artist-list-item/artist-list-item';

//Import Providers
import { SpotifyService } from '../providers/spotify-service';
import { ArtistService } from '../providers/artist-service';
import { DateService } from '../providers/date-service';
// import { LoggingService } from '../providers/logging.service';
// import { StatsService } from '../providers/stats.service';
import { AuthData } from '../providers/auth-data';
import { PortfolioService } from '../providers/portfolio-service';
import { FirebaseStore } from '../providers/firebase-store';

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyD9ly1_EmV1N_8KDoW4IX_tYiD_hNhMBiQ",
  authDomain: "nostraudio2.firebaseapp.com",
  databaseURL: "https://nostraudio2.firebaseio.com",
  storageBucket: "",
  messagingSenderId: "392527777532"
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    SupportPage,
    PortfolioPage,
    SearchPage,
    ArtistListItem,
    ArtistPage,
    StatsPage,
    LoginPage,
    ResetPasswordPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    SupportPage,
    PortfolioPage,
    SearchPage,
    ArtistPage,
    StatsPage,
    LoginPage,
    ResetPasswordPage,
    SignupPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SpotifyService,
    ArtistService,
    DateService,
    // StatsService,
    AuthData,
    PortfolioService,
    FirebaseStore,
    InAppBrowser,
    SplashScreen
  ]
})
export class AppModule { }
