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
    sales_value: {
        label: 'Orders Value',
        color: 'hsl(var(--chart-1))',
    },
    sales_nr: {
        label: 'Number of Orders',
        color: 'hsl(var(--chart-2))',
    },
    coupons_value: {
        label: 'Coupons Value',
        color: 'hsl(var(--chart-3))',
    },
    coupons_nr: {
        label: 'Number of Coupons',
        color: 'hsl(var(--chart-4))',
    },
    loyalty_value: {
        label: 'Loyalty Points Value',
        color: 'hsl(var(--chart-5))',
    },
    loyalty_nr: {
        label: 'Number of Loyalty Orders',
        color: 'hsl(var(--chart-6))',
    },
} satisfies ChartConfig;

type ComparisonBarChartProps = {
    type:
        | 'sales_value'
        | 'sales_nr'
        | 'loyalty_value'
        | 'loyalty_nr'
        | 'coupons_value'
        | 'coupons_nr';
    chartData: {
        sales_value: number;
        sales_nr: number;
        loyalty_value: number;
        loyalty_nr: number;
        coupons_value?: number; // Optional for backward compatibility
        coupons_nr?: number; // Optional for backward compatibility
        label: string;
    }[];
};

export default function ComparisonBarChart({
    type,
    chartData,
}: ComparisonBarChartProps) {
    if (!chartData) {
        return null;
    }

    const title = chartConfig[type].label;

    const labelPrefix = type.includes('value') ? '£ ' : '';

    const firstValue = chartData[0][type];
    const lastValue = chartData[chartData.length - 1][type];
    const lastLabel = chartData[chartData.length - 1].label;

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
