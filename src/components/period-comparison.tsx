'use client';

import OrdersNumberBarChart from '@/components/orders-number-bar-chart';
import OrdersValueBarChart from '@/components/orders-value-bar-chart';
import TimeSelection from './time-selection';

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
import { useState } from 'react';

type OrdersNumberBarChartProps = {
    month: string;
    orders: number;
    loyalty: number;
    percent: number;
}[];

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

    const handleSelectPeriodType = (value: string) => {
        setSelectedPeriodType(value);
    };

    const handleSelectPeriod1 = (value: string) => {
        setSelectedPeriod1(value);
    };

    const handleSelectPeriod2 = (value: string) => {
        setSelectedPeriod2(value);
    };

    return (
        <Card>
            <CardHeader className='px-7'>
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
            </CardHeader>
            {selectedPeriodType ? (
                <TimeSelection
                    selectedPeriodType={selectedPeriodType}
                    selectedPeriod1={selectedPeriod1}
                    handleSelectPeriod1={handleSelectPeriod1}
                    selectedPeriod2={selectedPeriod2}
                    handleSelectPeriod2={handleSelectPeriod2}
                />
            ) : null}
            <section className='grid lg:grid-cols-2'>
                <CardContent>
                    <OrdersValueBarChart chartData={ordersValueChartData} />
                </CardContent>
                <CardContent>
                    <OrdersNumberBarChart chartData={ordersNumberChartData} />
                </CardContent>
            </section>
        </Card>
    );
}
