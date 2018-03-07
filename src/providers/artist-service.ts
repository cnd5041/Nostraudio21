import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import * as models from '../models';

import { NosSpotifyService } from './spotify-service';

import * as _ from 'lodash';

import { AngularFireDatabase } from 'angularfire2/database';


@Injectable()
export class ArtistService {

    private _searchResults: BehaviorSubject<models.INosArtist[]>;
    searchResults: Observable<models.INosArtist[]>;

    constructor(
        private spotifyService: NosSpotifyService,
        private db: AngularFireDatabase
    ) {
        this._searchResults = <BehaviorSubject<models.INosArtist[]>>new BehaviorSubject([]);
        this.searchResults = this._searchResults.asObservable();
    }

    search(term: string): void {
        // Call the spotify Search function and filter to wanted results
        this.spotifyService.searchArtists(term)
            .map(results => {
                return results.filter(x => x.spotifyPopularity > 5 && x.spotifyFollowers > 250);
            })
            .subscribe(
            (results) => this._searchResults.next(results),
            (error) => {
                // TODO: Handle
            });
    }

    clearSearchResults(): void {
        this._searchResults.next([]);
    }

    createArtist(spotifyId) {
        // TODO: make sure I update the firebase artist with this info sometimes
        this.spotifyService.getArtistById(spotifyId)
            .subscribe(result => {
                const newArtist = models.dbArtistFromSpotifyArtist(result);

                console.log('create this artist', newArtist);
                // set seperately
                // genres, portoflio follows, portfolios

                const updates = {};
                // Set the Artist
                updates[`/artists/${spotifyId}`] = newArtist;
                // Set Genre and add artist to Genre list
                result.spotifyGenres.forEach((genre) => {
                    const genreKey = _.camelCase(genre);
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
            });
    }


}
