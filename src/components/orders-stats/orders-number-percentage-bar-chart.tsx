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
    loyaltyPercentage: {
        label: 'Loyalty %',
        color: 'hsl(var(--chart-2))',
    },
    couponsPercentage: {
        label: 'Coupons %',
        color: 'hsl(var(--chart-4))',
    },
} satisfies ChartConfig;

type OrdersValueBarChartProps = {
    month: string;
    orders: number;
    loyalty: number;
    loyaltyPercentage: number;
    coupons: number;
    couponsPercentage: number;
}[];

export default function OrdersNumberPercentageBarChart({
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
                <CardTitle>Percentage of Number of Orders</CardTitle>
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
                            dataKey='loyaltyPercentage'
                            fill='var(--color-loyaltyPercentage)'
                            radius={4}
                        />
                        <Bar
                            dataKey='couponsPercentage'
                            fill='var(--color-couponsPercentage)'
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
