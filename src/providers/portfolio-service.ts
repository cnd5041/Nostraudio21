import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Subject, BehaviorSubject, Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


import { IPortfolio, Portfolio } from '../models';
import { AuthData } from '../providers/';


@Injectable()
export class PortfolioService {
    private _userPortfolio$: BehaviorSubject<IPortfolio> = new BehaviorSubject(undefined);
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
        private authData: AuthData
    ) {
        // const path = `/portfolios/${auth.id}`;

        // Set up userPortfolio Observable - emit all defined results
        this.userPortfolio$ = this._userPortfolio$.asObservable()
            .filter(data => data !== undefined);
    }

    getUserPortfolio(uid: string): void {
        console.log('getUserPortfolio', uid);
        // This continuously updates the subscription
        this.db.object('/portfolios/' + uid)
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

    // //Example of getting list
    // examples() {
    //   //List 
    //   // this.af.database.list('items').subscribe(items => console.log(items));
    //   // //1 item - where 1 is the id
    //   // this.af.database.object('items/1').subscribe(items => console.log(items));

    //   //Not having to subscribe
    //   // this.exampleItem = this.af.database.object('items/1');
    //   //rtFYvr3Q3YM5ULh0kWzpUXBKh5b2

    //   //Filter Example
    //   // let exampleFilter: Observable<any> = this.af.database.list('items')
    //   //   .map(items => {
    //   //     return items.filter(item => item.name === 'Jeff');
    //   //   })
    //   //   .do(item => console.log('good for debugs - but bad practice', item));
    // }

    // // getExamplePortfolio(): FirebaseObjectObservable<any> {
    // getExamplePortfolio(): any {
    //   return this.exampleItem;
    // }

}
