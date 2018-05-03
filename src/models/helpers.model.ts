import { INosArtistMap, INosArtist } from './artist.model';
import { filter, includes } from 'lodash';


export function getArtistsByKeys(artists: INosArtistMap, keys = {}): INosArtist[] {
    const result = [];

    Object.keys(keys).forEach((key) => {
        if (artists[key]) {
            result.push(artists[key]);
        }
    });

    return result;
}

export function filterByValues(collection: any[], property: string, values: string[]): any[] {
    return filter(collection, (item) => {
        return includes(values, item[property]);
    });
}
