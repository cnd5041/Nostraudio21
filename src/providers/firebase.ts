import { Injectable } from '@angular/core';

import {
    IGenre, IDbArtist, IArtistEntityList, IGenreEntityList,
    IGenresPerArtistEntityList, IFollowsPerArtistEntityList,
    IStockholdersPerArtistEntity, IStockholdersPerArtistItem, IFollowsPerArtistEntity,
    IDbPortfolio, constructPortfolio, Portfolio,
    IReferenceDictionary, ISharesPerPortfolioItem, IArtistFollowsPerUserItem,
    IFollowsPerArtistItem, IDbTransaction, INosPortfolio, INosArtist, NosTransaction, nosArtistFromDbArtist
} from '../models';

import { AuthData } from '../providers/auth-data';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// Library Imports
import lodash from 'lodash';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromStore from '../app/store';

@Injectable()
export class FirebaseProvider {
    artists: Observable<IArtistEntityList>;
    genres: Observable<IGenreEntityList>;
    genresPerArtist: Observable<IGenresPerArtistEntityList>;
    followersPerArtist: Observable<IFollowsPerArtistEntityList>;
    stockholdersPerArtist: Observable<IStockholdersPerArtistEntity>;

    followsPerArtistRef = this.db.list('/followsPerArtist');
    stockholdersPerArtistRef = this.db.list('/stockholdersPerArtist');

    clientArtistsSubs: { [key: string]: Subscription } = {};

    constructor(
        private db: AngularFireDatabase,
        private authData: AuthData,
        private store: Store<fromStore.MusicState>
    ) {

        this.store.select(state => state.artists.activeArtistSubscriptions)
            .subscribe(activeArtistSubscriptions => {
                console.log('activeArtistSubscriptions', activeArtistSubscriptions);
                Object.keys(activeArtistSubscriptions).forEach(key => {
                    // Check if the key is true or false
                    if (activeArtistSubscriptions[key] === true) {
                        // If it's off, turn it on.
                        console.log('start the sub', key);
                        this.setArtistSubscription(key);
                    } else {
                        console.log('stop the sub', key);
                        this.clientArtistsSubs[key].unsubscribe();
                    }
                });
            });

        // https://github.com/angular/angularfire2/blob/5.0.0-rc.6/docs/rtdb/lists.md
        // .valueChanges is for read only
        // .snapshot changes returns key
        // .stateChanges is list of actions
        //    https://github.com/angular/angularfire2/blob/master/docs/version-5-upgrade.md#50-1

        // Artist Refs
        const artistsRef = this.db.list('/artists');
        const genresPerArtistRef = this.db.list('/genresPerArtist');

        // Genre Refs
        const genresRef = this.db.list('/genres');
        const artistsPerGenreRef = this.db.list('/artistsPerGenre');

        // Artists
        // For now, return the entire list
        // Possibly listen for specific things like child_added to manually update store
        this.artists = artistsRef
            .snapshotChanges()
            .map(actions => {
                const artists = actions.map(action => {
                    return ({ firebaseKey: action.key, value: action.payload.val() });
                });
                return lodash.keyBy(artists, 'firebaseKey');
            });

        // Genres
        this.genres = genresRef
            .snapshotChanges()
            .map(actions => {
                const genres = actions.map(action => {
                    return ({ firebaseKey: action.key, value: action.payload.val() });
                });

                return lodash.keyBy(genres, 'firebaseKey');
            });

        // Genres Per Artist
        this.genresPerArtist = genresPerArtistRef
            .snapshotChanges()
            .map(actions => {
                const genresPerArtist = actions.map(action => {
                    return ({ firebaseKey: action.key, value: action.payload.val() });
                });

                return lodash.keyBy(genresPerArtist, 'firebaseKey');
            });

        // Followers Per Artist
        this.followersPerArtist = this.followsPerArtistRef
            .snapshotChanges()
            .map(actions => {
                const entityMap = actions.map(action => {
                    return ({ firebaseKey: action.key, value: action.payload.val() });
                });

                return lodash.keyBy(entityMap, 'firebaseKey');
            });

        // Stockholders Per Artist
        this.stockholdersPerArtist = this.stockholdersPerArtistRef
            .snapshotChanges()
            .map(actions => {
                const entityMap = actions.map(action => {
                    return ({ firebaseKey: action.key, value: action.payload.val() });
                });

                return lodash.keyBy(entityMap, 'firebaseKey');
            });

    }

    // Set the Artist Subscription, which will dispatch SetClientArtist
    setArtistSubscription(spotifyId: string): void {
        // If there is no open sub, open one
        if (!this.clientArtistsSubs[spotifyId] || this.clientArtistsSubs[spotifyId].closed === true) {
            const artistRef = this.db.object<IDbArtist>(`/artists/${spotifyId}`)
                .valueChanges();
            const stockholdersPerArtist = this.db.object<IReferenceDictionary>(`/stockholdersPerArtist/${spotifyId}`)
                .valueChanges();

            this.clientArtistsSubs[spotifyId] = Observable.combineLatest(artistRef, stockholdersPerArtist)
                .subscribe((result) => {
                    const artist = result[0];
                    const stockholdersPerArtist = result[1];
                    const nosArtist = nosArtistFromDbArtist(artist, stockholdersPerArtist);

                    // Update the marketPrice if necessary
                    // TODO: Move to server function
                    const oldPrice = artist.marketPrice;
                    const newPrice = nosArtist.marketPrice;
                    if (oldPrice !== newPrice) {
                        this.db.object<IDbArtist>(`/artists/${spotifyId}`)
                            .update({ marketPrice: newPrice });
                    }
                    this.store.dispatch(new fromStore.SetClientArtist(nosArtist));
                });
        } else {
            console.log('artist sub already set', spotifyId);
        }
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

    getUserPortfolio(uid: string): Observable<INosPortfolio> {
        const portfolioSource = this.db.object<IDbPortfolio>(`/portfolios/${uid}`)
            .valueChanges();
        const sharePerPortolioSource = this.db.object<ISharesPerPortfolioItem>(`/sharesPerPortfolio/${uid}`)
            .valueChanges();
        const artistFollowsPerPortolioSource = this.db.object<IArtistFollowsPerUserItem>(`/artistFollowsPerUser/${uid}`)
            .valueChanges();

        const stream = Observable.combineLatest(
            portfolioSource,
            sharePerPortolioSource,
            artistFollowsPerPortolioSource
        );

        return stream.map(queriedItems => {
            const portfolio = queriedItems[0];
            const sharesPerPortfolio = queriedItems[1];
            const artistFollowsPerUser = queriedItems[2];

            if (portfolio) {
                const nosPortfolio = constructPortfolio(portfolio, sharesPerPortfolio, artistFollowsPerUser);
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
        shareCount = lodash.toInteger(shareCount);
        const total = lodash.round((price * shareCount), 2);
        const newBalance = lodash.round((portfolio.balance - total), 2);
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
        shareCount = lodash.toInteger(shareCount);
        const total = lodash.round((price * shareCount), 2);
        const newBalance = lodash.round((portfolio.balance + total), 2);

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
                if (!lodash.isNull(updatedShareCount)) {
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
                if (!lodash.isNull(updatedShareCount)) {
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
