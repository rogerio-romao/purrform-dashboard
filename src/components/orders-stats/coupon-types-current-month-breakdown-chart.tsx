import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

import type { CouponType, CouponTypeMonthBreakdown } from '@/app/lib/types';
import { Car } from 'lucide-react';

const chartConfig = {
    couponValue: {
        label: 'Coupon Value',
        color: 'hsl(var(--chart-1))',
    },
    couponNr: {
        label: 'Coupon Number',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig;

interface CouponTypesCurrentMonthBreakdownChartProps {
    currentMonthYear: string;
    chartData: CouponTypeMonthBreakdown[];
    couponTypes: CouponType[];
}

export default function CouponTypesCurrentMonthBreakdownChart({
    currentMonthYear,
    chartData,
    couponTypes,
}: CouponTypesCurrentMonthBreakdownChartProps) {
    if (!chartData || chartData.length === 0) {
        return (
            <Card>
                <CardContent>No data available for this month.</CardContent>
            </Card>
        );
    }

    const top3ByValue = chartData
        .toSorted((a, b) => b.coupon_value - a.coupon_value)
        .slice(0, 3);
    const bottom3ByValue = chartData
        .toSorted((a, b) => a.coupon_value - b.coupon_value)
        .slice(0, 3);
    const top3ByNr = chartData
        .toSorted((a, b) => b.coupon_nr - a.coupon_nr)
        .slice(0, 3);
    const bottom3ByNr = chartData
        .toSorted((a, b) => a.coupon_nr - b.coupon_nr)
        .slice(0, 3);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{currentMonthYear}</CardTitle>
                <CardDescription>
                    Coupon statistics by value and number of orders for the
                    current month.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey='coupon_prefix'
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={5}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator='dashed' />}
                        />
                        <Bar
                            dataKey='coupon_value'
                            fill='var(--color-couponValue)'
                            radius={4}
                        />
                        <Bar
                            dataKey='coupon_nr'
                            fill='var(--color-couponNr)'
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className='flex-col items-start gap-2 text-sm'>
                <div className='leading-none font-medium'>Legend</div>
                <div className='text-muted-foreground leading-none text-xs'>
                    <div className='flex flex-wrap gap-2'>
                        {couponTypes.map((type) => (
                            <div
                                key={type.id}
                                className='border rounded-sm p-1'
                            >
                                <span className='font-medium text-green-600'>
                                    {type.prefix}
                                </span>
                                <span className='ml-2'>{type.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='leading-none font-medium mt-3'>
                    Top & Bottom Coupons
                </div>
                <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 w-full'>
                    <Card className='col-span-1'>
                        <CardHeader>
                            <CardTitle className='text-base'>
                                Top 3 by Value
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {top3ByValue.map((item) => (
                                <div
                                    key={item.coupon_prefix}
                                    className='flex justify-between'
                                >
                                    <span className='font-medium text-green-600'>
                                        {item.coupon_prefix}{' '}
                                    </span>
                                    <span>£{item.coupon_value.toFixed(2)}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card className='ml-2 col-span-1'>
                        <CardHeader>
                            <CardTitle className='text-base'>
                                Top 3 by Number
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {top3ByNr.map((item) => (
                                <div
                                    key={item.coupon_prefix}
                                    className='flex justify-between'
                                >
                                    <span className='font-medium text-green-600'>
                                        {item.coupon_prefix}{' '}
                                    </span>
                                    <span>{item.coupon_nr}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className='ml-2 col-span-1'>
                        <CardHeader>
                            <CardTitle className='text-base'>
                                Bottom 3 by Value
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {bottom3ByValue.map((item) => (
                                <div
                                    key={item.coupon_prefix}
                                    className='flex justify-between'
                                >
                                    <span className='font-medium text-green-600'>
                                        {item.coupon_prefix}{' '}
                                    </span>
                                    <span>£{item.coupon_value.toFixed(2)}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className='ml-2 col-span-1'>
                        <CardHeader>
                            <CardTitle className='text-base'>
                                Bottom 3 by Number
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {bottom3ByNr.map((item) => (
                                <div
                                    key={item.coupon_prefix}
                                    className='flex justify-between'
                                >
                                    <span className='font-medium text-green-600'>
                                        {item.coupon_prefix}{' '}
                                    </span>
                                    <span>{item.coupon_nr}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </CardFooter>
        </Card>
    );
}
