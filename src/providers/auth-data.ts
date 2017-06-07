import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as firebase from 'firebase/app';

// Cordova Login https://github.com/angular/angularfire2/blob/master/docs/5-user-authentication.md#cordova-case

@Injectable()
export class AuthData {
  private userProfile: any;

  private _authState: BehaviorSubject<firebase.User> = new BehaviorSubject(undefined);
  public authState: Observable<firebase.User>;

  constructor(
    private afAuth: AngularFireAuth
  ) {

    // this.userProfile = firebase.database().ref('/userProfile');
    this.authState = this._authState.asObservable()
      .filter(state => state !== undefined);

    // Pass all new auth states into authState
    this.afAuth.authState.subscribe(auth => {
      this._authState.next(auth);
    });

    //once I get some of the other providers working,
    //look here for some of the additinal info to grab, and add to portfolios
    //https://github.com/aaronksaunders/ionic2.0-angularfire/tree/master/src/app

    // https://firebase.google.com/docs/auth/web/manage-users
  }

  loginUser(email: string, password: string): any {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): any {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((newUser) => {
        console.log('newUser', newUser);
        this.userProfile.child(newUser.uid).set({ email: email });
      });
  }

  resetPassword(email: string): any {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser(): any {
    return this.afAuth.auth.signOut();
  }

}
