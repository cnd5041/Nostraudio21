
Priorities:
** === done
**-Convert to new version of Firebase (Angular Fire 5)
- Make some sort of solution for lookup tables
  - maybe do a selector that combines a main entities references
  - i.e. artist (genresPerArtist, stockHoldersPerArtist)
- Do search so that I'm favoring firebase over spotify
- Create artist?
 - Periodically update info from Spotify
- Error Handeling
- Viewing other portolios
  - friends
- Hook up discogs and/or songkick and add pull there (on Artist)
    Just make it an additional set of functionality that will extend the classes/objects
    Have an option for user to mark the info as wrong
    Can do events near them
- Create a cloud function that calculates the artist price (when the artist is updated and when a 
 child is pushed to the stockholders)
 - Create alerts for movement on stock prices with the cloud functions (or other events)
- See what is going on with the app headers (modal, close button)
- Events: Use Image Photos: https://developers.google.com/places/web-service/search (look at wikipedia)


NGRX Sources:
Manipulations to Firebase Data
https://github.com/angular/angularfire2/blob/5.0.0-rc.6/docs/rtdb/lists.md
-- check for CRUD ops: https://www.youtube.com/watch?v=13nWhUndQo4


