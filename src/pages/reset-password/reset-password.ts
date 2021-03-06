import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { GlobalValidator } from '../../validators/global-validator';

@Component({
    selector: 'page-reset-password',
    templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
    resetPasswordForm: FormGroup;
    emailChanged: boolean = false;
    passwordChanged: boolean = false;
    submitAttempt: boolean = false;

    constructor(
        public authData: AuthData,
        public formBuilder: FormBuilder,
        public nav: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController
    ) {
        this.resetPasswordForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required, GlobalValidator.mailFormat])],
        });
    }

    /**
     * If the form is valid it will call the AuthData service to reset the user's password displaying a loading
     *  component while the user waits.
     *
     * If the form is invalid it will just log the form value, feel free to handle that as you like.
     */
    resetPassword() {
        this.submitAttempt = true;

        if (!this.resetPasswordForm.valid) {
            console.log(this.resetPasswordForm.value);
        } else {
            this.authData.resetPassword(this.resetPasswordForm.value.email).then((user) => {
                const alert = this.alertCtrl.create({
                    message: 'We just sent you a reset link to your email',
                    buttons: [
                        {
                            text: 'Ok',
                            role: 'cancel',
                            handler: () => {
                                this.nav.pop();
                            }
                        }
                    ]
                });
                alert.present();
            }, (error) => {
                const errorMessage: string = error.message;
                const errorAlert = this.alertCtrl.create({
                    message: errorMessage,
                    buttons: [
                        {
                            text: 'Ok',
                            role: 'cancel'
                        }
                    ]
                });

                errorAlert.present();
            });
        }

    }


}
