'use client';

import { TrendingUp } from 'lucide-react';
import { useState } from 'react';

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

import OrdersNumberBarChart from './orders-number-bar-chart';
import OrdersNumberPercentageBarChart from './orders-number-percentage-bar-chart';
import OrdersValueBarChart from './orders-value-bar-chart';
import OrdersValuePercentageBarChart from './orders-value-percentage-bar-chart';

type ChartDataItem = {
    month: string;
    orders: number;
    loyalty: number;
    loyaltyPercentage: number;
    coupons: number;
    couponsPercentage: number;
};

interface OrdersChartsPanelProps {
    ordersValueChartData: ChartDataItem[];
    ordersNumberChartData: ChartDataItem[];
}

export default function OrdersChartsPanel({
    ordersValueChartData,
    ordersNumberChartData,
}: OrdersChartsPanelProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <Card>
            <CardHeader className='px-7'>
                <CardTitle className='flex justify-between items-center'>
                    <span>Orders, Loyalty Points & Coupons</span>
                    <CollapseToggleButton
                        isExpanded={isExpanded}
                        onToggle={() => setIsExpanded(!isExpanded)}
                    />
                </CardTitle>
                <CardDescription className='flex items-center gap-2'>
                    Last 6 months breakdown
                    <TrendingUp className='h-4 w-4' />
                </CardDescription>
            </CardHeader>
            <CollapsibleContent isExpanded={isExpanded}>
                <section className='grid lg:grid-cols-2'>
                    <CardContent>
                        <OrdersValueBarChart
                            chartData={ordersValueChartData}
                        />
                    </CardContent>
                    <CardContent>
                        <OrdersNumberBarChart
                            chartData={ordersNumberChartData}
                        />
                    </CardContent>
                </section>
                <section className='grid lg:grid-cols-2'>
                    <CardContent>
                        <OrdersValuePercentageBarChart
                            chartData={ordersValueChartData}
                        />
                    </CardContent>
                    <CardContent>
                        <OrdersNumberPercentageBarChart
                            chartData={ordersNumberChartData}
                        />
                    </CardContent>
                </section>
            </CollapsibleContent>
        </Card>
    );
}
