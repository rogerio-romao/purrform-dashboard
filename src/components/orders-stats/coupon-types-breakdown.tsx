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
import {
    CollapseToggleButton,
    CollapsibleContent,
} from '@/components/ui/collapsible-card-content';

import CouponTypes6MonthBreakdown from './coupon-types-6-month-breakdown';
import CouponTypesCurrentMonthBreakdown from './coupon-types-current-month-breakdown';

import type { CouponType } from '@/app/lib/types';

export default function CouponTypesBreakdown() {
    const [couponTypes, setCouponTypes] = useState<CouponType[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        const fetchCouponTypes = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_BASE_URL}/getCouponTypes`,
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
                <CardTitle className='flex justify-between items-center'>
                    <span>Coupon Codes by Type</span>
                    <CollapseToggleButton
                        isExpanded={isExpanded}
                        onToggle={() => setIsExpanded(!isExpanded)}
                    />
                </CardTitle>
                <CardDescription className='flex items-center gap-2'>
                    Current month breakdown and 6 months breakdown of coupon
                    stats by type of coupon.
                    <TrendingUp className='h-4 w-4' />
                </CardDescription>
            </CardHeader>
            <CollapsibleContent isExpanded={isExpanded}>
                <section className='grid lg:grid-cols-1'>
                    <CardContent>
                        <CouponTypesCurrentMonthBreakdown
                            couponTypes={couponTypes}
                        />
                    </CardContent>
                </section>
                <section className='grid lg:grid-cols-1'>
                    <CardContent>
                        <CouponTypes6MonthBreakdown couponTypes={couponTypes} />
                    </CardContent>
                </section>
            </CollapsibleContent>
        </Card>
    );
}
