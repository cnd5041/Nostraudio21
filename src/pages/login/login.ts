import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Loading, ActionSheetController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from "rxjs/Subscription";

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { AuthData } from '../../providers/';
import { INosPortfolio } from '../../models/';
import { SignupPage, ResetPasswordPage } from '../';
import { GlobalValidator } from '../../validators/global-validator';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    loginForm: FormGroup;

    emailChanged: boolean = false;
    passwordChanged: boolean = false;
    submitAttempt: boolean = false;
    loading: Loading;
    // Track user login state
    userState: firebase.User;
    // userPortfolio$: Observable<INosPortfolio>;
    userStateSubscription: ISubscription;


    constructor(
        public nav: NavController,
        public authData: AuthData,
        public formBuilder: FormBuilder,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public afAuth: AngularFireAuth,
        public actionSheetCtrl: ActionSheetController
    ) {
        /**
         * Creates a ControlGroup that declares the fields available, their values and the validators that they are going
         * to be using.
         *
         * I set the password's min length to 6 characters because that's Firebase's default, feel free to change that.
         */
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, GlobalValidator.mailFormat])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        });

    }


    ionViewDidLoad() {
        // Setup Portfolio Subscription
        // this.userPortfolio$ = this.portfolioService.userPortfolio$;

        // Setup UserState Stream/Subscription
        const userStateStream = this.authData.authState;
        this.userStateSubscription = userStateStream
            .subscribe(userState => {
                this.userState = userState;
            }, error => {
                this.userState = null;
                this.showError('Error Getting User Info.');
            });
    }

    ionViewWillUnload() {
        this.userStateSubscription.unsubscribe();
    }

    /**
     * Receives an input field and sets the corresponding fieldChanged property to 'true' to help with the styles.
     */
    elementChanged(input) {
        const field = input.inputControl.name;
        this[field + "Changed"] = true;
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
            this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
                .then(authData => {
                    this.loading.dismiss();
                }, error => {
                    this.loading.dismiss()
                        .then(() => {
                            this.showError('Log In Error.');
                        });
                });

            // Setup and Show Loading
            this.loading = this.loadingCtrl.create({});
            this.loading.present();
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

    showError(message: string): void {
        const alert = this.alertCtrl.create({
            message: message,
            buttons: [
                {
                    text: "Ok",
                    role: 'cancel'
                }
            ]
        });
        alert.present();
    }

    signInWithFacebook() {
        this.afAuth.auth
            .signInWithPopup(new firebase.auth.FacebookAuthProvider())
            .then(res => {
                console.log('facbook login res', res);
            }, error => {
                console.log('facbook login error', error);
                this.showError(error.message);
            });
    }

}
