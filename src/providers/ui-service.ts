import { Injectable } from '@angular/core';
import {
    AlertController, AlertOptions,
    ToastController, ToastOptions,
    LoadingOptions, LoadingController
} from 'ionic-angular';

import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UiService {

    private loading;

    private _navBackSubject$: Subject<boolean> = new Subject();
    public navBackSubject$: Observable<boolean> = this._navBackSubject$.asObservable();

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

    public showLoading(options: LoadingOptions = { content: 'Loading...' }): void {
        const loading = this.loadingCtrl.create();
        if (!this.loading) {
            this.loading = this.loadingCtrl.create(options);
            this.loading.present();
        }
    }

    public hideLoading(): void {
        if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
        }
    }

    public goBack(): void {
        this._navBackSubject$.next(true);
    }

}
