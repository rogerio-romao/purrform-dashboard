'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import PeriodComparisonGlobal from './period-comparison-global';
import SinglePeriodGlobal from './single-period-global';

type OrdersNumberBarChartProps = {
    month: string;
    orders: number;
    loyalty: number;
    loyaltyPercentage: number;
    coupons: number;
    couponsPercentage: number;
}[];

interface SalesStatisticsWrapperProps {
    ordersValueChartData: OrdersNumberBarChartProps;
    ordersNumberChartData: OrdersNumberBarChartProps;
}

export default function SalesStatisticsWrapper({
    ordersValueChartData,
    ordersNumberChartData,
}: SalesStatisticsWrapperProps) {
    const [statisticsType, setStatisticsType] = useState<
        'single' | 'comparison'
    >('comparison');

    return (
        <Card>
            <CardHeader className='px-7 relative'>
                <CardTitle className='flex justify-between'>
                    <div>
                        Sales Statistics -{' '}
                        {statisticsType === 'comparison'
                            ? 'Period Comparison'
                            : 'Single Period'}
                    </div>
                    <div className='flex items-center'>
                        <Label htmlFor='comparison-toggle' className='mr-2'>
                            {statisticsType === 'comparison'
                                ? 'Comparison'
                                : 'Single'}
                        </Label>
                        <Switch
                            id='comparison-toggle'
                            checked={statisticsType === 'comparison'}
                            onCheckedChange={(checked) =>
                                setStatisticsType(
                                    checked ? 'comparison' : 'single'
                                )
                            }
                        />
                    </div>
                </CardTitle>
            </CardHeader>
            {statisticsType === 'comparison' ? (
                <PeriodComparisonGlobal
                    ordersValueChartData={ordersValueChartData}
                    ordersNumberChartData={ordersNumberChartData}
                />
            ) : (
                <SinglePeriodGlobal />
            )}
        </Card>
    );
}
