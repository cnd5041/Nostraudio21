import { Injectable } from '@angular/core';
import { AlertController, AlertOptions, ToastController, ToastOptions } from 'ionic-angular';

@Injectable()
export class UiService {

    constructor(
        private alertCtrl: AlertController,
        private toastController: ToastController
    ) { }

    showBasicAlert(options: AlertOptions) {
        const alert = this.alertCtrl.create(options);
        alert.present();
    }

    showToast(options: ToastOptions) {
        const toast = this.toastController.create(options);
        toast.present();
    }

}
