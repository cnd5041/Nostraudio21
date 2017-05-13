import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { INosArtist, ISpotifyTopTracks, ISpotifyArtist } from '../models/artist.model';

// SpotifyTrack

@Injectable()
export class SpotifyService {
  baseUrl: string = 'https://api.spotify.com/v1/';

  constructor(
    private http: Http
  ) {

  }

  private mapArtistSearch(a: any): ISpotifyArtist {
    var result: ISpotifyArtist = <any>{};
    //result.spotifyName = a.name;
    result.name = a.name;
    result.spotifyId = a.id;
    result.spotifyUri = a.uri;
    result.spotifyUrl = a.external_urls.spotify;
    if (a.external_urls.length > 1) {
      console.log('SPOTIFY HAS MORE THAN 1 URL');
    }
    result.spotifyHref = a.href;
    result.spotifyPopularity = a.popularity;
    result.spotifyFollowers = ((a.followers) ? a.followers.total : null);
    result.spotifyGenres = a.genres || [];
    //result.spotifyGenre = ((a.genres.length) ? a.genres[0] : null);
    result.genre = ((a.genres.length) ? a.genres[0] : null);
    if (a.images.length > 0) {
      result.largeImage = (a.images[0] ? a.images[0].url : '/assets/fallback_artist.png');
      result.mediumImage = (a.images[1] ? a.images[1].url : '/assets/fallback_artist.png');
      result.smallImage = (a.images[2] ? a.images[2].url : '/assets/fallback_artist.png');
    } else {
      result.largeImage = '/assets/fallback_artist.png';
      result.mediumImage = '/assets/fallback_artist.png';
      result.smallImage = '/assets/fallback_artist.png';
    }

    return result;
  }

  searchArtists(name: string): Observable<INosArtist[]> {
    if (name && name.length) {
      let url = `https://api.spotify.com/v1/search?q=${name}&type=artist`;

      //       return this.http.get('https://api.spotify.com/v1/search?q=' + name + '&type=artist')
      //                            'https://api.spotify.com/v1/';      
      // 'https://api.spotify.com/v1/search?q=' + name + '&type=artist'
      return this.http.get(url)
        .map((response: Response) => {
          console.log('response', response.json().artists.items);

          let results: INosArtist[] = response.json().artists.items
            .map((x: any[]) => this.mapArtistSearch(x));
          // .filter((result: INosArtist) => {
          //   return result.spotifyPopularity > 5 && result.spotifyFollowers > 250;
          // });

          return results;
        });
    } else {
      console.warn('Search param was empty');
      return Observable.of([]);
    }
  }

  getArtistTopTracks(spotifyId: string): Observable<ISpotifyTopTracks> {
    //check api for more return options (there are a ton on album)
    let url = this.baseUrl + `artists/${spotifyId}/top-tracks`;

    return this.http.get(url)
      .map((response: Response) => {
        console.log('top tracks', response.json());
        return response.json();
      });

    // this.Spotify.getArtistTopTracks(spotifyId, 'US').then((data) => {
    //   var topTracks: ISpotifyTopTracks = {};
    //   if (data.tracks) {
    // new SpotifyTrack
    //     topTracks.list = _.uniqBy(_.map(data.tracks, trackInfo), 'name');
    //     topTracks.txtList = _.take(_.map(topTracks.list, 'name'), 3).join(", ");
    //   }
    //   defer.resolve(topTracks);
    // }, (error) => {
    //   this.loggingService.logError("Spotify.getArtistTopTracks Error:", error);
    //   defer.reject();
    // });
  };

  getArtistById(spotifyId: string): Observable<ISpotifyArtist> {
    let url = this.baseUrl + `artists/${spotifyId}`;

    return this.http.get(url)
      .map((response: Response) => {
        return this.mapArtistSearch(response.json());
      });
  }

  handleError(error): Observable<any> {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
