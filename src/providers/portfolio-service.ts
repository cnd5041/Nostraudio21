import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Subject, BehaviorSubject, Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


import { INosPortfolio, Portfolio, constructPortfolio } from '../models';
import { AuthData, FirebaseStore } from '../providers/';


@Injectable()
export class PortfolioService {
    private _userPortfolio$: BehaviorSubject<INosPortfolio> = new BehaviorSubject(undefined);
    public userPortfolio$: Observable<any>;


    // // private portfoliosRef: FirebaseObjectObservable<any> = this.af.database.object('portfolios');
    // // private portfoliosRef: Observable<any> = this.af.database.object('portfolios');

    // // private portfolios$: FirebaseListObservable<IPortfolio[]>;
    // private portfolios$: Observable<IPortfolio[]>;

    // // exampleItem: FirebaseObjectObservable<any>;
    // exampleItem: Observable<any>;

    // userId$ = new Subject<string>();

    // portfolioQuery$ = new Observable<any>();
    // // portfolioQuery$ = this.af.database.list('/portfolios', {
    // //   query: {
    // //     orderByChild: 'userProfile',
    // //     equalTo: this.userId$
    // //   }
    // // });

    constructor(
        private http: Http,
        private db: AngularFireDatabase,
        private afAuth: AngularFireAuth,
        private authData: AuthData,
        private firebaseStore: FirebaseStore
    ) {

        // Set up userPortfolio Observable - emit all defined results
        this.userPortfolio$ = this._userPortfolio$.asObservable()
            .filter(data => data !== undefined);
    }

    getNosUserPortolio(uid: string) {
        const portfolioSource = this.firebaseStore.portfolioById(uid);
        const sharePerPortolioSource = this.firebaseStore.sharesPerPortfolio(uid);
        const artistFollowsPerPortolioSource = this.firebaseStore.artistFollowsPerUser(uid);

        const stream = portfolioSource.combineLatest(sharePerPortolioSource, artistFollowsPerPortolioSource);

        const sourceMap = stream.map(queriedItems => {
            const portfolio = queriedItems[0];
            const sharesPerPortfolio = queriedItems[1];
            const artistFollowsPerUser = queriedItems[2];
            const nosPortfolio = constructPortfolio(portfolio, sharesPerPortfolio, artistFollowsPerUser);
            return nosPortfolio;
        });

        return sourceMap;
    }

    getUserPortfolio(uid: string): void {
        this.getNosUserPortolio(uid).subscribe();
        console.log('getUserPortfolio', uid);
        // This continuously updates the subscription
        this.db.object(`/portfolios/${uid}`)
            .subscribe((result) => {
                console.log('portfolio', result);
                if (result.$exists()) {
                    this._userPortfolio$.next(result);
                } else {
                    this.createPortfolio(uid);
                }
            });
    }

    private createPortfolio(uid: string): void {
        console.log('createPortfolio', uid);
        // Get current auth state and create user based on that
        this.authData.authState
            .filter(user => user !== null && user !== undefined)
            .take(1)
            .subscribe(user => {
                const options = {
                    displayName: user.displayName || undefined,
                    imageUrl: user.photoURL || undefined
                };
                let newPortfolio = new Portfolio(uid, options);
                console.log('newPortfolio', newPortfolio);
                // Set the new /portfolio with the uid as key
                this.db.object(`/portfolios/${uid}`)
                    .set(newPortfolio);
            });
    }

}
