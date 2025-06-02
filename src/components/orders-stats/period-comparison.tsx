'use client';

import { useState } from 'react';

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
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type OrdersNumberBarChartProps = {
    month: string;
    orders: number;
    loyalty: number;
    percent: number;
}[];

interface ComparisonData {
    sales_value: number;
    sales_nr: number;
    loyalty_value: number;
    loyalty_nr: number;
    label: string;
}

type ControlPanelComparisonDataResponse =
    | { ok: true; data: { period1: ComparisonData; period2: ComparisonData } }
    | { ok: false; error: string };

interface PeriodComparisonProps {
    ordersValueChartData: OrdersNumberBarChartProps;
    ordersNumberChartData: OrdersNumberBarChartProps;
}

export default function PeriodComparison(
    { ordersValueChartData, ordersNumberChartData }: PeriodComparisonProps = {
        ordersValueChartData: [],
        ordersNumberChartData: [],
    }
) {
    const [selectedPeriodType, setSelectedPeriodType] = useState<string>('');
    const [selectedPeriod1, setSelectedPeriod1] = useState<string>('');
    const [selectedPeriod2, setSelectedPeriod2] = useState<string>('');
    const [period1Data, setPeriod1Data] = useState<ComparisonData | null>(null);
    const [period2Data, setPeriod2Data] = useState<ComparisonData | null>(null);
    const [fetchDataError, setFetchDataError] = useState<string | null>(null);

    const showGetDataButton = selectedPeriod1 && selectedPeriod2;

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
            <CardHeader className='px-7 relative'>
                <CardTitle>Compare Time Periods</CardTitle>
                <CardDescription className='flex flex-col gap-2'>
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
