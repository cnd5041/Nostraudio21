import { Injectable } from '@angular/core';

// App Imports
import {
    IDbGenre, IDbArtist,
    IStockholdersPerArtistItem,
    IDbPortfolio, constructPortfolio, DbPortfolio,
    IReferenceDictionary, ISharesPerPortfolioItem, IDbArtistFollowsPerUserItem,
    IFollowsPerArtistItem, IDbTransaction, INosPortfolio, NosTransaction, nosArtistFromDbArtist, IPortfolioShare,
    ICountReferenceDictionary,
    IDbGenreMap,
    IGenresPerArtistMap,
    IArtistsPerGenreMap,
    IFollowersPerArtistMap,
    IDbGenreNameMap,
    INosArtist,
    dbArtistFromSpotifyArtist,
    INosPortfolioWithArtists
} from '../models';
import { AuthData } from './auth-data';
import { NosSpotifyService } from './spotify-service';
// Library Imports
import { startCase, toInteger, round, isNull, forOwn, camelCase } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import {
    map, catchError, withLatestFrom, take, switchMap, combineLatest
} from 'rxjs/operators';
// Angular Fire Imports
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { DataSnapshot } from '@firebase/database-types';

@Injectable()
export class NosFirebaseService {
    // Artist Observables
    // TODO: only count true followers
    private followersPerArtist$: Observable<IFollowersPerArtistMap>;

    // Artist References
    private genresPerArtistRef = this.db.list<IReferenceDictionary>('/genresPerArtist');
    private followsPerArtistRef = this.db.list<IReferenceDictionary>('/followsPerArtist');
    private stockholdersPerArtistRef = this.db.list<ICountReferenceDictionary>('/stockholdersPerArtist');
    private artistsRef = this.db.list<IDbArtist>('/artists', ref => ref.orderByKey());

    // Genres
    private genresRef = this.db.list<IDbGenre>('/genres');
    public genresList$: Observable<IDbGenreMap>;
    private artistsPerGenreRef = this.db.list<IReferenceDictionary>('/artistsPerGenre');
    public artistsPerGenre$: Observable<any>;

    private _nosArtists: Subject<{ key: string, artist: INosArtist }> = new Subject();
    public nosArtists$: Observable<{ key: string, artist: INosArtist }> = this._nosArtists.asObservable();

    constructor(
        private db: AngularFireDatabase,
        private authData: AuthData,
        private spotifyService: NosSpotifyService
    ) {

        // https://github.com/angular/angularfire2/blob/5.0.0-rc.6/docs/rtdb/lists.md
        // .valueChanges is for read only
        // .snapshot changes returns key
        // .stateChanges is list of actions
        //    https://github.com/angular/angularfire2/blob/master/docs/version-5-upgrade.md#50-1

        this.artistsRef
            .stateChanges(['child_added'])
            .subscribe(change => {
                this.setNosArtistSubs(change.key);
            });

        // Genres
        this.genresList$ = this.genresRef
            .snapshotChanges()
            .pipe(
                map((actions) => this.mapValueToKey(actions))
            );

        // // Genres Per Artist
        this.artistsPerGenre$ = this.artistsPerGenreRef
            .snapshotChanges()
            .pipe(
                map((actions) => this.mapValueToKey(actions))
            );

        // Followers Per Artist
        this.followersPerArtist$ = this.followsPerArtistRef
            .snapshotChanges()
            .pipe(
                map((actions: AngularFireAction<DataSnapshot>[]) => this.mapValueToKey(actions))
            );
    }

    private mapValueToKey(actions: AngularFireAction<any>[]): any {
        const map = {};
        actions.forEach((action) => {
            map[action.key] = action.payload.val();
        });
        return map;
    }

