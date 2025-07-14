'use client';

import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import { BACKEND_BASE_URL } from '@/app/lib/definitions';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import CouponTypesCurrentMonthBreakdown from './coupon-types-current-month-breakdown';

import type { CouponType } from '@/app/lib/types';

export default function CouponTypesBreakdown() {
    const [couponTypes, setCouponTypes] = useState<CouponType[]>([]);

    useEffect(() => {
        const fetchCouponTypes = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_BASE_URL}/getCouponTypes`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch coupon types');
                }
                const data = (await response.json()) as CouponType[];

                const sortedData = data.sort((a, b) => {
                    return a.prefix.localeCompare(b.prefix);
                });

                setCouponTypes(sortedData);
            } catch (error) {
                console.error('Error fetching coupon types:', error);
            }
        };

        fetchCouponTypes();
    }, []);

    return (
        <Card>
            <CardHeader className='px-7'>
                <CardTitle>Coupon Codes by Type</CardTitle>
                <CardDescription className='flex items-center gap-2'>
                    Current month breakdown
                    <TrendingUp className='h-4 w-4' />
                </CardDescription>
            </CardHeader>
            <section className='grid lg:grid-cols-1'>
                <CardContent>
                    <CouponTypesCurrentMonthBreakdown
                        couponTypes={couponTypes}
                    />
                </CardContent>
            </section>
        </Card>
    );
}
