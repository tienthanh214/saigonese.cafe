import Fuse from 'fuse.js';
import { writable } from 'svelte/store';
import categories_list from '../category.json';
import raw from '../data.json';
import { region_map } from './config';
export interface CafeShop {
	coordinates: [number, number];
	properties: Record<string, string>;
}

export const rawData = Object.freeze(raw);

export type Regions = keyof typeof rawData;

export const regions = Object.entries(rawData).map(([key]) => ({
	key: key as Regions,
	name: region_map[key].name
}));

export const categories = Object.freeze(categories_list);

export const geo = Object.freeze({
	type: 'FeatureCollection',
	features: Object.values(rawData).flatMap((i) => i.data.features)
});

export const geoByRegion = (region: Regions) =>
	Object.freeze({
		type: 'FeatureCollection',
		features: region === 'sai-gon' ? geo.features : rawData[region].data.features
	});

export const shops = Object.freeze(
	geo.features.map((i) => ({ ...i, coordinates: i.geometry.coordinates } as unknown as CafeShop))
);

export const shopsByRegion = (region: Regions) =>
	Object.freeze(
		geoByRegion(region).features.map(
			(i) => ({ ...i, coordinates: i.geometry.coordinates } as unknown as CafeShop)
		)
	);

export const fuseByName = new Fuse(shops, {
	includeScore: false,
	keys: [['properties', 'name']]
});

export const fuseByNameWithRegion = (region: Regions) =>
	new Fuse<CafeShop>(shopsByRegion(region), {
		includeScore: false,
		keys: [['properties', 'name']]
	});

export const region = writable<Regions>('sai-gon');
export const category = writable('cafe');
export const filter = writable('all');
export const loc = writable<[number, number] | null>(null);
export const about = writable(false);
export const searchOpen = writable(false);
export const searchString = writable('');

export const cities = Object.entries(raw);

export const shop = writable<CafeShop | null>(null);

export const appInfo = writable<boolean>(false);
