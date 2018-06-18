import { AboutPage } from './about/about';
import { ArtistPage } from './artist/artist';
import { LoginPage } from './login/login';
import { PortfolioPage } from './portfolio/portfolio';
import { ResetPasswordPage } from './reset-password/reset-password';
import { SearchPage } from './search/search';
import { SignupPage } from './signup/signup';
import { StatsPage } from './stats/stats';
import { SupportPage } from './support/support';
import { FriendsPage } from './friends/friends';
import { EventsModal } from './events-modal/events-modal';


export const pages: any[] = [
    AboutPage, ArtistPage, LoginPage, PortfolioPage, ResetPasswordPage,
    SearchPage, SignupPage, StatsPage, SupportPage, FriendsPage, EventsModal
];

export * from './about/about';
export * from './artist/artist';
export * from './login/login';
export * from './portfolio/portfolio';
export * from './reset-password/reset-password';
export * from './search/search';
export * from './signup/signup';
export * from './stats/stats';
export * from './support/support';
export * from './friends/friends';
export * from './events-modal/events-modal';
