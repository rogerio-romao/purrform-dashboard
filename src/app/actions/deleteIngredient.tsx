import { BACKEND_BASE_URL } from '../lib/definitions';

export default async function deleteIngredient(id: number): Promise<boolean> {
    try {
        const response = await fetch(
            `${BACKEND_BASE_URL}/deleteTraceabilityIngredient?id=${id}`
        );

        if (!response.ok) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}
