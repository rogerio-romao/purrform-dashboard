'use client';

import { TrendingUp } from 'lucide-react';
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
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
    { month: 'April', desktop: 186, mobile: 80, percent: 3 },
    { month: 'May', desktop: 305, mobile: 200, percent: 5 },
    { month: 'June', desktop: 237, mobile: 120, percent: 4 },
    { month: 'July', desktop: 73, mobile: 190, percent: 2 },
    { month: 'August', desktop: 209, mobile: 130, percent: 3 },
    { month: 'September', desktop: 214, mobile: 140, percent: 8 },
];

const chartConfig = {
    desktop: {
        label: 'Orders',
        color: 'hsl(var(--chart-1))',
    },
    mobile: {
        label: 'Loyalty Points',
        color: 'hsl(var(--chart-2))',
    },
    percent: {
        label: 'Percentage',
        color: 'hsl(var(--chart-3))',
    },
} satisfies ChartConfig;

export default function OrdersBarChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>£ Value</CardTitle>
                <CardDescription>April - September 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey='month'
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                            tickLine={true}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={5}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator='dashed' />}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                            dataKey='desktop'
                            fill='var(--color-desktop)'
                            radius={4}
                        />
                        <Bar
                            dataKey='mobile'
                            fill='var(--color-mobile)'
                            radius={4}
                        />
                        <Bar
                            dataKey='percent'
                            fill='var(--color-percent)'
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className='flex-col items-start gap-2 text-sm'>
                <div className='flex gap-2 font-medium leading-none'>
                    Trending up by 5.2% this month{' '}
                    <TrendingUp className='h-4 w-4' />
                </div>
                <div className='leading-none text-muted-foreground'>
                    Showing total orders for the last 6 months
                </div>
            </CardFooter>
        </Card>
    );
}
