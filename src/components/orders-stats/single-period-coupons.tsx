'use client';

import { useEffect, useState } from 'react';

import getSinglePeriodDataCoupons from '@/app/actions/getSinglePeriodDataCoupons';

import SinglePeriodChartsCoupons from './single-period-charts-coupons';
import TimeSelectionSingle from './time-selection-single';

import { Button } from '@/components/ui/button';
import { CardContent, CardHeader } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { BACKEND_BASE_URL } from '@/app/lib/definitions';
import type { CouponType } from '@/app/lib/types';

interface CouponPeriodData {
    coupon_prefix: string;
    coupon_value?: number;
    coupon_nr?: number;
    label: string;
}

export default function SinglePeriodCoupons() {
    const [selectedPeriodType, setSelectedPeriodType] = useState<string>('');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('');

    const [couponTypes, setCouponTypes] = useState<CouponType[]>([]);
    const [selectedCouponPrefix, setSelectedCouponPrefix] =
        useState<string>('');

    const [periodData, setPeriodData] = useState<CouponPeriodData | null>(null);
    const [fetchDataError, setFetchDataError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCouponTypes = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_BASE_URL}/getCouponTypes`
                );
                const data = (await response.json()) as CouponType[];

                const sortedData = data.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                setCouponTypes(sortedData);
            } catch (error) {
                console.error('Error fetching coupon types:', error);
            }
        };
        fetchCouponTypes();
    }, []);

    const showGetDataButton = selectedPeriod && selectedCouponPrefix;

    const handleSelectPeriodType = (value: string) => {
        setSelectedPeriodType(value);
        setSelectedPeriod('');
    };

    const handleSelectPeriod = (value: string) => {
        setSelectedPeriod(value);
    };

    const handleGetData = async () => {
        const result = await getSinglePeriodDataCoupons(
            selectedPeriodType,
            selectedPeriod,
            selectedCouponPrefix
        );

        if (!result.ok) {
            console.error(
                'Error fetching single period data for coupons:',
                result.error
            );
            setPeriodData(null);
            setFetchDataError(result.error);
            return;
        }

        setFetchDataError(null);
        setPeriodData(result.data.period);
    };

    return (
        <>
            <CardHeader className='px-7'>
                <div className='flex items-center gap-4 flex-wrap'>
                    <div className='flex items-center gap-2'>
                        <span className='text-sm text-muted-foreground whitespace-nowrap'>Period Type</span>
                        <Select
                            value={selectedPeriodType}
                            onValueChange={handleSelectPeriodType}
                        >
                            <SelectTrigger className='w-[180px]'>
                                <SelectValue placeholder='Select Period' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Year'>Year</SelectItem>
                                <SelectItem value='Month'>Month</SelectItem>
                                <SelectItem value='Week'>Week</SelectItem>
                                <SelectItem value='Day'>Day</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='text-sm text-muted-foreground whitespace-nowrap'>Coupon Type</span>
                        <Select
                            value={selectedCouponPrefix}
                            onValueChange={setSelectedCouponPrefix}
                        >
                            <SelectTrigger className='w-[300px]'>
                                <SelectValue placeholder='Select Coupon Type' />
                            </SelectTrigger>
                            <SelectContent>
                                {couponTypes.map((couponType) => (
                                    <SelectItem
                                        key={couponType.id}
                                        value={couponType.prefix}
                                    >
                                        <span>{couponType.name}</span>
                                        <span className='ml-1 text-green-600 text-xs'>
                                            ({couponType.prefix})
                                        </span>
                                    </SelectItem>
                                ))}
                                <SelectSeparator />
                                <SelectItem value='OTHER'>
                                    Other Coupon Types
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {showGetDataButton ? (
                        <Button
                            size={'lg'}
                            className='ml-auto'
                            onClick={handleGetData}
                        >
                            Get Data
                        </Button>
                    ) : null}
                </div>
            </CardHeader>
            {fetchDataError ? (
                <CardContent className='text-red-500 py-2 px-6'>
                    {fetchDataError}. Please try again.
                </CardContent>
            ) : null}
            {selectedPeriodType ? (
                <TimeSelectionSingle
                    minYearForOrders={2024}
                    minMonthForOrdersOnFirstYear={8}
                    startDay={1}
                    selectedPeriodType={selectedPeriodType}
                    selectedPeriod={selectedPeriod}
                    handleSelectPeriod={handleSelectPeriod}
                />
            ) : null}
            <SinglePeriodChartsCoupons periodData={periodData} />
        </>
    );
}
