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
    public error$: BehaviorSubject<string> = new BehaviorSubject(null);

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
                    return this.songkickService.searchEventsByArtist(state.name);
                })
            ).subscribe(state => {
                this.events = state;
                this.error$.next(null);
                this.store.dispatch(new fromStore.HideLoading());
            }, (error) => {
                this.events = [];
                this.error$.next('Oops. There was problem getting events.');
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
