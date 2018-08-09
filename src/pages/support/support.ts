import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
// NGRX Imports
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';
import { withLatestFrom } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'page-support',
    templateUrl: 'support.html'
})
export class SupportPage {
    supportForm: FormGroup;
    onSubmit$ = new Subject<any>();
    submitting: boolean = false;

    constructor(
        private db: AngularFireDatabase,
        public store: Store<fromStore.MusicState>
    ) {
        // Setup form
        this.supportForm = new FormGroup({
            category: new FormControl('', Validators.required),
            comments: new FormControl('', Validators.required),
        });

        // Handle Submissions
        this.onSubmit$.pipe(
            withLatestFrom(this.store.select(fromStore.getUserId)),
        ).subscribe(([values, portfolioId]) => {
            this.submitting = true;
            const support = {
                ...values,
                portfolioId: portfolioId,
                timestamp: Date.now()
            };
            // freeze the form until the submission is complete
            this.db.list('/support').push(support).then(() => {
                this.supportForm.reset();
                // Unfreeze and Toast
                this.submitting = false;
                this.store.dispatch(new fromStore.ShowToast({
                    message: 'Thanks! We will get back you!',
                    position: 'top',
                    duration: 2000
                }));
            }, () => {
                // Unfreeze and Toast
                this.submitting = false;
                this.store.dispatch(new fromStore.ShowToast({
                    message: 'There was a problem with the submission.',
                    position: 'top',
                    duration: 2000
                }));
            });
        });

    }

}
