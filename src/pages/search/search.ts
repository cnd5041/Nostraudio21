import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { ArtistService } from '../../providers/artist-service';

import { INosArtist } from '../../models/artist.model';
import { ArtistPage } from '../../pages/artist/artist';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  results: Observable<INosArtist[]>;

  constructor(
    private navCtrl: NavController,
    private artistService: ArtistService
  ) {

  }

  ionViewDidLoad() {
    this.results = this.artistService.searchResults;
  }

  search(event: any): void {
    // http://ionicframework.com/docs/v2/api/components/searchbar/Searchbar/
    const val: string = event.target.value;

    // If string is not empty, search, otherwise, clear the results
    if (val && val.length > 0) {
      this.artistService.search(val);
    } else {
      this.artistService.clearSearchResults();
    }
  }

  onArtistClick(artist: INosArtist): void {
    this.navCtrl.push(ArtistPage, { spotifyId: artist.spotifyId });
  }

}
