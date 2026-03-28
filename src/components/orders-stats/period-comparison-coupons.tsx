'use client';

import { useEffect, useState } from 'react';

import getComparisonDataCoupons from '@/app/actions/getComparisonDataCoupons';

import ComparisonChartsCoupons from './comparison-charts-coupons';
import TimeSelection from './time-selection';

import { Button } from '@/components/ui/button';
import {
    CardContent,
    CardHeader,
} from '@/components/ui/card';
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

interface ComparisonDataCoupons {
    coupon_prefix: string;
    coupon_value?: number;
    coupon_nr?: number;
    label: string;
}

type ControlPanelComparisonDataCouponsResponse =
    | {
          ok: true;
          data: {
              period1: ComparisonDataCoupons;
              period2: ComparisonDataCoupons;
          };
      }
    | { ok: false; error: string };

export default function PeriodComparisonCoupons() {
    const [selectedPeriodType, setSelectedPeriodType] = useState<string>('');
    const [selectedPeriod1, setSelectedPeriod1] = useState<string>('');
    const [selectedPeriod2, setSelectedPeriod2] = useState<string>('');

    const [couponTypes, setCouponTypes] = useState<CouponType[]>([]);
    const [selectedCouponPrefix, setSelectedCouponPrefix] =
        useState<string>('');

    const [period1Data, setPeriod1Data] =
        useState<ComparisonDataCoupons | null>(null);
    const [period2Data, setPeriod2Data] =
        useState<ComparisonDataCoupons | null>(null);
    const [fetchDataError, setFetchDataError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCouponTypes = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_BASE_URL}/getCouponTypes`,
                );
                const data = (await response.json()) as CouponType[];

                const sortedData = data.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
                setCouponTypes(sortedData);
            } catch (error) {
                console.error('Error fetching coupon types:', error);
            }
        };
        fetchCouponTypes();
    }, []);

    const showGetDataButton =
        selectedPeriod1 && selectedPeriod2 && selectedCouponPrefix;

    const handleSelectPeriodType = (value: string) => {
        setSelectedPeriodType(value);
        setSelectedPeriod1('');
        setSelectedPeriod2('');
    };

    const handleSelectPeriod1 = (value: string) => {
        setSelectedPeriod1(value);
    };

    const handleSelectPeriod2 = (value: string) => {
        setSelectedPeriod2(value);
    };

    const handleGetData = async () => {
        const comparisonData = await getComparisonDataCoupons(
            selectedPeriodType,
            selectedPeriod1,
            selectedPeriod2,
            selectedCouponPrefix,
        );

        if (!comparisonData.ok) {
            console.error(
                'Error fetching comparison data for coupons:',
                comparisonData.error,
            );
            setPeriod1Data(null);
            setPeriod2Data(null);
            setFetchDataError(comparisonData.error);
            return;
        }

        setFetchDataError(null);
        setPeriod1Data(comparisonData.data.period1);
        setPeriod2Data(comparisonData.data.period2);
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
                <TimeSelection
                    minYearForOrders={2024}
                    minMonthForOrdersOnFirstYear={8}
                    startDay={1}
                    selectedPeriodType={selectedPeriodType}
                    selectedPeriod1={selectedPeriod1}
                    handleSelectPeriod1={handleSelectPeriod1}
                    selectedPeriod2={selectedPeriod2}
                    handleSelectPeriod2={handleSelectPeriod2}
                />
            ) : null}
            <ComparisonChartsCoupons
                period1Data={period1Data}
                period2Data={period2Data}
            />
        </>
    );
}
