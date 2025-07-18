'use client';

import { useEffect, useState } from 'react';

import getComparisonData from '@/app/actions/getComparisonData';

import ComparisonCharts from './comparison-charts';
import TimeSelection from './time-selection';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
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

interface ComparisonData {
    sales_value: number;
    sales_nr: number;
    loyalty_value: number;
    loyalty_nr: number;
    coupons_value: number;
    coupons_nr: number;
    label: string;
}

type ControlPanelComparisonDataResponse =
    | { ok: true; data: { period1: ComparisonData; period2: ComparisonData } }
    | { ok: false; error: string };

export default function PeriodComparisonCoupons() {
    const [selectedPeriodType, setSelectedPeriodType] = useState<string>('');
    const [selectedPeriod1, setSelectedPeriod1] = useState<string>('');
    const [selectedPeriod2, setSelectedPeriod2] = useState<string>('');

    const [couponTypes, setCouponTypes] = useState<CouponType[]>([]);
    const [selectedCouponPrefix, setSelectedCouponPrefix] =
        useState<string>('');

    const [period1Data, setPeriod1Data] = useState<ComparisonData | null>(null);
    const [period2Data, setPeriod2Data] = useState<ComparisonData | null>(null);
    const [fetchDataError, setFetchDataError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCouponTypes = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_BASE_URL}/getCouponTypes`
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
        const comparisonData: ControlPanelComparisonDataResponse =
            await getComparisonData(
                selectedPeriodType,
                selectedPeriod1,
                selectedPeriod2
            );

        if (!comparisonData.ok) {
            console.error(
                'Error fetching comparison data:',
                comparisonData.error
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
        <Card>
            <CardHeader className='px-7 relative mb-3'>
                <CardTitle className='mb-3'>
                    Coupon Types - Compare Time Periods
                </CardTitle>
                <div className='grid grid-cols-3 mb-3'>
                    <CardDescription className='flex flex-col gap-2 col-span-2'>
                        Select time periods to compare
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
                    </CardDescription>
                    <CardDescription className='flex flex-col gap-2 col-span-1'>
                        Select coupon type
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
                    </CardDescription>
                </div>
                {showGetDataButton ? (
                    <Button
                        size={'lg'}
                        className='md:absolute top-4 right-6'
                        onClick={handleGetData}
                    >
                        Get Data
                    </Button>
                ) : null}
            </CardHeader>
            {fetchDataError ? (
                <CardContent className='text-red-500 py-2 px-6'>
                    {fetchDataError}. Please try again.
                </CardContent>
            ) : null}
            {selectedPeriodType ? (
                <TimeSelection
                    minYearForOrders={2024}
                    selectedPeriodType={selectedPeriodType}
                    selectedPeriod1={selectedPeriod1}
                    handleSelectPeriod1={handleSelectPeriod1}
                    selectedPeriod2={selectedPeriod2}
                    handleSelectPeriod2={handleSelectPeriod2}
                />
            ) : null}
            <ComparisonCharts
                period1Data={period1Data}
                period2Data={period2Data}
            />
        </Card>
    );
}
