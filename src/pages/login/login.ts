import { Component } from '@angular/core';
import { NavController, AlertController, Loading, ActionSheetController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
// Firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
// App Imports
import { AuthData } from '../../providers/';
import { ResetPasswordPage, SignupPage } from '../';
import { GlobalValidator } from '../../validators/global-validator';
// Library Imports
import { Subject } from 'rxjs/Subject';
// Store
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';
import { takeWhile, filter, withLatestFrom, takeUntil, take } from 'rxjs/operators';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    private unsubscribe$: Subject<any> = new Subject();

    loginForm: FormGroup;

    emailChanged: boolean = false;
    passwordChanged: boolean = false;
    submitAttempt: boolean = false;
    loading: Loading;
    // Track user login state
    userState: firebase.User;

    accountForm: FormGroup;
    accountFormChanged: boolean = false;
    editing: boolean = false;
    onSubmit$ = new Subject<any>();
    currentDisplayName: string;

    constructor(
        public nav: NavController,
        public authData: AuthData,
        public formBuilder: FormBuilder,
        public alertCtrl: AlertController,
        public afAuth: AngularFireAuth,
        public actionSheetCtrl: ActionSheetController,
        public store: Store<fromStore.MusicState>,
        public db: AngularFireDatabase
    ) {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, GlobalValidator.mailFormat])],
            password: ['', Validators.compose([Validators.required])]
        });

        // Setup account form
        this.accountForm = new FormGroup({
            displayName: new FormControl('', [Validators.required, Validators.minLength(4)])
        });

        // Listen for changes and detect if there are actual changes
        this.accountForm.valueChanges
            .pipe(
                takeUntil(this.unsubscribe$),
                withLatestFrom(this.store.select(fromStore.getNosPortfolio))
            )
            .subscribe(([values, portfolio]) => {
                this.accountFormChanged = values.displayName !== portfolio.displayName;
            });

        // Handle Submissions
        this.onSubmit$.subscribe((values) => {
            this.db.list('/portfolios', ref => ref.orderByChild('displayName').equalTo(values.displayName))
                .valueChanges()
                .pipe(
                    take(1),
                    withLatestFrom(this.store.select(fromStore.getNosPortfolio))
                )
                .subscribe(([results, portfolio]) => {
                    if (results.length < 1) {
                        this.db.object(`/portfolios/${portfolio.userProfile}`)
                            .update({ displayName: values.displayName });
                    } else {
                        this.store.dispatch(new fromStore.ShowToast({
                            message: 'That name is taken, try another.',
                            position: 'top',
                            duration: 2000
                        }));
                    }
                });
        });
    }


    ionViewDidLoad() {
        // Set the displayName if they are not currently editing
        this.store.select(fromStore.getNosPortfolio)
            .pipe(
                takeUntil(this.unsubscribe$),
                takeWhile(() => this.editing === false),
                filter((state) => state !== null)
            )
            .subscribe((state) => {
                this.currentDisplayName = state.displayName;
                // Set form values
                this.accountForm.controls['displayName'].setValue(this.currentDisplayName);
            });

        // Watch Auth State
        this.authData.authState.pipe(
            takeUntil(this.unsubscribe$),
        ).subscribe(userState => {
            this.userState = userState;
        });
    }

    ionViewWillUnload() {
        // End Subscriptions
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onCancel() {
        this.accountForm.reset();
        this.accountForm.controls['displayName'].setValue(this.currentDisplayName);
    }

    /**
     * If the form is valid it will call the AuthData service to log the user in displaying a loading component while
     * the user waits.
     *
     * If the form is invalid it will just log the form value, feel free to handle that as you like.
     */
    loginUser() {
        this.submitAttempt = true;

        if (!this.loginForm.valid) {
            console.log('form invalid', this.loginForm.value);
        } else {
            // Show Loading
            this.store.dispatch(new fromStore.ShowLoading());
            // Request Login
            this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
                .then((authData) => {
                    this.store.dispatch(new fromStore.HideLoading());
                }, (errorMsg: string) => {
                    this.store.dispatch(new fromStore.HideLoading());
                    this.store.dispatch(new fromStore.ShowToast({
                        message: errorMsg,
                        position: 'top',
                        duration: 2000
                    }));
                });
        }
    }

    goToSignup() {
        this.nav.push(SignupPage);
    }

    goToResetPassword() {
        this.nav.push(ResetPasswordPage);
    }

    logOut() {
        const actionSheet = this.actionSheetCtrl.create({
            title: 'Confirm Log Out',
            buttons: [
                {
                    text: 'Log Out',
                    role: 'destructive',
                    handler: () => {
                        this.authData.logoutUser().then(() => {
                            //this.nav.setRoot(LoginPage);
                        });
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => { }
                }
            ]
        });

        actionSheet.present();
    }

    signInWithFacebook() {
        // https://github.com/angular/angularfire2/blob/master/docs/ionic/v3.md
        return this.authData.smartSignin('facebook')
            .then(res => {
                console.log('facbook login res', res);
            }, error => {
                console.log('facbook login error', error);
                this.store.dispatch(new fromStore.ShowToast({
                    message: 'Log In Error.',
                    position: 'top',
                    duration: 2000
                }));
            });
    }

}
