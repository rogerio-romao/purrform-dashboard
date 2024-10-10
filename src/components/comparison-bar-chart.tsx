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
import { Equal, TrendingDown, TrendingUp } from 'lucide-react';

const chartConfig = {
    sales_value: {
        label: 'Orders Value',
        color: 'hsl(var(--chart-1))',
    },
    sales_nr: {
        label: 'Number of Orders',
        color: 'hsl(var(--chart-2))',
    },
    loyalty_value: {
        label: 'Loyalty Points Value',
        color: 'hsl(var(--chart-3))',
    },
    loyalty_nr: {
        label: 'Number of Loyalty Orders',
        color: 'hsl(var(--chart-4))',
    },
} satisfies ChartConfig;

type ComparisonBarChartProps = {
    type: 'sales_value' | 'sales_nr' | 'loyalty_value' | 'loyalty_nr';
    chartData: {
        sales_value: number;
        sales_nr: number;
        loyalty_value: number;
        loyalty_nr: number;
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

    const difference = Math.abs(firstValue - lastValue);
    const percentageDifference = (difference / firstValue) * 100;

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
                                className='fill-foreground'
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
                        firstValue={firstValue}
                        secondValue={lastValue}
                        label={lastLabel}
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
}: {
    percentageDifference: number;
    firstValue: number;
    secondValue: number;
    label: string;
}) {
    if (percentageDifference <= 2) {
        const positiveDifference = firstValue < secondValue;
        return (
            <>
                Roughly equal in {label} {`(${percentageDifference}%)`}{' '}
                <Equal className='h-4 w-4' />
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
