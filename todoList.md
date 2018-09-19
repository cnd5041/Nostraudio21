
Priorities:
** === done

- **Unique portfolio names
- Fix Login (make sure login is not just mocked)
- Error Handeling
- Firebase Rules
- Analytics, Crashlytics, Performance (Firebase)
- See if Travis, or Google Cloud Platform has something for build, and storing Environment variables like firebase id 

- Updating AngularFire / @angularfire
 https://github.com/angular/angularfire2/releases
    pay attention to 5.0.0-rc.9.
    look for any breaking changess
Migration Guide, https://www.npmjs.com/package/@angular/fire


Maybe go full Firestore...
*Check for Ionic updates too and how Firestore works with Cordova
https://ionicframework.com/docs/native/firebase/
https://angularfirebase.com/lessons/ionic-google-login-with-firebase-and-angularfire/

Ionic 4: https://beta.ionicframework.com/docs/building/migration/
https://beta.ionicframework.com/docs/publishing/progressive-web-app
 - Maybe do Ionic, PWA...^looks like it has great support and firebase is thought of...


--Artists--
- Create a cloud function that calculates the artist price (when the artist is updated and when a 
 child is pushed to the stockholders)
   - Create alerts for movement on stock prices with the cloud functions (or other events)
- Events: Use Image Photos: https://developers.google.com/places/web-service/search (look at wikipedia)
- Create artist?
 - Periodically update info from Spotify
- Test the loading of all artists 

--- Deployment ---
- Figure out deployment (firebase, in offline example), multiple instances, secure key storage


- Show price change or price history so people know how much they've made. Also, show 
    a date for following or purchases that they can show off. (i.e. have a card or some 
        function that shows the early investment)
    - have to capture transaction price versus current price
        - have to do that over time to make sure return is accurate
        - maybe keep the +- value in the transaction? since it's hardish to calculate at the end 
    - Check stats service for getArtistPriceChange
- With price, might have to have a record of the price change over time....
    Technically things could be figured out by transactions over time, but might be hard to find..
      Having a service to update that record would be tough to. 
        maybe buy / sell changes are all we care about, so that's enough
            can get transactions per artist ref.orderByChild('artistId').equalTo(uid))


---- Friends ----- 
Relationships: See Friends and their portfolios. See artists that they own, artists you have in common, 
        on artists page show friends that own this artist..
        - Future alert that someone followed you




NGRX Sources:
Manipulations to Firebase Data
https://github.com/angular/angularfire2/blob/5.0.0-rc.6/docs/rtdb/lists.md
-- check for CRUD ops: https://www.youtube.com/watch?v=13nWhUndQo4

