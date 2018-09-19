import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as firebase from 'firebase/app';
import { AuthProvider, FirebaseAuth } from '@firebase/auth-types';
import { NavController, AlertController, ActionSheetController } from 'ionic-angular';

// Cordova Login https://github.com/angular/angularfire2/blob/master/docs/5-user-authentication.md#cordova-case

interface FirebaseAuthError {

}

@Injectable()
export class AuthData {
    private userProfile: any;

    private _authState: BehaviorSubject<firebase.User> = new BehaviorSubject(null);
    public authState: Observable<firebase.User>;

    constructor(
        private afAuth: AngularFireAuth,
        public actionSheetCtrl: ActionSheetController,
    ) {

        afAuth.authState.subscribe((user: firebase.User) => {
            // if (!user) {
            //   this.displayName = null;
            //   return;
            // }
            // this.displayName = user.displayName;
        });

        this.userProfile = firebase.database().ref('/userProfile');
        this.authState = this._authState.asObservable();

        // Pass all new auth states into authState
        this.afAuth.authState.subscribe((user: firebase.User) => {
            this._authState.next(user);
        });

        //once I get some of the other providers working,
        //look here for some of the additinal info to grab, and add to portfolios
        //https://github.com/aaronksaunders/ionic2.0-angularfire/tree/master/src/app

        // https://firebase.google.com/docs/auth/web/manage-users
    }

    loginUser(email: string, password: string): Promise<firebase.User> {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then((user) => {
                console.log('signInWithEmailAndPassword', user);
                return user;
            }, (error: firebase.FirebaseError) => {
                console.error(error);
                if (
                    error && error.code === 'auth/wrong-password' ||
                    error && error.code === 'auth/user-not-found'
                ) {
                    throw 'Incorrect Email and/or Password';
                } else {
                    throw 'Log In Error';
                }
            });
    }

    signupUserEmail(email: string, password: string): Promise<firebase.User> {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then((newUser) => {
                this.userProfile.child(newUser.uid).set({ email: email });
                return newUser;
            }, (error: firebase.FirebaseError) => {
                console.error(error);
                throw error.message;
            });
    }

    signupUserFacebook(): Promise<firebase.User> {
        return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
            .then((newUser) => {
                console.log('newUser (Facebook)', newUser);
                // this.userProfile.child(newUser.uid).set({ email: email });
                return newUser;
            }, (error: firebase.FirebaseError) => {
                console.error(error);
                if (error && error.code === 'auth/account-exists-with-different-credential') {
                    throw `The email associated with this Facebook account is already being used
                        for another Nostradio account.`;
                } else {
                    throw 'Log In Error';
                }
            });
    }

    resetPassword(email: string): Promise<any> {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }

    logoutUser(): Promise<any> {
        return this.afAuth.auth.signOut();
    }

    smartSignin(provider: 'facebook' | 'google'): Promise<any> {
        // https://firebase.google.com/docs/auth/web/google-signin#handling-account-exists-with-different-credential-errors
        // Future Use: Users can't sign in to another Provider if the email associated with the Provider account
        // is used for another.
        return new Promise((resolve, reject) => {
            let authProvider: AuthProvider;
            switch (provider) {
                case 'facebook':
                    authProvider = new firebase.auth.FacebookAuthProvider();
                    break;
                case 'google':
                    authProvider = new firebase.auth.GoogleAuthProvider();
                    break;
                default:
                    break;
            }
            if (!authProvider) {
                return reject('Unknown Provider');
            }

            // Step 1.
            // User tries to sign in to Google.
            this.afAuth.auth.signInWithPopup(authProvider)
                .then((success) => {
                    resolve(success);
                })
                .catch((error) => {
                    // An error happened.
                    if (error.code === 'auth/account-exists-with-different-credential') {
                        // Step 2.
                        // User's email already exists.
                        // The pending credential.
                        const pendingCred = error.credential;
                        // The provider account's email address.
                        const email = error.email;
                        // Get sign-in methods for this email.
                        this.afAuth.auth.fetchProvidersForEmail(email).then((methods) => {
                            // Step 3.
                            // If the user has several sign-in methods,
                            // the first method in the list will be the "recommended" method to use.
                            if (methods[0] === 'password') {
                                // Asks the user his password.
                                // In real scenario, you should handle this asynchronously.
                                // const password = promptUserForPassword(); // TODO: implement promptUserForPassword.
                                const password = 'Emery126';
                                this.afAuth.auth.signInWithEmailAndPassword(email, password).then((user: firebase.User) => {
                                    // Step 4a.
                                    return user.linkWithCredential(pendingCred);
                                }).then(() => {
                                    // Google account successfully linked to the existing Firebase user.
                                    // goToApp();
                                    resolve();
                                });
                                return;
                            }
                            // All the other cases are external providers.
                            // Construct provider object for that provider.
                            // TODO: implement getProviderForProviderId.
                            // const provider = getProviderForProviderId(methods[0]);
                            console.log('getProviderForProviderId', methods[0]);
                            const provider = new firebase.auth.EmailAuthProvider();
                            // At this point, you should let the user know that he already has an account
                            // but with a different provider, and let him validate the fact he wants to
                            // sign in with this provider.
                            // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
                            // so in real scenario you should ask the user to click on a "continue" button
                            // that will trigger the signInWithPopup.
                            this.afAuth.auth.signInWithPopup(provider).then((result) => {
                                // Remember that the user may have signed in with an account that has a different email
                                // address than the first one. This can happen as Firebase doesn't control the provider's
                                // sign in flow and the user is free to login using whichever account he owns.
                                // Step 4b.
                                // Link to Google credential.
                                // As we have access to the pending credential, we can directly call the link method.
                                result.user.linkAndRetrieveDataWithCredential(pendingCred).then((usercred) => {
                                    // Google account successfully linked to the existing Firebase user.
                                    resolve();
                                });
                            });
                        });
                    } else {
                        console.error(error);
                        reject(error);
                    }
                });
        });
    }

}
