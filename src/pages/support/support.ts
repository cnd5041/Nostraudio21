import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';

/*
  Generated class for the Support page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-support',
    templateUrl: 'support.html'
})
export class SupportPage {
    supportForm;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private formBuilder: FormBuilder
    ) {

    }

    ionViewDidLoad() {
        this.supportForm = this.formBuilder.group({
            category: ['', Validators.required],
            response: ['', Validators.required],
            comments: ['', Validators.required]
        });

    }

    logForm() {
        console.log(this.supportForm.value);
    }

}
