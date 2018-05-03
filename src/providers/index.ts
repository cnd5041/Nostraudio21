import { ArtistService } from './artist-service';
import { AuthData } from './auth-data';
import { DateService } from './date-service';
import { NosSpotifyService } from './spotify-service';
import { StatsService } from './stats-service';
import { DiscogsService } from './discogs-service';
import { NosFirebaseService } from './firebase-service';
import { UiService } from './ui-service';
import { NosSongkickService } from './songkick-service';

export const providers: any[] = [
    ArtistService, AuthData, DateService,
    NosSpotifyService, StatsService, DiscogsService, NosFirebaseService, UiService, NosSongkickService
];

export * from './artist-service';
export * from './auth-data';
export * from './date-service';
export * from './spotify-service';
export * from './stats-service';
export * from './discogs-service';
export * from './firebase-service';
export * from './ui-service';
export * from './songkick-service';
