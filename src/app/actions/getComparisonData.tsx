'use server';

export default async function getComparisonData(
    periodType: string,
    period1: string,
    period2: string
) {
    try {
        const response = await fetch(
            `http://localhost:5555/comparisonData?periodType=${periodType}&period1=${period1}&period2=${period2}`
        );

        const json = await response.json();
        return json;
    } catch (error) {
        console.error('Error fetching comparison data:', error);
        return { ok: false, error };
    }
}
