import { ActionReducerMap } from '@ngrx/store';

import * as fromArtists from './artists.reducers';
import * as fromGenres from './genres.reducers';
import * as fromPortfolio from './portfolio.reducers';
import * as fromFriends from './friends.reducers';

export interface MusicState {
    artists: fromArtists.ArtistState;
    genres: fromGenres.GenreState;
    portfolio: fromPortfolio.PortfolioState;
    friends: fromFriends.FriendsState;
}

export const reducers: ActionReducerMap<MusicState> = {
    artists: fromArtists.reducer,
    genres: fromGenres.reducer,
    portfolio: fromPortfolio.reducer,
    friends: fromFriends.reducer
};

export const getMusicState = (state: MusicState) => state;
