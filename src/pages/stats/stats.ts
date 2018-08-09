import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController } from 'ionic-angular';
// Store imports
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';
import { INosArtist, filterByValues } from '../../models';
import { ArtistPage } from '../../pages';
// Library Imports
import { orderBy } from 'lodash';
import { Subject } from "rxjs/Subject";
import {
    takeUntil, combineLatest, debounceTime
} from 'rxjs/operators';

@Component({
    selector: 'page-stats',
    templateUrl: 'stats.html'
})
export class StatsPage {
    private unsubscribe: Subject<any> = new Subject();
    public primarySort: 'marketPrice' | 'marketCap' = 'marketPrice';
    public _primarySort: 'marketPrice' | 'marketCap' = 'marketPrice';
    public primarySortDir: 'asc' | 'desc' = 'desc';
    public artists: INosArtist[] = [];
    public _artists: INosArtist[] = [];

    public genres;
    public artistRanks;

    public searchControl = new FormControl();

    constructor(
        public navCtrl: NavController,
        public store: Store<fromStore.MusicState>
    ) {

    }

    ionViewDidLoad() {
        // Genres
        this.store.select(fromStore.getGenresArray)
            .pipe(
                takeUntil(this.unsubscribe)
            ).subscribe(state => {
                this.genres = state;
            });

        // Artist Ranks
        this.store.select(fromStore.getArtistsRankMap)
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(state => {
                this.artistRanks = state;
            });

        // Artists
        this.store.select(fromStore.getArtistsArray)
            .pipe(
                takeUntil(this.unsubscribe),
                combineLatest(this.store.select(fromStore.getGenreFilteredArtists))
            )
            .subscribe(([artists, filteredArtists]) => {
                // Filter if needed
                if (filteredArtists) {
                    this.artists = filterByValues(this.artists, 'spotifyId', filteredArtists);
                } else {
                    this.artists = artists;
                }
                console.log('artists', this.artists);
                this._artists = this.artists;

                this.setList();
            });

        // Searching
        this.searchControl.valueChanges
            .pipe(
                takeUntil(this.unsubscribe),
                debounceTime(200)
            )
            .subscribe(v => this.search(v));
    }

    ionViewWillUnload() {
        // End Subscriptions
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    setList(): void {
        // this.artists = orderBy(this.artists, ['s1', 's2'], ['asc', 'desc']);
        this.artists = orderBy(this.artists, [this.primarySort], [this.primarySortDir]);
    }

    primarySortChanged(): void {
        this.setList();
    }

    segmentClick(): void {
        if (this._primarySort === this.primarySort) {
            this.primarySortDir = this.primarySortDir === 'asc' ? 'desc' : 'asc';
        }
        this._primarySort = this.primarySort;
        this.setList();
    }

    onArtistSelect(spotifyId: string): void {
        this.navCtrl.push(ArtistPage, { spotifyId: spotifyId });
    }

    onGenreChange(event: string[]): void {
        this.store.dispatch(new fromStore.SetGenresFilter(event));
    }

    getRank(spotifyId: string): number {
        if (this.primarySort === 'marketPrice') {
            return this.artistRanks[spotifyId].marketPriceRank;
        } else if (this.primarySort === 'marketCap') {
            return this.artistRanks[spotifyId].marketCapRank;
        }
    }

    search(val: string): void {
        // If string is not empty, search, otherwise, clear the results
        if (val && val.length > 0) {
            const re = new RegExp(val, 'gi');
            this.artists = this._artists.filter((a) => {
                return a.name.match(re);
            });
        } else {
            this.artists = this._artists;
        }
        this.setList();
    }

}
