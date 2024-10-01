'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
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

const chartConfig = {
    orders: {
        label: 'Orders',
        color: 'hsl(var(--chart-1))',
    },
    loyalty: {
        label: 'Loyalty Points',
        color: 'hsl(var(--chart-2))',
    },
    percent: {
        label: 'Percentage',
        color: 'hsl(var(--chart-3))',
    },
} satisfies ChartConfig;

type OrdersValueBarChartProps = {
    month: string;
    orders: number;
    loyalty: number;
    percent: number;
}[];

export default function OrdersValueBarChart({
    chartData,
}: {
    chartData: OrdersValueBarChartProps;
}) {
    if (!chartData) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>By £ Value</CardTitle>
                <CardDescription>
                    {chartData[0].month} -{' '}
                    {chartData[chartData.length - 1].month}{' '}
                    {new Date().getFullYear()}
                </CardDescription>
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
                            tickFormatter={(value: string) => value.slice(0, 3)}
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
                            dataKey='orders'
                            fill='var(--color-orders)'
                            radius={4}
                        />
                        <Bar
                            dataKey='loyalty'
                            fill='var(--color-loyalty)'
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
        </Card>
    );
}
