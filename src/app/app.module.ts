import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

// import { SpotifyService } from 'angular2-spotify/angular2-spotify';
//C:\Users\Chris\Development\Nostraudio21\node_modules\angular2-spotify\angular2-spotify.d.ts

import { MyApp } from './app.component';

import {
  AboutPage, SupportPage, PortfolioPage, SearchPage, ArtistPage, StatsPage, LoginPage, ResetPasswordPage, SignupPage
} from '../pages/';

//Import Components
import { ArtistListItem } from '../components/artist-list-item/artist-list-item';

//Import Providers
import {
  NosSpotifyService, ArtistService, DateService, AuthData, PortfolioService, FirebaseStore
} from '../providers/';

// AF2 Settings
export const firebaseConfig = {
  apiKey: 'AIzaSyD9ly1_EmV1N_8KDoW4IX_tYiD_hNhMBiQ',
  authDomain: 'nostraudio2.firebaseapp.com',
  databaseURL: 'https://nostraudio2.firebaseio.com',
  storageBucket: '',
  messagingSenderId: '392527777532'
};

const spotifyConfig = {
  provide: 'SpotifyConfig',
  useValue: {
    clientId: '98e6bfec35a84072badbb68d75c27dd4',
    redirectUri: '',
    scope: '',
    // If you already have an auth token
    authToken: ''
  }
}


// const myFirebaseAuthConfig = {
//   provider: AuthProviders.Password,
//   method: AuthMethods.Password
// }

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
    // AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
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
    NosSpotifyService,
    ArtistService,
    DateService,
    // StatsService,
    AuthData,
    PortfolioService,
    FirebaseStore,
    InAppBrowser,
    SplashScreen,
    //SpotifyService, spotifyConfig
  ]
})
export class AppModule { }
