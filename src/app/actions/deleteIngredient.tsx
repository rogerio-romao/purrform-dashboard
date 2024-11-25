export default async function deleteIngredient(id: number): Promise<boolean> {
    try {
        const response = await fetch(
            `https://purrform-apps-027e.onrender.com/deleteTraceabilityIngredient?id=${id}`
        );

        if (!response.ok) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}
