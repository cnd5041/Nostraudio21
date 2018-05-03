import { Injectable } from '@angular/core';

// App Imports
import * as models from '../models';
import { NosSpotifyService } from './spotify-service';

// NGRX
import { Store } from '@ngrx/store';
import * as fromStore from '../store';

// Library Imports
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { map } from 'rxjs/operators';
import { camelCase } from 'lodash';
import { AngularFireDatabase } from 'angularfire2/database';


@Injectable()
export class ArtistService {

    private _searchResults: BehaviorSubject<models.INosArtist[]>;
    searchResults: Observable<models.INosArtist[]>;

    constructor(
        private spotifyService: NosSpotifyService,
        private db: AngularFireDatabase,
        // private store: Store<fromStore.MusicState>
    ) {
        this._searchResults = <BehaviorSubject<models.INosArtist[]>>new BehaviorSubject([]);
        this.searchResults = this._searchResults.asObservable();
    }

    search(term: string): void {
        // Call the spotify Search function and filter to wanted results
        this.spotifyService.searchArtists(term)
            .pipe(
                map(results => {
                    return results.filter(x => x.spotifyPopularity > 5 && x.spotifyFollowers > 250);
                })
            ).subscribe(
                (results) => this._searchResults.next(results),
                (error) => {
                    // this.store.dispatch(new fromStore.ShowToast({
                    //     message: 'There was a problem with the search.',
                    //     position: 'top',
                    //     duration: 4000
                    // }));
                });
    }

    clearSearchResults(): void {
        this._searchResults.next([]);
    }

    createArtist(spotifyId) {
        console.log('createArtist service');
        // TODO: make sure I update the firebase artist with this info sometimes
        return this.spotifyService.getArtistById(spotifyId)
            .switchMap((result) => {
                console.log('switchMap');

                const newArtist = models.dbArtistFromSpotifyArtist(result);

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


}
