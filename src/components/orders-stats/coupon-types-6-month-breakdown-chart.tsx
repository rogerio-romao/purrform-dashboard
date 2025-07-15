import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

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
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

import type { CouponType, CouponTypeMonthBreakdown } from '@/app/lib/types';
import { transformDataForCouponValueSemesterGraph } from '@/app/lib/utils';

const chartConfig = {
    '10K': {
        label: '10K',
        color: 'hsl(var(--chart-1))',
    },
    BRB_: {
        label: 'BRB_',
        color: 'hsl(var(--chart-2))',
    },
    BRC_: {
        label: 'BRC_',
        color: 'hsl(var(--chart-3))',
    },
    CB_: {
        label: 'CB_',
        color: 'hsl(var(--chart-4))',
    },
    FSK: {
        label: 'FSK',
        color: 'hsl(var(--chart-5))',
    },
    KWF_: {
        label: 'KWF_',
        color: 'hsl(220 70% 50%)',
    },
    OHT_: {
        label: 'OHT_',
        color: 'hsl(280 70% 50%)',
    },
    OTHER: {
        label: 'OTHER',
        color: 'hsl(340 70% 50%)',
    },
    RFC_: {
        label: 'RFC_',
        color: 'hsl(40 70% 50%)',
    },
    RFF_: {
        label: 'RFF_',
        color: 'hsl(160 70% 50%)',
    },
} satisfies ChartConfig;

interface CouponTypes6MonthBreakdownChartProps {
    currentPeriod: string;
    last6Months: string[];
    chartData: CouponTypeMonthBreakdown[];
    couponTypes: CouponType[];
}

export default function CouponTypes6MonthBreakdownChart({
    currentPeriod,
    last6Months,
    chartData,
    couponTypes,
}: CouponTypes6MonthBreakdownChartProps) {
    if (!chartData || chartData.length === 0) {
        return (
            <Card>
                <CardContent>
                    No data available for this period, please try again later.
                </CardContent>
            </Card>
        );
    }

    const transformedData = transformDataForCouponValueSemesterGraph(
        chartData,
        last6Months
    );

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
                <CardTitle>{currentPeriod}</CardTitle>
                <CardDescription>
                    Coupon statistics by value and number of orders for the last
                    6 months.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={transformedData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={true} strokeDasharray='3 3' />
                        <XAxis
                            dataKey='month'
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                        />
                        <YAxis
                            domain={[0, 'dataMax + 100']}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={5}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Legend wrapperStyle={{ paddingTop: 16 }} />

                        <Line
                            dataKey='10K'
                            type='monotone'
                            stroke='var(--color-10K)'
                            strokeWidth={2}
                            dot={true}
                        />
                        <Line
                            dataKey='BRB_'
                            type='monotone'
                            stroke='var(--color-BRB_)'
                            strokeWidth={2}
                            dot={true}
                        />
                        <Line
                            dataKey='BRC_'
                            type='monotone'
                            stroke='var(--color-BRC_)'
                            strokeWidth={2}
                            dot={true}
                        />
                        <Line
                            dataKey='CB_'
                            type='monotone'
                            stroke='var(--color-CB_)'
                            strokeWidth={2}
                            dot={true}
                        />
                        <Line
                            dataKey='FSK'
                            type='monotone'
                            stroke='var(--color-FSK)'
                            strokeWidth={2}
                            dot={true}
                        />
                        <Line
                            dataKey='KWF_'
                            type='monotone'
                            stroke='var(--color-KWF_)'
                            strokeWidth={2}
                            dot={true}
                        />
                        <Line
                            dataKey='OHT_'
                            type='monotone'
                            stroke='var(--color-OHT_)'
                            strokeWidth={2}
                            dot={true}
                        />
                        <Line
                            dataKey='OTHER'
                            type='monotone'
                            stroke='var(--color-OTHER)'
                            strokeWidth={2}
                            dot={true}
                        />
                        <Line
                            dataKey='RFC_'
                            type='monotone'
                            stroke='var(--color-RFC_)'
                            strokeWidth={2}
                            dot={true}
                        />
                        <Line
                            dataKey='RFF_'
                            type='monotone'
                            stroke='var(--color-RFF_)'
                            strokeWidth={2}
                            dot={true}
                        />
                    </LineChart>
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
