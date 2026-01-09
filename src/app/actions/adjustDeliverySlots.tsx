import { BACKEND_BASE_URL } from '../lib/definitions';

import type { DeliveryDate } from '../lib/types';

type AddDeliverySlotsResponse = DeliveryDate | { error: string };

export default async function adjustDeliverySlots(
    deliveryDate: DeliveryDate
): Promise<AddDeliverySlotsResponse> {
    try {
        const { id, slots } = deliveryDate;

        const response = await fetch(
            `${BACKEND_BASE_URL}/adjustDeliverySlots?id=${id}&slots=${slots}`
        );

        if (!response.ok) {
            return { error: 'Failed to adjust delivery slots' };
        }

        const data = await response.json();

        if (data.error) {
            return { error: data.error };
        }

        return data;
    } catch (error) {
        return { error: 'Failed to adjust delivery slots' };
    }
}
