'use client';

import { useEffect, useState } from 'react';

import Loading from '@/components/common/loading';
import CouponTypesCurrentMonthBreakdownChart from './coupon-types-current-month-breakdown-chart';

import { BACKEND_BASE_URL } from '@/app/lib/definitions';
import type { CouponType, CouponTypeMonthBreakdown } from '@/app/lib/types';

type CouponTypesCurrentMonthBreakdownResponse =
    | { data: CouponTypeMonthBreakdown[] }
    | { error: string };

interface CouponTypesCurrentMonthBreakdownProps {
    couponTypes: CouponType[];
}

export default function CouponTypesCurrentMonthBreakdown({
    couponTypes,
}: CouponTypesCurrentMonthBreakdownProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<CouponTypeMonthBreakdown[]>([]);

    // get the current month and year as a string in the format "July-2025"
    const currentMonth = new Intl.DateTimeFormat('en-UK', {
        month: 'long',
    }).format(new Date());
    const currentYear = new Date().getFullYear();
    const currentMonthYear = `${currentMonth}-${currentYear}`;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${BACKEND_BASE_URL}/getCouponTypesCurrentMonth?month=${currentMonthYear}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data =
                    (await response.json()) as CouponTypesCurrentMonthBreakdownResponse;

                if ('error' in data) {
                    throw new Error(data.error);
                }

                const sortedData = data.data.sort((a, b) => {
                    return a.coupon_prefix.localeCompare(b.coupon_prefix);
                });

                setData(sortedData);
                setError(null);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <CouponTypesCurrentMonthBreakdownChart
            currentMonthYear={currentMonthYear}
            chartData={data}
            couponTypes={couponTypes}
        />
    );
}
