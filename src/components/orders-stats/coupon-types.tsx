'use client';
import { useEffect, useState } from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface CouponType {
    id: number;
    name: string;
    prefix: string;
    description: string;
    details: string;
}

export default function CouponTypes() {
    const [couponTypes, setCouponTypes] = useState<CouponType[]>([]);

    useEffect(() => {
        const fetchCouponTypes = async () => {
            const response = await fetch(
                'https://ecb8-2a01-4b00-805d-b800-859-805d-88b9-e154.ngrok-free.app/getCouponTypes'
            );
            const data = (await response.json()) as CouponType[];
            setCouponTypes(data);
        };
        fetchCouponTypes();
    }, []);

    if (couponTypes.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Coupon Code Types</CardTitle>
                <CardDescription>
                    List of the different types of coupon codes and their
                    prefixes.
                </CardDescription>
            </CardHeader>
            <CardContent className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {couponTypes.map((coupon) => (
                    <Card key={coupon.id} className='flex flex-col'>
                        <CardHeader>
                            <CardTitle className='text-lg'>
                                {coupon.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='flex-1'>
                            <CardDescription>
                                {coupon.description} {coupon.details}
                            </CardDescription>
                        </CardContent>
                        <CardFooter>
                            Prefix:{' '}
                            <span className='font-semibold ml-1 text-lg text-green-600'>
                                {coupon.prefix}
                            </span>
                        </CardFooter>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
}
