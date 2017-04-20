import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Subject, BehaviorSubject, Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
// import { } from 'Firebase';

import {
    AngularFire,
    FirebaseListObservable,
    FirebaseObjectObservable,
    FirebaseObjectFactory
} from 'angularfire2';

import { IPortfolio, Portfolio } from '../models';

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
        private af: AngularFire
    ) {
        // let t: FirebaseObjectObservable<any>;

        // const path = `/portfolios/${auth.id}`;
        this.userPortfolio$ = this._userPortfolio$.asObservable()
            .filter(data => data !== undefined);

        // this.portfolios$ = af.database.list();

        //TODO: decide if I want to subscribe, or call once
        // this.items = af.database.list('/items', {
        //   query: {
        //     orderByChild: 'size',
        //     equalTo: this.sizeSubject
        //   }
        // });
        // this.portfolioQuery$.subscribe(users => {
        //   console.log('userQuery$', users);
        //   this.portfolio.next(users[0]);
        // }); //=> [{name: 'Jim' ... }]

        //this.portfoliosRef.sub
        //this.portfoliosRef.order



        //this.exampleItem = this.af.database.object('userProfile/rtFYvr3Q3YM5ULh0kWzpUXBKh5b2');
    }

    // getPorfolio(uid: string): Observable<any> {
    //   console.log('getPorfolio', uid);
    //   this.userId$.next(uid);

    //   return this.portfolio.asObservable();

    // }

    getUserPortfolio(uid: string): void {
        console.log('getUserPortfolio', uid);

        // this.af.database.object('/portfolios', {
        //   query: {
        //     orderByChild: 'userProfile',
        //     equalTo: uid
        //   }
        // This continuously updates the subscription
        this.af.database.object('/portfolios/' + uid)
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
        let newPortfolio = new Portfolio(uid);
        console.log('createPortfolio', newPortfolio);
        this.af.database.object(`/portfolios/${uid}`)
            .set(newPortfolio);
    }

    // createPortfolio(uid: string): any {
    //   let newPortfolio = {
    //     "balance": 100,
    //     "displayName": "Chris",
    //     "imageUrl": "",
    //     "userProfile:": uid,
    //     "userFullName": "Chris Dixon",
    //     "userProfileLink": "",
    //     "hitCount": "",
    //     "artists": {},
    //     "artistFollows": {},
    //     "achievements": {},
    //     "friends": {}
    //   };
    //   //let itemObservable
    //   //this.af.database.list('/portfolios/' + uid).push(newPortfolio);
    //   // this.af.database.object('/portfolios/' + uid).set(newPortfolio);
    // }

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
