export interface INosArtist {
    id: string;
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

    shareCount?: number;
    marketPrice?: number;
    marketCap?: number;
    transactions: any[];
}

export class NosArtist {

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