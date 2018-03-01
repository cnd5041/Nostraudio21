import lodash from 'lodash';

import { IReferenceDictionary } from './firebase-objects.model';

// Artists
export interface IArtistEntity {
    firebaseKey?: string;
    value?: IDbArtist;
}

export interface IArtistEntityList {
    [firebaseKey: string]: IArtistEntity;
}

// Genre
export interface IGenreEntity {
    firebaseKey?: string;
    value?: IGenre;
}

export interface IGenreEntityList {
    [firebaseKey: string]: IGenreEntity;
}


// Genre Per Artist
export interface IGenresPerArtistEntity {
    firebaseKey?: string;
    value?: { [genre: string]: boolean | string };
}

export interface IGenresPerArtistEntityList {
    [firebaseKey: string]: IGenresPerArtistEntity;
}

// Followers Per Artist
export interface IFollowsPerArtistEntity {
    firebaseKey?: string;
    value?: { [artistKey: string]: IReferenceDictionary };
}

export interface IFollowsPerArtistEntityList {
    [artistKey: string]: IFollowsPerArtistEntity;
}

export interface IFollowsPerArtistItem {
    firebaseKey?: string;
    value?: IReferenceDictionary;
}

// Stockholders Per Artist
export interface IStockholdersPerArtistEntity {
    firebaseKey?: string;
    value?: { [artistKey: string]: IReferenceDictionary };
}

export interface IStockholdersPerArtistEntityList {
    [artistKey: string]: IStockholdersPerArtistEntity;
}

export interface IStockholdersPerArtistItem {
    firebaseKey?: string;
    value?: IReferenceDictionary;
}


export interface INosArtist extends IDbArtist {
    // // id: string;
    // name: string;
    // spotifyId: string;
    // spotifyUri: string;
    // spotifyUrl: string;
    // spotifyHref: string;
    // spotifyPopularity: number;
    // spotifyFollowers: number;
    // // spotifyGenres: string[];
    // // genre: string;
    // largeImage: string;
    // mediumImage: string;
    // smallImage: string;

    shareCount?: number;
    // stockholdersPerArtist: IDictionary[];
    stockholdersPerArtist: IReferenceDictionary;
    marketPrice?: number;
    marketCap?: number;
    // transactions: any[];

    // genres will be tracked seperately
    // portfolio follows will be tracked seperately
    // portfolio investors will be tracked seperately
}

export interface ISpotifyArtist {
    name: string;
    spotifyId: string;
    spotifyUri: string;
    spotifyUrl: string;
    spotifyHref: string;
    spotifyPopularity: number;
    spotifyFollowers: number;
    spotifyGenres: string[];
    genre: string;
    largeImage: string;
    mediumImage: string;
    smallImage: string;
}

export interface IDbArtist {
    name: string;
    spotifyId: string;
    spotifyUri: string;
    spotifyUrl: string;
    spotifyHref: string;
    spotifyPopularity: number;
    spotifyFollowers: number;
    largeImage: string;
    mediumImage: string;
    smallImage: string;
}

export function nosArtistFromDbArtist(dbArtist: IDbArtist, stockholdersPerArtist: IReferenceDictionary): INosArtist {
    const artist = lodash.clone(dbArtist);

    artist.stockholdersPerArtist = stockholdersPerArtist;
    artist.shareCount = lodash.values(stockholdersPerArtist).reduce((a, b) => a + b, 0);

    let price = (50 * (artist.spotifyPopularity / 100)) + (35 * (artist.spotifyFollowers / 5000000)) + (15 * (artist.shareCount / 5000));
    price = Math.round(price * 100) / 100;
    artist.marketPrice = price;
    artist.marketCap = artist.marketPrice * artist.shareCount;

    return artist;
}

export function dbArtistFromSpotifyArtist(artist: ISpotifyArtist): IDbArtist {
    return {
        name: artist.name,
        spotifyId: artist.spotifyId,
        spotifyUri: artist.spotifyUri,
        spotifyUrl: artist.spotifyUrl,
        spotifyHref: artist.spotifyHref,
        spotifyPopularity: artist.spotifyPopularity,
        spotifyFollowers: artist.spotifyFollowers,
        largeImage: artist.largeImage,
        mediumImage: artist.mediumImage,
        smallImage: artist.smallImage
    };
}

export interface IGenre {
    name: string;
}

export interface ISpotifyTrack {
    album;
    trackHref: string;
    name: string;
    popularity: string;
    previewUrl: string;
    trackUri: string;
}

export class SpotifyTrack implements ISpotifyTrack {
    album;
    trackHref;
    name;
    popularity;
    previewUrl;
    trackUri;

    constructor(
        track?: any
    ) {
        this.album = track.album || null;
        this.trackHref = track.href || null;
        this.name = track.name;
        this.popularity = track.popularity || null;
        this.previewUrl = track.preview_url || null;
        this.trackUri = track.uri;
    }
}

export interface ISpotifyTopTracks {
    list?: ISpotifyTrack[];
    txtList?: string;
}

export interface IStatsGraphData {
    dayRange;
    fiveDayRange;
    monthRange;
    threeMonthRange;
    yearRange;
}
