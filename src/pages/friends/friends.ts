import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// Library Imports
import { Subject } from 'rxjs/Subject';
// Store imports
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';
// Library Imports
import { Observable } from 'rxjs/Observable';
import { IDbPortfolio } from '../../models';

@Component({
    selector: 'page-friends',
    templateUrl: 'friends.html',
})
export class FriendsPage {

    private unsubscribe$: Subject<any> = new Subject();
    public friendsList$: Observable<any>;
    public results$: Observable<string[]>;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public store: Store<fromStore.MusicState>
    ) {
    }

    ionViewDidLoad() {
        // Start Loading
        this.store.dispatch(new fromStore.ShowLoading());

        this.store.select(fromStore.getFriendsState)
            .takeUntil(this.unsubscribe$)
            .subscribe(state => {
                this.store.dispatch(new fromStore.HideLoading());
                console.log('getFriendsState', state);
            });


        this.friendsList$ = this.store.select(fromStore.getFriendsList);

        this.results$ = this.store.select(fromStore.getFriendsSearchResults);

        // todo, add a check if the friend already exists
    }

    ionViewWillUnload() {
        // End Subscriptions
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    search(event: any): void {
        // http://ionicframework.com/docs/v2/api/components/searchbar/Searchbar/
        const val: string = event.target.value;
        this.store.dispatch(new fromStore.SearchFriends(val));
    }

    onFriendSelect(portfolioId: string): void {
        console.log('navigate to friends page', portfolioId);
        // this.navCtrl.push(ArtistPage, { spotifyId: spotifyId });
    }

    onAddFriend(portfolioId: string): void {
        console.log('add friend!', portfolioId);
    }

}
