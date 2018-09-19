import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
// App Imports
import { AuthData } from '../../providers/';
import { GlobalValidator } from '../../validators/global-validator';
// Library Imports
import { Subject } from 'rxjs/Subject';
// Store
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';
import { takeUntil, filter, take, map } from 'rxjs/operators';
import { LoginPage } from '../login/login';

@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignupPage {
    private unsubscribe$: Subject<any> = new Subject();

    loginForm: FormGroup;

    constructor(
        public nav: NavController,
        public authData: AuthData,
        public formBuilder: FormBuilder,
        public afAuth: AngularFireAuth,
        public store: Store<fromStore.MusicState>
    ) {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, GlobalValidator.mailFormat])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        });
    }

    ionViewCanEnter(): Promise<boolean> {
        // Do not allow entry if logged in
        return this.authData.authState.pipe(
            take(1),
            map(value => value === null ? true : false),

        ).toPromise();
    }

    ionViewDidLoad() {
        // Watch Auth State
        this.authData.authState.pipe(
            takeUntil(this.unsubscribe$),
            filter(val => val !== null)
        ).subscribe(() => {
            this.nav.setRoot(LoginPage);
        });
    }

    ionViewWillUnload() {
        // End Subscriptions
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    loginUser() {
        this.store.dispatch(new fromStore.ShowLoading());

        if (!this.loginForm.valid) {
            // Do Nothing
        } else {
            this.authData.signupUserEmail(this.loginForm.value.email, this.loginForm.value.password)
                .then((authData) => {
                    this.store.dispatch(new fromStore.HideLoading());
                }, (errorMsg) => {
                    this.store.dispatch(new fromStore.HideLoading());
                    this.store.dispatch(new fromStore.ShowToast({
                        message: errorMsg,
                        position: 'top',
                        duration: 2000
                    }));
                });
            // Show Loading
            this.store.dispatch(new fromStore.ShowLoading());
        }
    }

    signInWithFacebook() {
        // https://github.com/angular/angularfire2/blob/master/docs/ionic/v3.md
        return this.authData.signupUserFacebook()
            .then((user: firebase.User) => {
                console.log('success sign in facebook, now unlink', user);
            }, (errorMsg) => {
                this.store.dispatch(new fromStore.ShowToast({
                    message: 'Log In Error.',
                    position: 'top',
                    duration: 2000
                }));
            });
    }

}
