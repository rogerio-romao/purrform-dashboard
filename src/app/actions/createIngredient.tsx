interface TraceabilityIngredient {
    title: string;
    location: string;
    latitude: number;
    longitude: number;
}

interface TraceabilityIngredientWithId extends TraceabilityIngredient {
    id: number;
}

type CreateIngredientResponse =
    | TraceabilityIngredientWithId
    | { error: string };

export default async function createIngredient(
    ingredient: TraceabilityIngredient
): Promise<CreateIngredientResponse> {
    try {
        const { title, location, latitude, longitude } = ingredient;

        const response = await fetch(
            `https://purrform-apps-027e.onrender.com/createTraceabilityIngredient?title=${title}&location=${location}&latitude=${latitude}&longitude=${longitude}`
        );

        if (!response.ok) {
            return { error: 'Failed to create ingredient' };
        }

        const data = await response.json();

        if (data.error) {
            return { error: data.error };
        }

        return data;
    } catch (error) {
        return { error: 'Failed to create ingredient' };
    }
}
