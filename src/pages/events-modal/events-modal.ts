import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
// Store imports
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';
import { INosArtist, filterByValues } from '../../models';
// Library Imports
import { orderBy, escapeRegExp } from 'lodash';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import {
    takeUntil, filter, debounceTime, switchMap
} from 'rxjs/operators';
// App Imports
import { NosSongkickService } from '../../providers';

@Component({
    templateUrl: 'events-modal.html'
})
export class EventsModal {
    private unsubscribe: Subject<any> = new Subject();
    public events = [];

    constructor(
        public viewCtrl: ViewController,
        public store: Store<fromStore.MusicState>,
        public songkickService: NosSongkickService
    ) {

    }

    ionViewDidLoad() {
        this.store.dispatch(new fromStore.ShowLoading());

        this.store.select(fromStore.getSelectedNosArtist)
            .pipe(
                takeUntil(this.unsubscribe),
                filter(result => !!result),
                switchMap(state => {
                    // return this.songkickService.searchEventsByArtist(state.name);
                    return this.songkickService.searchEventsByArtist('Cage the Elephant');
                })
            ).subscribe(state => {
                // If there are no events...show something, link to songkick events page
                // show the powered by songkick label in the footer
                console.log('searchEventsByArtist', state);
                this.events = state;
                this.store.dispatch(new fromStore.HideLoading());
            });
    }

    ionViewWillUnload() {
        // End Subscriptions
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
