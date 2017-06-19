export interface IDictionary {
    //[key: string]: boolean;
    $key?: string;
    $value?: boolean;
    $exists?: () => boolean;
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
    stockholdersPerArtist: IDictionary[];
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

export interface IDbArtist extends IDictionary {
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

export class NosArtist {

    constructor() {

    }
}

export function nosArtistFromDbArtist(dbArtist: IDbArtist, stockholdersPerArtist: IDictionary[]): INosArtist {
    let artist = <INosArtist>Object.create(dbArtist);

    artist.shareCount = stockholdersPerArtist.length;
    artist.stockholdersPerArtist = stockholdersPerArtist;

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

export interface ITransaction {
    id: string;
    //artist: INosArtist
    //artistId: string;
    //user: IUser;
    //userId: string;
    price: number;
    action: string;
    //shareId: string;
    //share: IShare;
    metrics: string;
}

export interface IStatsGraphData {
    dayRange;
    fiveDayRange;
    monthRange;
    threeMonthRange;
    yearRange;
}