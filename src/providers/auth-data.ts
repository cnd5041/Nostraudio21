import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import { AngularFire, FirebaseAuthState } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import firebase from 'firebase';

// Cordova Login https://github.com/angular/angularfire2/blob/master/docs/5-user-authentication.md#cordova-case

@Injectable()
export class AuthData {
  private fireAuth: firebase.auth.Auth;
  private userProfile: any;
  // private authState: BehaviorSubject<FirebaseAuthState> = new BehaviorSubject(null);
  private _authState: BehaviorSubject<FirebaseAuthState> = new BehaviorSubject(undefined);
  // public authState: Observable<FirebaseAuthState> = this._authState.asObservable();
  public authState: Observable<FirebaseAuthState>;


  //currentUser: Subject<any>;

  constructor(
    public af: AngularFire
  ) {
    this.fireAuth = firebase.auth();
    // this.userProfile = firebase.database().ref('/userProfile');
    this.authState = this._authState.asObservable()
      .filter(state => state !== undefined);

    // Pass all new auth states into authState
    this.af.auth.subscribe(auth => {
      this._authState.next(auth);
    });

    //once I get some of the other providers working,
    //look here for some of the additinal info to grab, and add to portfolios
    //https://github.com/aaronksaunders/ionic2.0-angularfire/tree/master/src/app

    // https://firebase.google.com/docs/auth/web/manage-users
  }

  // getAuthState(): Observable<FirebaseAuthState> {
  // getAuthState(): Observable<any> {
  //   return this._authState.asObservable();
  // }

  loginUser(email: string, password: string): any {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): any {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then((newUser) => {
        console.log('newUser', newUser);
        this.userProfile.child(newUser.uid).set({ email: email });
      });
  }

  resetPassword(email: string): any {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  logoutUser(): any {
    return this.fireAuth.signOut();
  }

}
