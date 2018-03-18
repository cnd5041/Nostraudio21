export interface IReferenceDictionary {
    [key: string]: boolean;
}

export interface ICountReferenceDictionary {
    [key: string]: number;
}

export interface IFirebaseEntity {
    firebaseKey?: string;
}
