'use server';

import { BACKEND_BASE_URL } from '@/app/lib/definitions';

export default async function getSinglePeriodData(
    periodType: string,
    period: string
) {
    try {
        const response = await fetch(
            // `${BACKEND_BASE_URL}/singlePeriodData?periodType=${periodType}&period=${period}`
            `https://7eaf77623caf.ngrok-free.app/singlePeriodData?periodType=${periodType}&period=${period}`
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }

        const json = await response.json();
        console.log('Single period data fetched:', json);
        return json;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching single period data:', error.message);
            return { ok: false, error: error.message };
        }

        console.error('Error fetching single period data:', error);
        return { ok: false, error: 'An error occurred' };
    }
}
