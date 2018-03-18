import { Injectable } from '@angular/core';
import {
    AlertController, AlertOptions,
    ToastController, ToastOptions,
    LoadingOptions, LoadingController
} from 'ionic-angular';

@Injectable()
export class UiService {

    private loading;

    constructor(
        private alertCtrl: AlertController,
        private toastController: ToastController,
        public loadingCtrl: LoadingController,
    ) { }

    showBasicAlert(options: AlertOptions) {
        const alert = this.alertCtrl.create(options);
        alert.present();
    }

    showToast(options: ToastOptions) {
        const toast = this.toastController.create(options);
        toast.present();
    }

    showLoading(options: LoadingOptions = { content: 'Loading...' }): void {
        const loading = this.loadingCtrl.create();
        if (!this.loading) {
            this.loading = this.loadingCtrl.create(options);
            this.loading.present();
        }
    }

    hideLoading(): void {
        if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
        }
    }

}
