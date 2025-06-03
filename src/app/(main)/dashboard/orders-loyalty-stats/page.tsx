'use client';

import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import { months } from '@/app/lib/utils';

import Loading from '@/components/common/loading';
import OrdersNumberBarChart from '@/components/orders-stats/orders-number-bar-chart';
import OrdersValueBarChart from '@/components/orders-stats/orders-value-bar-chart';
import PeriodComparison from '@/components/orders-stats/period-comparison';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ControlPanelStats {
    id: number;
    month: number;
    year: number;
    sales_value: number;
    sales_nr: number;
    loyalty_value: number;
    loyalty_nr: number;
}

export default function OrdersLoyaltyStats() {
    const [data, setData] = useState<ControlPanelStats[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                'https://purrform-apps-027e.onrender.com/controlPanel'
            );
            const data = (await response.json()) as ControlPanelStats[];

            setData(data);
        };
        fetchData();
    }, []);

    if (data.length === 0) {
        return <Loading />;
    }

    const currentMonth = data[0];
    const currentMonthSalesValue = new Intl.NumberFormat('en-UK').format(
        currentMonth.sales_value
    );
    const currentMonthSalesNr = new Intl.NumberFormat('en-UK').format(
        currentMonth.sales_nr
    );
    const loyaltyPointsThisMonth = new Intl.NumberFormat('en-UK').format(
        currentMonth.loyalty_value
    );
    const loyaltyPointsNr = new Intl.NumberFormat('en-UK').format(
        currentMonth.loyalty_nr
    );

    const lastMonth = data[1];
    const lastMonthSalesValue = new Intl.NumberFormat('en-UK').format(
        lastMonth.sales_value
    );
    const lastMonthSalesNr = new Intl.NumberFormat('en-UK').format(
        lastMonth.sales_nr
    );

    const loyaltyPercentageOfValue = (
        (currentMonth.loyalty_value / currentMonth.sales_value) *
        100
    ).toFixed(2);
    const loyaltyPercentageOfOrders = (
        (currentMonth.loyalty_nr / currentMonth.sales_nr) *
        100
    ).toFixed(2);

    const ordersValueChartData = data.toReversed().map((month) => ({
        month: months[month.month - 1],
        orders: month.sales_value,
        loyalty: month.loyalty_value,
        percent: Number(
            ((month.loyalty_value / month.sales_value) * 100).toFixed(2)
        ),
    }));

    const ordersNumberChartData = data.toReversed().map((month) => ({
        month: months[month.month - 1],
        orders: month.sales_nr,
        loyalty: month.loyalty_nr,
        percent: Number(((month.loyalty_nr / month.sales_nr) * 100).toFixed(2)),
    }));

    return (
        <div className='flex w-full flex-col bg-muted/40 mt-4'>
            <div className='flex flex-col sm:gap-4 sm:py-4 '>
                <div className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2'>
                    <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
                        <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4'>
                            <Card
                                className='sm:col-span-2'
                                x-chunk='dashboard-05-chunk-0'
                            >
                                <CardHeader className='pb-3'>
                                    <CardTitle>
                                        Orders & Loyalty Points
                                    </CardTitle>
                                    <CardDescription className='max-w-lg text-balance leading-relaxed'>
                                        Reporting number of orders, value of
                                        orders, and loyalty points usage value
                                        and percentage of total orders.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card x-chunk='dashboard-05-chunk-1'>
                                <CardHeader className='pb-2'>
                                    <CardDescription>
                                        Orders This month
                                    </CardDescription>
                                    <CardTitle className='text-2xl lg:text-3xl'>
                                        £{currentMonthSalesValue}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='text-xs text-muted-foreground'>
                                        {currentMonthSalesNr} orders
                                    </div>
                                </CardContent>
                                <CardHeader className='pb-2'>
                                    <CardDescription>
                                        Orders Last Month
                                    </CardDescription>
                                    <CardTitle className='text-2xl lg:text-3xl'>
                                        £{lastMonthSalesValue}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='text-xs text-muted-foreground'>
                                        {lastMonthSalesNr} orders
                                    </div>
                                </CardContent>
                            </Card>
                            <Card x-chunk='dashboard-05-chunk-2'>
                                <CardHeader className='pb-2'>
                                    <CardDescription>
                                        Loyalty Points This Month
                                    </CardDescription>
                                    <CardTitle className='text-2xl lg:text-3xl'>
                                        £{loyaltyPointsThisMonth}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='text-xs text-muted-foreground'>
                                        {loyaltyPointsNr} orders
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <div className='flex flex-col w-full gap-2'>
                                        <div className='text-xs text-muted-foreground'>
                                            {loyaltyPercentageOfValue}% of value
                                        </div>
                                        <Progress
                                            value={Number(
                                                loyaltyPercentageOfValue
                                            )}
                                            aria-label={`%{loyaltyPercentageOfValue}% of value`}
                                        />
                                        <div className='text-xs text-muted-foreground'>
                                            {loyaltyPercentageOfOrders}% of
                                            orders
                                        </div>
                                        <Progress
                                            value={Number(
                                                loyaltyPercentageOfOrders
                                            )}
                                            aria-label={`%{loyaltyPercentageOfOrders}% of orders`}
                                        />
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                        <Card>
                            <CardHeader className='px-7'>
                                <CardTitle>Orders & Loyalty Points</CardTitle>
                                <CardDescription className='flex items-center gap-2'>
                                    Last 6 months breakdown
                                    <TrendingUp className='h-4 w-4' />
                                </CardDescription>
                            </CardHeader>
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
                        </Card>
                        <PeriodComparison
                            ordersValueChartData={ordersValueChartData}
                            ordersNumberChartData={ordersNumberChartData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
