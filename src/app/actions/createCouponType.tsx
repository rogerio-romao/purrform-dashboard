import { BACKEND_BASE_URL } from '../lib/definitions';

interface CouponType {
    name: string;
    prefix: string;
    description?: string;
    details?: string;
}

interface CouponTypeWithId extends CouponType {
    id: number;
}

type CreateCouponTypeResponse = CouponTypeWithId | { error: string };

export default async function createCouponType(
    couponType: CouponType
): Promise<CreateCouponTypeResponse> {
    try {
        const { name, prefix, description, details } = couponType;

        const searchParams = new URLSearchParams({
            name,
            prefix: prefix.toUpperCase(),
            description: description || '',
            details: details || '',
        });

        const response = await fetch(
            `https://ecb8-2a01-4b00-805d-b800-859-805d-88b9-e154.ngrok-free.app/createCouponType?${searchParams.toString()}`
        );

        if (!response.ok) {
            return { error: 'Failed to create coupon type' };
        }

        const createdCoupon =
            (await response.json()) as CreateCouponTypeResponse;

        return createdCoupon;
    } catch (error) {
        return { error: 'Failed to create coupon type' };
    }
}
