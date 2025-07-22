import { BACKEND_BASE_URL } from '@/app/lib/definitions';

interface ComparisonDataCoupons {
    coupon_prefix: string;
    coupon_value?: number;
    coupon_nr?: number;
    label: string;
}

export type ControlPanelComparisonDataCouponsResponse =
    | {
          ok: true;
          data: {
              period1: ComparisonDataCoupons;
              period2: ComparisonDataCoupons;
          };
      }
    | { ok: false; error: string };

export default async function getComparisonDataCoupons(
    periodType: string,
    period1: string,
    period2: string,
    couponPrefix: string
): Promise<ControlPanelComparisonDataCouponsResponse> {
    try {
        const response = await fetch(
            `${BACKEND_BASE_URL}/comparisonDataCoupons?periodType=${periodType}&period1=${period1}&period2=${period2}&couponPrefix=${couponPrefix}`
        );

        if (!response.ok) {
            const error = (await response.json()) as { error: string };
            throw new Error(error.error);
        }

        const json =
            (await response.json()) as ControlPanelComparisonDataCouponsResponse;
        if (!json.ok) {
            throw new Error(json.error);
        }

        return json;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(
                'Error fetching comparison data for coupons:',
                error.message
            );
            return { ok: false, error: error.message };
        }

        console.error('Error fetching comparison data for coupons:', error);
        return { ok: false, error: 'An error occurred' };
    }
}
