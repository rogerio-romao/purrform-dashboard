'use server';

import { BACKEND_BASE_URL } from '@/app/lib/definitions';

interface ComparisonDataCoupons {
    coupon_prefix: string;
    coupon_value?: number;
    coupon_nr?: number;
    label: string;
}

export type SinglePeriodDataCouponsResponse =
    | { ok: true; data: { period: ComparisonDataCoupons } }
    | { ok: false; error: string };

export default async function getSinglePeriodDataCoupons(
    periodType: string,
    period: string,
    couponPrefix: string
): Promise<SinglePeriodDataCouponsResponse> {
    try {
        const response = await fetch(
            `${BACKEND_BASE_URL}/singlePeriodDataCoupons?periodType=${periodType}&period=${period}&couponPrefix=${couponPrefix}`
        );

        if (!response.ok) {
            const error = (await response.json()) as { error: string };
            throw new Error(error.error);
        }

        const json = (await response.json()) as SinglePeriodDataCouponsResponse;
        if (!json.ok) {
            throw new Error(json.error);
        }

        return json;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(
                'Error fetching single period data for coupons:',
                error.message
            );
            return { ok: false, error: error.message };
        }

        console.error('Error fetching single period data for coupons:', error);
        return { ok: false, error: 'An error occurred' };
    }
}
