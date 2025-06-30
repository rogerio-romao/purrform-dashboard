import { BACKEND_BASE_URL } from '../lib/definitions';

interface TraceabilityIngredient {
    title: string;
    location: string;
    latitude: number;
    longitude: number;
}

interface TraceabilityIngredientWithId extends TraceabilityIngredient {
    id: number;
}

type UpdateIngredientResponse =
    | TraceabilityIngredientWithId
    | { error: string };

export default async function updateIngredient(
    ingredient: TraceabilityIngredientWithId
): Promise<UpdateIngredientResponse> {
    try {
        const { id, title, location, latitude, longitude } = ingredient;

        const response = await fetch(
            `${BACKEND_BASE_URL}/updateTraceabilityIngredient?id=${id}&title=${title}&location=${location}&latitude=${latitude}&longitude=${longitude}`
        );

        if (!response.ok) {
            return { error: 'Failed to update ingredient' };
        }

        const data = await response.json();

        if (data.error) {
            return { error: data.error };
        }

        return data;
    } catch (error) {
        return { error: 'Failed to update ingredient' };
    }
}
