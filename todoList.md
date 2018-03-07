
Priorities:
** === done
**-Convert to new version of Firebase (Angular Fire 5)
- Make some sort of solution for lookup tables
  - maybe do a selector that combines a main entities references
  - i.e. artist (genresPerArtist, stockHoldersPerArtist)
- Do search so that I'm favoring firebase over spotify
- Add an alert reducer, action

- Maybe just have a firebase service that subscribes to all the data, then
    just have it subscribe and in that respose, call the success action (no effects needed)
    possibly have actions to turn off subscriptions

- Error Handeling

NGRX Sources:
Manipulations to Firebase Data
https://github.com/angular/angularfire2/blob/5.0.0-rc.6/docs/rtdb/lists.md



Hook up discogs and add pull there (on Artist)
    Just make it an additional set of functionality that will extend the classes/objects
    Have an option for user to mark the info as wrong
Add loading to Artist page, wait until artist is defined to show rest of page

** Complete buy
Complete sell and show ownership on page

-- Redo the share count to aggregate the count of each node (reduce) use the sharesPerPortfolio to show that the user owns x amount of shares (then do sell)
-- upgrade to Angular Fire 5, probably breaking, Database is deprecated
-- check for CRUD ops: https://www.youtube.com/watch?v=13nWhUndQo4

Create alerts for movement on stock prices with the cloud functions (or other events)

- Create a cloud function that calculates the artist price (when the artist is updated and when a 
 child is pushed to the stockholders)
