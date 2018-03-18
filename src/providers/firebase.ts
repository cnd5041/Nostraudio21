import { Injectable } from '@angular/core';

import {
    IDbGenre, IDbArtist,
    IStockholdersPerArtistItem,
    IDbPortfolio, constructPortfolio, Portfolio,
    IReferenceDictionary, ISharesPerPortfolioItem, IArtistFollowsPerUserItem,
    IFollowsPerArtistItem, IDbTransaction, INosPortfolio, INosArtist, NosTransaction, nosArtistFromDbArtist, IPortfolioShare,
    ICountReferenceDictionary,
    IDbArtistMap,
    IDbGenreMap,
    IGenresPerArtistMap,
    IFollowersPerArtistMap,
    IStockholdersPerArtistMap,
    IDbGenreNameMap
} from '../models';

import { AuthData } from '../providers/auth-data';

import { AngularFireDatabase, AngularFireList, AngularFireAction } from 'angularfire2/database';
// import { DataSnapshot } from '@firebase/database';
// Library Imports
import { keyBy, startCase, toInteger, round, isNull, forOwn, keysIn } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import {
    map, switchMap, catchError, tap, withLatestFrom, filter, take, skip,
    share, shareReplay
} from 'rxjs/operators';
// NGRX
import { Store } from '@ngrx/store';
import * as fromStore from '../app/store';

