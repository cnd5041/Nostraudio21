import { ActionReducerMap } from '@ngrx/store';

import * as fromArtists from './artists.reducers';

export interface MusicState {
    artists: fromArtists.ArtistState;
}

export const reducers: ActionReducerMap<MusicState> = {
    artists: fromArtists.reducer
};

export const getMusicState = (state: MusicState) => state;
