'use client';

import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import { months } from '@/app/lib/utils';

import Loading from '@/components/common/loading';
import CouponTypesBreakdown from '@/components/orders-stats/coupon-types-breakdown';
import OrdersNumberBarChart from '@/components/orders-stats/orders-number-bar-chart';
import OrdersNumberPercentageBarChart from '@/components/orders-stats/orders-number-percentage-bar-chart';
import OrdersValueBarChart from '@/components/orders-stats/orders-value-bar-chart';
import OrdersValuePercentageBarChart from '@/components/orders-stats/orders-value-percentage-bar-chart';
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

import { BACKEND_BASE_URL } from '@/app/lib/definitions';

interface ControlPanelStats {
    id: number;
    month: number;
    year: number;
    sales_value: number;
    sales_nr: number;
    loyalty_value: number;
    loyalty_nr: number;
    coupons_value?: number;
    coupons_nr?: number;
}

export default function OrdersLoyaltyStats() {
    const [data, setData] = useState<ControlPanelStats[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${BACKEND_BASE_URL}/controlPanel`);
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
    const loyaltyPointsNrThisMonth = new Intl.NumberFormat('en-UK').format(
        currentMonth.loyalty_nr
    );
    const couponsValueThisMonth = new Intl.NumberFormat('en-UK').format(
        currentMonth.coupons_value || 0
    );
    const couponsNrThisMonth = new Intl.NumberFormat('en-UK').format(
        currentMonth.coupons_nr || 0
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

    const couponsPercentageOfValue = (
        ((currentMonth.coupons_value || 0) / currentMonth.sales_value) *
        100
    ).toFixed(2);
    const couponsPercentageOfOrders = (
        ((currentMonth.coupons_nr || 0) / currentMonth.sales_nr) *
        100
    ).toFixed(2);

    const ordersValueChartData = data.toReversed().map((month) => ({
        month: months[month.month - 1],
        orders: month.sales_value,
        loyalty: month.loyalty_value,
        loyaltyPercentage: +Number(
            ((month.loyalty_value / month.sales_value) * 100).toFixed(2)
        ),
        coupons: month.coupons_value || 0,
        couponsPercentage: +Number(
            ((month.coupons_value || 0) / month.sales_value) * 100
        ).toFixed(2),
    }));

    const ordersNumberChartData = data.toReversed().map((month) => ({
        month: months[month.month - 1],
        orders: month.sales_nr,
        loyalty: month.loyalty_nr,
        loyaltyPercentage: +Number(
            ((month.loyalty_nr / month.sales_nr) * 100).toFixed(2)
        ),
        coupons: month.coupons_nr || 0,
        couponsPercentage: +Number(
            ((month.coupons_nr || 0) / month.sales_nr) * 100
        ).toFixed(2),
    }));

    return (
        <div className='flex w-full flex-col bg-muted/40 mt-4'>
            <div className='flex flex-col sm:gap-4 sm:py-4 '>
                <div className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2'>
                    <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
                        <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4'>
                            <Card
                                className='sm:col-span-1'
                                x-chunk='dashboard-05-chunk-0'
                            >
                                <CardHeader className='pb-3'>
                                    <CardTitle>Orders Statistics</CardTitle>
                                    <CardDescription className='max-w-lg text-balance leading-relaxed'>
                                        Reporting number of orders, value of
                                        orders, coupon codes usage and loyalty
                                        points usage value and percentage of
                                        total orders.
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
                                        {loyaltyPointsNrThisMonth} orders
                                    </div>
                                </CardContent>
                                <CardFooter className='flex flex-col gap-2'>
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
                                    <div className='text-xs text-muted-foreground'>
                                        Average value per order:{' '}
                                        <span className='font-semibold'>
                                            £
                                            {(
                                                currentMonth.loyalty_value /
                                                currentMonth.loyalty_nr
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                </CardFooter>
                            </Card>

                            <Card x-chunk='dashboard-05-chunk-3'>
                                <CardHeader className='pb-2'>
                                    <CardDescription>
                                        Coupons This month
                                    </CardDescription>
                                    <CardTitle className='text-2xl lg:text-3xl'>
                                        £{couponsValueThisMonth}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='text-xs text-muted-foreground'>
                                        {couponsNrThisMonth} orders
                                    </div>
                                </CardContent>
                                <CardFooter className='flex flex-col gap-2'>
                                    <div className='flex flex-col w-full gap-2'>
                                        <div className='text-xs text-muted-foreground'>
                                            {couponsPercentageOfValue}% of value
                                        </div>
                                        <Progress
                                            value={Number(
                                                couponsPercentageOfValue
                                            )}
                                            aria-label={`%{couponsPercentageOfValue}% of value`}
                                        />
                                        <div className='text-xs text-muted-foreground'>
                                            {couponsPercentageOfOrders}% of
                                            orders
                                        </div>
                                        <Progress
                                            value={Number(
                                                couponsPercentageOfOrders
                                            )}
                                            aria-label={`%{couponsPercentageOfOrders}% of orders`}
                                        />
                                    </div>
                                    <div className='text-xs text-muted-foreground'>
                                        Average value per order:{' '}
                                        <span className='font-semibold'>
                                            £
                                            {(
                                                (currentMonth.coupons_value ||
                                                    0) /
                                                (currentMonth.coupons_nr || 1)
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader className='px-7'>
                                <CardTitle>
                                    Orders, Loyalty Points & Coupons
                                </CardTitle>
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
                        </Card>

                        <PeriodComparison
                            ordersValueChartData={ordersValueChartData}
                            ordersNumberChartData={ordersNumberChartData}
                        />

                        <CouponTypesBreakdown />
                    </div>
                </div>
            </div>
        </div>
    );
}