    private setNosArtistSubs(artistKey: string): void {
        const artists = this.db.object<IDbArtist>(`/artists/${artistKey}`)
            .valueChanges();
        const stockholdersPerArtist = this.db.object<ICountReferenceDictionary>(`/stockholdersPerArtist/${artistKey}`)
            .valueChanges();
        const genres = this.genresList$
            .pipe(take(1));

        const genresPerArtist = this.db.object<IReferenceDictionary>(`/genresPerArtist/${artistKey}`)
            .valueChanges()
            .pipe(
                withLatestFrom(genres),
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
            // TODO:
            // Update the marketPrice if necessary
            // TODO: Move to server function
            // const oldPrice = artist.marketPrice;
            // const newPrice = nosArtist.marketPrice;

            // Create nos artists
            const nosArtist = nosArtistFromDbArtist(artist, stockholdersPerArtist, genresPerArtist);
            // Update the store
            this._nosArtists.next({ key: artistKey, artist: nosArtist });
        });
    }

    genresByArtist(spotifyId: string): Observable<any[]> {
        return this.db.list<any>(`/genresPerArtist/${spotifyId}`).valueChanges();
    }

    // Keyed by artist id
    followsPerArtistByArtistId(spotifyId: string): Observable<IFollowsPerArtistItem> {
        return this.db.object<any>(`/followsPerArtist/${spotifyId}`).snapshotChanges()
            .map(action => {
                if (action.key) {
                    return { firebaseKey: action.key, value: action.payload.val() };
                } else {
                    return null;
                }
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
    private getSharesPerPortfolio(uid: string): Observable<IPortfolioShare[]> {
        return this.db.object<ISharesPerPortfolioItem>(`/sharesPerPortfolio/${uid}`)
            .valueChanges()
            .pipe(
                map((shares): IPortfolioShare[] => {
                    return Object.keys(shares).map((key) => {
                        return { sharesCount: shares[key], artistKey: key };
                    });
                })
            );
    }

    // Get transactions and the artist
    getTransactionsPerPortfolio(uid: string): Observable<IDbTransaction[]> {
        return this.db.list<IDbTransaction>('/transactions', ref => ref.orderByChild('portfolioId').equalTo(uid))
            .snapshotChanges()
            .pipe(
                map((actions: AngularFireAction<DataSnapshot>[]) => {
                    // Add the firebase key
                    return actions.map((action) => {
                        return {
                            ...action.payload.val(),
                            firebaseKey: action.key
                        };
                    });
                }),
                map((transactions: IDbTransaction[]) => transactions.filter(t => t.isHidden !== true)),
                map((transactions: IDbTransaction[]) => {
                    return transactions.map(t => {
                        return {
                            ...t,
                            action: startCase(t.action),
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

        const artistFollowsPerPortfolioSource = this.db.object<IDbArtistFollowsPerUserItem>(`/artistFollowsPerUser/${uid}`)
            .valueChanges();

        const transactionsSource = this.getTransactionsPerPortfolio(uid);

        const stream = Observable.combineLatest(
            portfolioSource,
            sharesPerPortolioSource,
            artistFollowsPerPortfolioSource,
            transactionsSource
        );

        return stream.map(([portfolio, sharesPerPortfolio, artistFollowsPerUser, transactions]) => {
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
                const newPortfolio = new DbPortfolio(uid, options);
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

    public checkSpotifyId(spotifyId: string): Observable<boolean> {
        return this.db.object<IDbArtist>(`/artists/${spotifyId}`)
            .valueChanges()
            .pipe(
                take(1),
                catchError((error) => {
                    console.error('artist valueChanges error', error);
                    return Observable.throw(error);
                })
            ).switchMap((artist: IDbArtist) => {
                // Create if null
                if (isNull(artist)) {
                    console.log('call create artist!');

                    return this.createArtist(spotifyId)
                        .pipe(
                            switchMap((result) => {
                                console.log('create result!');
                                return Observable.of(true);
                            }),
                            catchError((error) => {
                                console.error('createArtist error catch', error);
                                return Observable.throw(error);
                            })
                        );
                } else {
                    return Observable.of(true);
                }
            });
    }

    createArtist(spotifyId) {
        console.log('createArtist service');
        // TODO: make sure I update the firebase artist with this info sometimes
        return this.spotifyService.getArtistById(spotifyId)
            .switchMap((result) => {
                const newArtist = dbArtistFromSpotifyArtist(result);
                console.log('create this artist', newArtist);
                // set seperately
                // genres, portoflio follows, portfolios
                const updates = {};
                // Set the Artist
                updates[`/artists/${spotifyId}`] = newArtist;
                // Set Genre and add artist to Genre list
                result.spotifyGenres.forEach((genre) => {
                    const genreKey = camelCase(genre);
                    // Set the genre name in genre list
                    updates[`/genres/${genreKey}/name`] = genre;
                    // Set the genres artist list in association node
                    // updates[`/genres/${genreKey}/artists/${spotifyId}`] = true;
                    updates[`/artistsPerGenre/${genreKey}/${spotifyId}`] = true;
                    // Set the artist's genres in association node
                    updates[`/genresPerArtist/${spotifyId}/${genreKey}`] = true;
                });
                // Perform the updates
                this.db.object('/').update(updates);

                return Observable.empty();
            });
    }

    getPortfoliosByIds(keys: string[]): Observable<IDbPortfolio[]> {
        const subs = keys.map((key) => {
            return this.db.object<IDbPortfolio>(`/portfolios/${key}`).valueChanges().take(1);
        });
        return subs.length > 0 ? Observable.combineLatest(subs) : Observable.of([]);
    }

    getFullPortfolio(portfolioId: string): Observable<INosPortfolioWithArtists> {
        return Observable.of(null);

        // getNosPortfolio, //getUserPortfokio

        // getSharesWithArtists,
        // getFollowingNosArtists,
        // getTransactionsWithArtists,
        // (portfolio, shares, following, transactions): INosPortfolioWithArtists => {
        //     if (portfolio) {
        //         return NosPortfolioWithArtists(portfolio, shares, following, transactions);
        //     } else {
        //         return null;
        //     }
        // }
    }

}
