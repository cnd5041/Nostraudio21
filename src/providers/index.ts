import { ArtistService } from './artist-service';
import { AuthData } from './auth-data';
import { DateService } from './date-service';
import { FirebaseStore } from './firebase-store';
import { PortfolioService } from './portfolio-service';
import { NosSpotifyService } from './spotify-service';
import { StatsService } from './stats-service';
import { DiscogsService } from './discogs-service';
import { FirebaseProvider } from './firebase';
import { UiService } from './ui-service';

export const providers: any[] = [
    ArtistService, AuthData, DateService, FirebaseStore, PortfolioService,
    NosSpotifyService, StatsService, DiscogsService, FirebaseProvider, UiService
];

export * from './artist-service';
export * from './auth-data';
export * from './date-service';
export * from './firebase-store';
export * from './portfolio-service';
export * from './spotify-service';
export * from './stats-service';
export * from './discogs-service';
export * from './firebase';
export * from './ui-service';
