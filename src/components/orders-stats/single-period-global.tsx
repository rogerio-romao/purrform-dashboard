'use client';

import { useState } from 'react';

import getSinglePeriodData from '@/app/actions/getSinglePeriodData';

import SinglePeriodCharts from './single-period-charts';
import TimeSelectionSingle from './time-selection-single';

import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type OrdersNumberBarChartProps = {
    month: string;
    orders: number;
    loyalty: number;
    loyaltyPercentage: number;
    coupons: number;
    couponsPercentage: number;
} | null;

interface PeriodData {
    sales_value: number;
    sales_nr: number;
    loyalty_value: number;
    loyalty_nr: number;
    coupons_value: number;
    coupons_nr: number;
    label: string;
}

type ControlPanelComparisonDataResponse =
    | { ok: true; data: { period: PeriodData } }
    | { ok: false; error: string };

interface SinglePeriodProps {
    ordersValueChartData: OrdersNumberBarChartProps;
    ordersNumberChartData: OrdersNumberBarChartProps;
}

export default function SinglePeriodGlobal() {
    const [selectedPeriodType, setSelectedPeriodType] = useState<string>('');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('');
    const [periodData, setPeriodData] = useState<PeriodData | null>(null);
    const [fetchDataError, setFetchDataError] = useState<string | null>(null);

    const handleSelectPeriodType = (value: string) => {
        setSelectedPeriodType(value);
        setSelectedPeriod('');
    };

    const handleSelectPeriod = (value: string) => {
        setSelectedPeriod(value);
    };

    const handleGetData = async () => {
        const singlePeriodData: ControlPanelComparisonDataResponse =
            await getSinglePeriodData(selectedPeriodType, selectedPeriod);

        if (!singlePeriodData.ok) {
            console.error(
                'Error fetching single period data:',
                singlePeriodData.error
            );
            setPeriodData(null);
            setFetchDataError(singlePeriodData.error);
            return;
        }

        setFetchDataError(null);
        setPeriodData(singlePeriodData.data.period);
    };

    return (
        <>
            <CardHeader className='px-7 relative'>
                <CardDescription className='flex flex-col gap-2'>
                    Select time period
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
                {selectedPeriod ? (
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
                <TimeSelectionSingle
                    selectedPeriodType={selectedPeriodType}
                    selectedPeriod={selectedPeriod}
                    handleSelectPeriod={handleSelectPeriod}
                />
            ) : null}
            <SinglePeriodCharts periodData={periodData} />
        </>
    );
}
