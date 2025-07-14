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
    return (
        <Card>
            <CardHeader>
                <CardTitle>{currentMonthYear}</CardTitle>
                <CardDescription>
                    Coupon statistics by value and number of orders
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
            </CardFooter>
        </Card>
    );
}
