'use server';

import { BACKEND_BASE_URL } from '@/app/lib/definitions';

export default async function getComparisonData(
    periodType: string,
    period1: string,
    period2: string
) {
    try {
        const response = await fetch(
            `${BACKEND_BASE_URL}/comparisonData?periodType=${periodType}&period1=${period1}&period2=${period2}`
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }

        const json = await response.json();
        return json;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching comparison data:', error.message);
            return { ok: false, error: error.message };
        }

        console.error('Error fetching comparison data:', error);
        return { ok: false, error: 'An error occurred' };
    }
}
