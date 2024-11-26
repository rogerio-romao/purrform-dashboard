'use server';

import type { TraceabilityIngredientsGeodata } from '@/app/lib/types';

export default async function getCoordinates(location: string) {
    try {
        const response = await fetch(
            `https://api.mapbox.com/search/geocode/v6/forward?q=${location}&access_token=${process.env.MAPBOX_PUBLIC_TOKEN}`
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }

        const json = (await response.json()) as TraceabilityIngredientsGeodata;
        if (json.features.length === 0) {
            throw new Error('No results found');
        }

        return {
            ok: true,
            data: {
                longitude: json.features[0].geometry.coordinates[0],
                latitude: json.features[0].geometry.coordinates[1],
            },
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching coordinates data:', error.message);
            return { ok: false, error: error.message };
        }

        console.error('Error fetching coordinates data:', error);
        return { ok: false, error: 'An error occurred' };
    }
}
