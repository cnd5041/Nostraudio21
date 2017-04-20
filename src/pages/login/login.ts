import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Loading } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { FirebaseAuthState } from 'angularfire2';

import { AuthData } from '../../providers/';
import { SignupPage, PortfolioPage, ResetPasswordPage } from '../';
import { GlobalValidator } from '../../validators/global-validator';

import { PortfolioService } from '../../providers/portfolio-service';
import { IPortfolio } from '../../models/portfolio.model';

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
    userState: FirebaseAuthState;
    userPortfolio$: Observable<IPortfolio>;

    constructor(
        public nav: NavController,
        public authData: AuthData,
        public formBuilder: FormBuilder,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public portfolioService: PortfolioService
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
        this.userPortfolio$ = this.portfolioService.userPortfolio$;

        this.authData.authState
            // .skip(1)
            .subscribe(userState => {
                this.userState = userState;
                console.log('userState login subscription', userState);
            }, error => {
                console.log('getAuthState error', error);

                this.userState = null;
                this.showError('Error Getting User Info.');
            });

    }

    /**
     * Receives an input field and sets the corresponding fieldChanged property to 'true' to help with the styles.
     */
    elementChanged(input) {
        let field = input.inputControl.name;
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
                            this.showError('Error Loggin In.');
                        });
                });

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
        this.authData.logoutUser().then(() => {
            //this.nav.setRoot(LoginPage);
        });
    }

    showError(message: string): void {
        let alert = this.alertCtrl.create({
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

}
