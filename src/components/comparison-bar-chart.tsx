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
    sales_value: {
        label: 'Orders Value',
        color: 'hsl(var(--chart-1))',
    },
    sales_nr: {
        label: 'Total Orders',
        color: 'hsl(var(--chart-2))',
    },
    loyalty_value: {
        label: 'Loyalty Value',
        color: 'hsl(var(--chart-3))',
    },
    loyalty_nr: {
        label: 'Total Loyalty',
        color: 'hsl(var(--chart-4))',
    },
} satisfies ChartConfig;

type ComparisonBarChartProps = {
    sales_value: number;
    sales_nr: number;
    loyalty_value: number;
    loyalty_nr: number;
    label: string;
}[];

export default function ComparisonBarChart({
    chartData,
}: {
    chartData: ComparisonBarChartProps;
}) {
    if (!chartData) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{chartData[0].label}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />

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
                            dataKey='sales_value'
                            fill='var(--color-sales_value)'
                            radius={4}
                        />
                        <Bar
                            dataKey='sales_nr'
                            fill='var(--color-sales_nr)'
                            radius={4}
                        />
                        <Bar
                            dataKey='loyalty_value'
                            fill='var(--color-loyalty_value)'
                            radius={4}
                        />
                        <Bar
                            dataKey='loyalty_nr'
                            fill='var(--color-loyalty_nr)'
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
