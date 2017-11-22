import { createSelector } from '@ngrx/store';

import * as artist from './artist.actions';


import { IGenre, IDbArtist, IDictionary } from '../../../models';

export interface State {
    artists: IDbArtist[]
}

const initialState: State = {
    artists: []
};

export function reducer(
    state = initialState,
    action: artist.Actions
): State {
    switch (action.type) {
        case artist.FETCH_ARTISTS: {
            return {
                ...state
            };
        }

        case artist.FETCH_ARTISTS_SUCCESS: {
            return {
                ...state,
                artists: action.payload
            };
        }

        default: {
            return state;
        }
    }
}

/**
 * Because the data structure is defined within the reducer it is optimal to
 * locate our selector functions at this level. If store is to be thought of
 * as a database, and reducers the tables, selectors can be considered the
 * queries into said database. Remember to keep your selectors small and
 * focused so they can be combined and composed to fit each particular
 * use-case.
 */

// export const getSelectedId = (state: State) => state.selectedBookId;
