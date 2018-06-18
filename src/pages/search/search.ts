import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// NGRX
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';
// Libraries
import { Observable } from 'rxjs/Rx';
// App Imports
import { INosArtist } from '../../models/artist.model';
import { ArtistPage } from '../../pages/artist/artist';

@Component({
    selector: 'page-search',
    templateUrl: 'search.html'
})
export class SearchPage {

    results$: Observable<INosArtist[]>;

    constructor(
        private navCtrl: NavController,
        private store: Store<fromStore.MusicState>,
    ) {

    }

    ionViewDidLoad() {
        this.results$ = this.store.select(fromStore.getArtistSearchResults);
    }

    search(event: any): void {
        // http://ionicframework.com/docs/v2/api/components/searchbar/Searchbar/
        const val: string = event.target.value;
        // If string is not empty, search, otherwise, clear the results
        this.store.dispatch(new fromStore.SearchArtists(val));
    }

    onArtistClick(artist: INosArtist): void {
        this.navCtrl.push(ArtistPage, { spotifyId: artist.spotifyId });
    }

}
