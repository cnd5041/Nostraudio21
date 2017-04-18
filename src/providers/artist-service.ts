import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { INosArtist } from '../models/artist.model';
import { SpotifyService } from './spotify-service';
import { FirebaseStore } from './firebase-store';

@Injectable()
export class ArtistService {

  private _searchResults: BehaviorSubject<INosArtist[]>;
  searchResults: Observable<INosArtist[]>;

  private _currentArtist: BehaviorSubject<INosArtist>;
  currentArtist: Observable<INosArtist>;

  private _artists: BehaviorSubject<INosArtist[]>;
  artists: Observable<INosArtist[]>;

  constructor(
    private http: Http,
    private spotifyService: SpotifyService,
    private firebaseStore: FirebaseStore
  ) {
    this._searchResults = <BehaviorSubject<INosArtist[]>>new BehaviorSubject([]);
    this.searchResults = this._searchResults.asObservable();


    this._currentArtist = <any><BehaviorSubject<INosArtist[]>>new BehaviorSubject(null);
    this.currentArtist = this._currentArtist.asObservable();

    this._artists = <any><BehaviorSubject<INosArtist[]>>new BehaviorSubject([]);
    this.artists = this._artists.asObservable();


    this.firebaseStore.artists
      .subscribe(results => {
        console.log('artists list', results);
        this._artists.next(results);
      });
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




}
