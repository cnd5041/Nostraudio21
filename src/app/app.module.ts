import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { MyApp } from './app.component';

import {
    AboutPage, SupportPage, PortfolioPage, SearchPage, ArtistPage, StatsPage, LoginPage, ResetPasswordPage, SignupPage
} from '../pages/';

//Import Components
import { ArtistListItem } from '../components/artist-list-item/artist-list-item';

//Import Providers
import {
    NosSpotifyService, ArtistService, DateService, AuthData, PortfolioService, FirebaseStore, DiscogsService, FirebaseProvider
} from '../providers/';

// AF2 Settings
export const firebaseConfig = {
    apiKey: 'AIzaSyD9ly1_EmV1N_8KDoW4IX_tYiD_hNhMBiQ',
    authDomain: 'nostraudio2.firebaseapp.com',
    databaseURL: 'https://nostraudio2.firebaseio.com',
    storageBucket: '',
    messagingSenderId: '392527777532'
};

// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// import { appReducer, initialState, reducers } from './store/reducers';
// import { initialState } from './store/reducers';

import { reducers } from './store';

import { GenresEffects } from './store/effects';
import { ArtistsEffects } from './store/artists/artist.effects';


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
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        // StoreModule.forRoot(reducers, {
        //     initialState
        // }),
        StoreModule.forRoot(reducers, {}),
        EffectsModule.forRoot([
            GenresEffects, ArtistsEffects
        ]),
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
        DiscogsService,
        ArtistService,
        DateService,
        AuthData,
        PortfolioService,
        FirebaseStore,
        InAppBrowser,
        SplashScreen,
        FirebaseProvider,
    ]
})
export class AppModule { }
