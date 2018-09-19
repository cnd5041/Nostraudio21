import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { UserImageComponent } from './user-image/user-image';
import { ArtistListItem } from './artist-list-item/artist-list-item';

@NgModule({
    declarations: [UserImageComponent, ArtistListItem],
    imports: [CommonModule, IonicModule],
    exports: [UserImageComponent, ArtistListItem]
})
export class ComponentsModule { }
