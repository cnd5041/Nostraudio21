import { values, clone, forOwn, startCase } from 'lodash';

import { IReferenceDictionary, ICountReferenceDictionary } from './firebase-objects.model';

// Genre
export interface IDbGenre {
    name: string;
}

export interface IDbGenreMap {
    [firebaseKey: string]: IDbGenre;
}

export interface IDbGenreNameMap {
    [firebaseKey: string]: string;
}

// Genre Per Artist
export interface IGenresPerArtistMap {
    [firebaseKey: string]: IReferenceDictionary;
}

// Followers Per Artist
export interface IFollowersPerArtistMap {
    [firebaseKey: string]: IReferenceDictionary;
}

export interface IFollowsPerArtistItem {
    firebaseKey?: string;
    value?: IReferenceDictionary;
}

// Stockholders Per Artist
export interface IStockholdersPerArtistMap {
    [firebaseKey: string]: ICountReferenceDictionary;
}

export interface IStockholdersPerArtistItem {
    firebaseKey?: string;
    value?: ICountReferenceDictionary;
}

// Artists
export interface IDbArtistMap {
    [firebaseKey: string]: IDbArtist;
}

export interface INosArtistMap {
    [firebaseKey: string]: INosArtist;
}

export interface INosArtist extends IDbArtist {
    shareCount?: number;
    // stockholdersPerArtist: IDictionary[];
    stockholdersPerArtist: ICountReferenceDictionary;
    marketCap?: number;

    genres: IDbGenreMap;
    genresArray: string[];
    // transactions: any[];
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
    marketPrice?: number;
}

export function nosArtistFromDbArtist(
    dbArtist: IDbArtist,
    stockholdersPerArtist: ICountReferenceDictionary,
    genres: IDbGenreNameMap = {}
): INosArtist {
    const artist = clone(dbArtist);

    artist.stockholdersPerArtist = stockholdersPerArtist || {};
    artist.shareCount = values(artist.stockholdersPerArtist)
        .reduce((a, b) => a + b, 0);

    let price = (50 * (artist.spotifyPopularity / 100)) + (35 * (artist.spotifyFollowers / 5000000)) + (15 * (artist.shareCount / 5000));
    price = Math.round(price * 100) / 100;
    artist.marketPrice = price;
    artist.marketCap = artist.marketPrice * artist.shareCount;

    artist.genres = genres;
    artist.genresArray = [];

    forOwn(genres, (value, key) => {
        artist.genresArray.push(startCase(value));
    });

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
