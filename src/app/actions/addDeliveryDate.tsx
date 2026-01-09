import { BACKEND_BASE_URL } from '../lib/definitions';

import type { DeliveryDate } from '../lib/types';

type AddDeliveryDateResponse = DeliveryDate | { error: string };

export default async function addDeliveryDate(
    date: string,
    slots: number
): Promise<AddDeliveryDateResponse> {
    try {
        const response = await fetch(
            `${BACKEND_BASE_URL}/addDeliveryDate?date=${date}&slots=${slots}`
        );

        if (!response.ok) {
            return { error: 'Failed to add delivery date' };
        }

        const data = await response.json();

        if (data.error) {
            return { error: data.error };
        }

        return data;
    } catch (error) {
        return { error: 'Failed to add delivery date' };
    }
}
