'use client';

import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
} from 'recharts';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { TrendingDown, TrendingUp } from 'lucide-react';

import { calculateDifference } from '@/app/lib/utils';

const chartConfig = {
    coupon_value: {
        label: 'Coupon Value',
        color: 'hsl(var(--chart-1))',
    },
    coupon_nr: {
        label: 'Number of Coupons',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig;

type ComparisonBarChartProps = {
    type: 'coupon_value' | 'coupon_nr';
    chartData: {
        coupon_prefix: string;
        coupon_value?: number;
        coupon_nr?: number;
        label: string;
    }[];
};

export default function ComparisonBarChartCoupons({
    type,
    chartData,
}: ComparisonBarChartProps) {
    if (!chartData) {
        return null;
    }

    const title = chartConfig[type].label;

    const labelPrefix = type === 'coupon_value' ? '£ ' : '';

    const firstValue = chartData[0][type];
    const lastValue = chartData[chartData.length - 1][type];
    const lastLabel = chartData[chartData.length - 1].label;

    const averageValueData = chartData.map((data) => ({
        average: (data.coupon_value ?? 0) / (data.coupon_nr ?? 1),
        label: data.label,
    }));

    const percentageDifference = calculateDifference(
        firstValue ?? 0,
        lastValue ?? 0
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey='label'
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis
                            tickLine={true}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={5}
                        />
                        <Bar
                            dataKey={type}
                            fill={`var(--color-${type})`}
                            radius={4}
                        >
                            <LabelList
                                dataKey={type}
                                position='outside'
                                offset={8}
                                className='fill-background'
                                fontSize={14}
                                formatter={(value: number) =>
                                    `${labelPrefix}${value.toLocaleString()}`
                                }
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className='flex-col items-start gap-2 text-sm'>
                <div className='flex gap-2 font-medium leading-none'>
                    <TrendingText
                        percentageDifference={percentageDifference}
                        firstValue={firstValue ?? 0}
                        secondValue={lastValue ?? 0}
                        label={lastLabel}
                        labelPrefix={labelPrefix}
                    />
                </div>
                {type === 'coupon_value' && (
                    <div className='flex gap-1 text-xs text-muted-foreground justify-between w-full'>
                        {averageValueData.map(({ label, average }) => (
                            <div key={label}>
                                £ per coupon {label}: £{average.toFixed(2)}
                            </div>
                        ))}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}

function TrendingText({
    percentageDifference,
    firstValue,
    secondValue,
    label,
    labelPrefix,
}: {
    percentageDifference: number;
    firstValue: number;
    secondValue: number;
    label: string;
    labelPrefix: string;
}) {
    if (percentageDifference <= 2) {
        const positiveDifference = firstValue < secondValue;
        return (
            <>
                Roughly equal in {label}{' '}
                <span className='text-muted-foreground'>
                    {positiveDifference ? '[+ ' : '[- '}
                    {`${percentageDifference.toFixed(2)}%]`}
                </span>
            </>
        );
    }

    if (percentageDifference === Infinity) {
        return (
            <>
                Up by {labelPrefix} {secondValue.toLocaleString()} in {label}{' '}
                <TrendingUp className='h-4 w-4' />
            </>
        );
    }

    return firstValue < secondValue ? (
        <>
            Up by {percentageDifference.toFixed(2)}% in {label}{' '}
            <TrendingUp className='h-4 w-4' />
        </>
    ) : (
        <>
            Down by {percentageDifference.toFixed(2)}% in {label}{' '}
            <TrendingDown className='h-4 w-4' />
        </>
    );
}
