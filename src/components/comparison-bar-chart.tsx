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
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator='dashed' />}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
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
                                fontSize={12}
                                formatter={(value: number) =>
                                    `${labelPrefix}${value.toLocaleString()}`
                                }
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