import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class FirebaseProvider {
    // Artist Observables
    // private artists: Observable<IDbArtistMap>;
    private artists: BehaviorSubject<IDbArtistMap> = new BehaviorSubject(null);
    private genresPerArtist: Observable<IGenresPerArtistMap>;
    // TODO: only count true followers
    private followersPerArtist: Observable<IFollowersPerArtistMap>;
    // private stockholdersPerArtist: Observable<IStockholdersPerArtistMap>;
    private stockholdersPerArtist: BehaviorSubject<IStockholdersPerArtistMap> = new BehaviorSubject(null);
    // Artist References
    // artistsRef = this.db.list<IDbArtist>('/artists');
    artistsRef = this.db.list<IDbArtist>('/artists', ref => ref.orderByKey());
    genresPerArtistRef = this.db.list<IReferenceDictionary>('/genresPerArtist');
    followsPerArtistRef = this.db.list<IReferenceDictionary>('/followsPerArtist');
    stockholdersPerArtistRef = this.db.list<ICountReferenceDictionary>('/stockholdersPerArtist');

    // Genre Observables
    // genres: Observable<IDbGenreMap>;
    private genres: BehaviorSubject<IDbGenreMap> = new BehaviorSubject(null);
    // Genre Refs
    genresRef = this.db.list<IDbGenre>('/genres');
    artistsPerGenreRef = this.db.list<IReferenceDictionary>('/artistsPerGenre');

    // TODO: remove
    clientArtistsSubs: { [key: string]: Subscription } = {};

    constructor(
        private db: AngularFireDatabase,
        private authData: AuthData,
        private store: Store<fromStore.MusicState>
    ) {

        // https://github.com/angular/angularfire2/blob/5.0.0-rc.6/docs/rtdb/lists.md
        // .valueChanges is for read only
        // .snapshot changes returns key
        // .stateChanges is list of actions
        //    https://github.com/angular/angularfire2/blob/master/docs/version-5-upgrade.md#50-1


        // Artists
        this.artistsRef
            .snapshotChanges()
            .pipe(
                map((actions) => this.mapValueToKey(actions))
            ).subscribe((value: IDbArtistMap) => {
                this.artists.next(value);
            });

        // Stockholders Per Artist
        this.stockholdersPerArtistRef
            .snapshotChanges()
            .pipe(
                map((actions) => this.mapValueToKey(actions))
            ).subscribe((value: IStockholdersPerArtistMap) => {
                this.stockholdersPerArtist.next(value);
            });

        // Genres
        this.genresRef
            .snapshotChanges()
            .pipe(
                map((actions) => this.mapValueToKey(actions))
            ).subscribe((value: IDbGenreMap) => {
                this.genres.next(value);
            });

        // Genres Per Artist
        this.genresPerArtist = this.genresPerArtistRef
            .snapshotChanges()
            .pipe(
                map((actions) => this.mapValueToKey(actions))
            );

        // Followers Per Artist
        this.followersPerArtist = this.followsPerArtistRef
            .snapshotChanges()
            .pipe(
                map((actions) => this.mapValueToKey(actions))
            );

        this.addArtistChildren();
    }

    private mapValueToKey(actions: AngularFireAction<any>[]) {
        const map = {};
        actions.forEach((action) => {
            map[action.key] = action.payload.val();
        });
        return map;
    }

    addArtistChildren(): void {
        this.artistsRef
            .stateChanges(['child_added'])
            .subscribe(change => {
                this.setNosArtistSubs(change.key);
            });
    }

    setNosArtistSubs(artistKey: string): void {
        const artists = this.db.object<IDbArtist>(`/artists/${artistKey}`)
            .valueChanges();
        const stockholdersPerArtist = this.db.object<ICountReferenceDictionary>(`/stockholdersPerArtist/${artistKey}`)
            .valueChanges();
        const genresPerArtist = this.db.object<IReferenceDictionary>(`/genresPerArtist/${artistKey}`)
            .valueChanges()
            .pipe(
                withLatestFrom(this.genres),
                map(([genresPerArtist, genres]): IDbGenreNameMap => {
                    const genresMap = {};
                    forOwn(genresPerArtist, (value, key) => {
                        genresMap[key] = genres[key].name;
                    });
                    return genresMap;
                })
            );

        Observable.combineLatest(
            artists,
            stockholdersPerArtist,
            genresPerArtist,
        ).subscribe(([artist, stockholdersPerArtist, genresPerArtist]) => {
            // Update the marketPrice if necessary
            // TODO: Move to server function
            // const oldPrice = artist.marketPrice;
            // const newPrice = nosArtist.marketPrice;
            // const genresMap = {};
            // forOwn(genresPerArtist, (value, key) => {
            //     genresMap[key] = genres[key].name;
            // });
            // Create nos artists
            const nosArtist = nosArtistFromDbArtist(artist, stockholdersPerArtist, genresPerArtist);
            // Update the store
            // this.store.dispatch(new fromStore.ArtistMapAdd({ key: artistKey, artist: nosArtist }));
            this.store.dispatch(new fromStore.ArtistMapAdd({key: artistKey, artist: nosArtist}));
        });
    }

    getArtistList() {
        /*
            have some main centric calls, portfolio, artist, only drive updates with changes to the main call
            do the look up tables and stuff in the firebase, then put that in the store
            make it easy to trigger update calls
            make sure it's easy to get the artist related to each genre

            I have all the basic stuff set up.
            Map an artist object that combines all the lookup tables genres
            make sure only updates to 'artists' are driving the push to the store

            when I do the portfolio and artist combinations, just do that in selectors
            use the portfolio artist ids, then use that against the artists list


            leaving off: figure out what store subscriptions to set and how often.
            see if there would be a way to limit it to certain artists,
            try to keep in mind it may have a ton of updates if I watch everything.
            do new setters, then clean up the existing stuff
        */

    }

    genresByArtist(spotifyId: string): Observable<any[]> {
        return this.db.list<any>(`/genresPerArtist/${spotifyId}`).valueChanges();
    }

    // Keyed by artist id
    followsPerArtistByArtistId(spotifyId: string): Observable<IFollowsPerArtistItem> {
        return this.db.object<any>(`/followsPerArtist/${spotifyId}`).snapshotChanges()
            .map(action => {
                return { firebaseKey: action.key, value: action.payload.val() };
            });
    }

    // Keyed by artist id
    stockholdersPerArtistByArtistId(spotifyId: string): Observable<IStockholdersPerArtistItem> {
        return this.db.object<any>(`/stockholdersPerArtist/${spotifyId}`).snapshotChanges()
            .map(action => {
                return { firebaseKey: action.key, value: action.payload.val() };
            });
    }

    // Get the shares and the artist
    getSharesPerPortfolio(uid: string): Observable<IPortfolioShare[]> {
        return this.db.object<ISharesPerPortfolioItem>(`/sharesPerPortfolio/${uid}`)
            .valueChanges()
            .pipe(
                withLatestFrom(this.artists),
                map(([shares, artists]): IPortfolioShare[] => {
                    if (shares) {
                        return Object.keys(shares).reduce((accum: any[], current: string) => {
                            // only return if count > 0
                            if (shares[current] > 0) {
                                return [...accum, { sharesCount: shares[current], artist: artists[current] }];
                            } else {
                                return accum;
                            }
                        }, []);
                    } else {
                        return [];
                    }
                })
            );
    }

    // Get transactions and the artist
    getTransactionsPerPortfolio(uid: string): Observable<IDbTransaction[]> {
        return this.db.list<IDbTransaction>('/transactions', ref => ref.orderByChild('portfolioId').equalTo(uid))
            .snapshotChanges()
            .pipe(
                map((actions) => {
                    // Add the firebase key
                    return actions.map((action) => {
                        return {
                            ...action.payload.val(),
                            firebaseKey: action.key
                        };
                    });
                }),
                map((transactions: IDbTransaction[]) => transactions.filter(t => t.isHidden !== true)),
                withLatestFrom(this.artists),
                map(([transactions, artists]) => {
                    return transactions.map(t => {
                        return {
                            ...t,
                            action: startCase(t.action),
                            artist: artists[t.artistId]
                        };
                    });
                }),
                catchError((error) => {
                    console.error('transactionsSource', error);
                    return Observable.throw(error);
                })
            );
    }

    getUserPortfolio(uid: string): Observable<INosPortfolio> {
        const portfolioSource = this.db.object<IDbPortfolio>(`/portfolios/${uid}`)
            .valueChanges();

        const sharesPerPortolioSource = this.getSharesPerPortfolio(uid);

        const artistFollowsPerPortolioSource = this.db.object<IArtistFollowsPerUserItem>(`/artistFollowsPerUser/${uid}`)
            .valueChanges();

        const transactionsSource = this.getTransactionsPerPortfolio(uid);

        const stream = Observable.combineLatest(
            portfolioSource,
            sharesPerPortolioSource,
            artistFollowsPerPortolioSource,
            transactionsSource
        );

        return stream.map((queriedItems) => {
            const portfolio = queriedItems[0];
            const sharesPerPortfolio = queriedItems[1];
            const artistFollowsPerUser = queriedItems[2];
            const transactions = queriedItems[3];

            if (portfolio) {
                const nosPortfolio = constructPortfolio(portfolio, sharesPerPortfolio, artistFollowsPerUser, transactions);
                return nosPortfolio;
            } else {
                return null;
            }
        });
    }

    createPortfolio(uid: string): void {
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
                const newPortfolio = new Portfolio(uid, options);
                console.log('newPortfolio', newPortfolio);
                // // Set the new /portfolio with the uid as key
                this.db.object(`/portfolios/${uid}`)
                    .set(newPortfolio);
            });
    }

    hideTransaction(firebaseKey: string): void {
        this.db.object(`/transactions/${firebaseKey}`).update({ isHidden: true });
    }

    followArtist(artistKey: string, portfolioKey: string, action: 'follow' | 'unfollow'): void {
        const updates = {};
        const value = action === 'follow' ? true : false;
        // Add to list track all users following an artist
        updates[`/followsPerArtist/${artistKey}/${portfolioKey}`] = value;
        // Add to list to track which artists a user is following
        updates[`/artistFollowsPerUser/${portfolioKey}/${artistKey}`] = value;
        // Perform the updates
        this.db.object('/').update(updates);
    }

    userBuyArtist(portfolio: INosPortfolio, artistKey: string, shareCount: number = 0, price: number): Observable<boolean> {
        shareCount = toInteger(shareCount);
        const total = round((price * shareCount), 2);
        const newBalance = round((portfolio.balance - total), 2);
        // Safety Checks:
        // If no shares - do not continue
        if (shareCount < 1) {
            return Observable.throw('Cannot Complete Transaction: Cannot buy 0 shares.');
        }
        // If new balance will be negative - do not continue
        if (newBalance < 0) {
            return Observable.throw('Cannot Complete Transaction: Balance would be negative.');
        }
        // Record the Transaction
        const transaction: IDbTransaction = new NosTransaction(artistKey, portfolio.userProfile, shareCount, total, 'buy');
        this.db.list('/transactions').push(transaction);
        // Add Shares to Portfolio
        this.updateSharesPerPortfolio(artistKey, portfolio.userProfile, shareCount, 'add');
        // Add Shares to Artist
        this.updateStockholdersPerArtist(artistKey, portfolio.userProfile, shareCount, 'add');
        // Update Portfolio Balance
        this.db.object(`/portfolios/${portfolio.userProfile}`).update({ balance: newBalance });

        return Observable.of(true);
    }

    userSellArtist(portfolio: INosPortfolio, artistKey: string, shareCount: number = 0, price: number): Observable<boolean> {
        shareCount = toInteger(shareCount);
        const total = round((price * shareCount), 2);
        const newBalance = round((portfolio.balance + total), 2);

        if (shareCount < 1) {
            return Observable.throw('Cannot Complete Transaction: Cannot sell 0 shares.');
        }

        // Record the Transaction
        const transaction: IDbTransaction = new NosTransaction(artistKey, portfolio.userProfile, shareCount, total, 'sell');
        this.db.list('/transactions').push(transaction);
        // Add Shares to Portfolio
        this.updateSharesPerPortfolio(artistKey, portfolio.userProfile, shareCount, 'subtract');
        // Add Shares to Artist
        this.updateStockholdersPerArtist(artistKey, portfolio.userProfile, shareCount, 'subtract');
        // Update Portfolio Balance
        this.db.object(`/portfolios/${portfolio.userProfile}`).update({ balance: newBalance });

        return Observable.of(true);
    }

    updateSharesPerPortfolio(artistId: string, portfolioId: string, numberOfShares: number, operator: 'add' | 'subtract'): void {
        this.db.object<number>(`/sharesPerPortfolio/${portfolioId}/${artistId}`)
            .valueChanges()
            .take(1)
            .subscribe(sharesPerPortfolio => {
                let updatedShareCount = sharesPerPortfolio;
                // If they already have shares - update the count
                if (!isNull(updatedShareCount)) {
                    if (operator === 'add') {
                        updatedShareCount += numberOfShares;
                    } else {
                        updatedShareCount -= numberOfShares;
                    }
                } else {
                    updatedShareCount = numberOfShares;
                }
                // Update the endpoint with the share count
                this.db.object(`/sharesPerPortfolio/${portfolioId}/${artistId}`)
                    .set(updatedShareCount);
            });
    }

    updateStockholdersPerArtist(artistId: string, portfolioId: string, numberOfShares: number, operator: 'add' | 'subtract'): void {
        this.db.object<number>(`/stockholdersPerArtist/${artistId}/${portfolioId}`)
            .valueChanges()
            .take(1)
            .subscribe(stockholdersPerArtist => {
                let updatedShareCount = stockholdersPerArtist;
                // If they already have shares - update the count
                if (!isNull(updatedShareCount)) {
                    if (operator === 'add') {
                        updatedShareCount += numberOfShares;
                    } else {
                        updatedShareCount -= numberOfShares;
                    }
                } else {
                    updatedShareCount = numberOfShares;
                }
                // Update the endpoint with the share count
                this.db.object(`/stockholdersPerArtist/${artistId}/${portfolioId}`)
                    .set(updatedShareCount);
            });
    }

}
