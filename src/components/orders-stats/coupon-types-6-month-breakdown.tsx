'use client';

import { useEffect, useState } from 'react';

import Loading from '@/components/common/loading';
import CouponTypes6MonthBreakdownChartByNumber from './coupon-types-6-month-breakdown-chart-by-number';
import CouponTypes6MonthBreakdownChartByValue from './coupon-types-6-month-breakdown-chart-by-value';

import { BACKEND_BASE_URL } from '@/app/lib/definitions';
import type { CouponType, CouponTypeMonthBreakdown } from '@/app/lib/types';
import { generateLast6MonthStrings } from '@/app/lib/utils';

type CouponTypesCurrentMonthBreakdownResponse =
    | { data: CouponTypeMonthBreakdown[] }
    | { error: string };

interface CouponTypes6MonthBreakdownProps {
    couponTypes: CouponType[];
}

export default function CouponTypes6MonthBreakdown({
    couponTypes,
}: CouponTypes6MonthBreakdownProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<CouponTypeMonthBreakdown[]>([]);

    // get the month and year of 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    const sixMonthsAgoMonthNumeric = new Intl.DateTimeFormat('en-UK', {
        month: 'numeric',
    }).format(sixMonthsAgo);
    const sixMonthsAgoMonthLong = new Intl.DateTimeFormat('en-UK', {
        month: 'long',
    }).format(sixMonthsAgo);
    const sixMonthsAgoYear = sixMonthsAgo.getFullYear();
    const sixMonthsAgoMonthYear = `${sixMonthsAgoMonthLong}-${sixMonthsAgoYear}`;

    // get the current month and year
    const currentMonth = new Date();
    const currentMonthLong = new Intl.DateTimeFormat('en-UK', {
        month: 'long',
    }).format(currentMonth);
    const currentMonthYear = `${currentMonthLong}-${currentMonth.getFullYear()}`;

    const last6Months = generateLast6MonthStrings(
        Number(sixMonthsAgoMonthNumeric),
        sixMonthsAgoYear
    );

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${BACKEND_BASE_URL}/getCouponTypesSemester?startMonth=${sixMonthsAgoMonthNumeric}&startYear=${sixMonthsAgoYear}`
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
        <section className='grid lg:grid-cols-1 gap-6'>
            <CouponTypes6MonthBreakdownChartByValue
                currentPeriod={`${sixMonthsAgoMonthYear} to ${currentMonthYear}`}
                last6Months={last6Months}
                chartData={data}
                couponTypes={couponTypes}
            />
            <CouponTypes6MonthBreakdownChartByNumber
                currentPeriod={`${sixMonthsAgoMonthYear} to ${currentMonthYear}`}
                last6Months={last6Months}
                chartData={data}
                couponTypes={couponTypes}
            />
        </section>
    );
}
