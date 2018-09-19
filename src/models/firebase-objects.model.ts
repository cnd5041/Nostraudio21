import { AngularFireAction } from "angularfire2/database";

export interface IReferenceDictionary {
    [key: string]: boolean;
}

export interface ICountReferenceDictionary {
    [key: string]: number;
}

export interface IFirebaseEntity {
    firebaseKey?: string;
}

export class FirebaseTransforms {
    static mapValueToKey(actions: AngularFireAction<any>[]): any {
        const map = {};
        actions.forEach((action) => {
            map[action.key] = action.payload.val();
        });
        return map;
    }
}
