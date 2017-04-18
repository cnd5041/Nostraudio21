import { Component, Input, OnInit } from '@angular/core';
//import { INosArtist } from '../../models/artists.models';

@Component({
  selector: 'artist-list-item',
  templateUrl: 'artist-list-item.html'
})
export class ArtistListItem implements OnInit {
  //@Input() artist: INosArtist;
  @Input() artist: any;

  constructor() {

  }

  ngOnInit() { }

}
