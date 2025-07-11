import { LabelList, Pie, PieChart } from 'recharts';

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

const chartConfig = {
    count: {
        label: 'Order Count: ',
    },
    normal: {
        label: 'Normal',
        color: 'hsl(var(--chart-1))',
    },
    loyalty: {
        label: 'Loyalty',
        color: 'hsl(var(--chart-2))',
    },
    coupons: {
        label: 'Coupons',
        color: 'hsl(var(--chart-3))',
    },
} satisfies ChartConfig;

interface OrdersPercentagePieChartProps {
    normalOrders: number;
    loyaltyOrders: number;
    couponsOrders: number;
}

export function OrdersPercentagePieChart({
    normalOrders,
    loyaltyOrders,
    couponsOrders,
}: OrdersPercentagePieChartProps) {
    const chartData = [
        { type: 'normal', count: normalOrders, fill: 'var(--color-normal)' },
        { type: 'loyalty', count: loyaltyOrders, fill: 'var(--color-loyalty)' },
        { type: 'coupons', count: couponsOrders, fill: 'var(--color-coupons)' },
    ];

    const totalCount = normalOrders + loyaltyOrders + couponsOrders;

    return (
        <Card className='flex flex-col'>
            <CardHeader className='items-center pb-0'>
                <CardTitle>Orders Percentages</CardTitle>
                <CardDescription>
                    By number of orders, current month
                </CardDescription>
            </CardHeader>
            <CardContent className='flex-1 pb-0'>
                <ChartContainer
                    config={chartConfig}
                    className='[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]'
                >
                    <PieChart>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    nameKey='count'
                                    hideLabel
                                />
                            }
                        />
                        <Pie data={chartData} dataKey='count'>
                            <LabelList
                                dataKey='type'
                                className='fill-background'
                                stroke='none'
                                fontSize={12}
                                formatter={(value: keyof typeof chartConfig) =>
                                    chartConfig[value]?.label
                                }
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className='flex-col gap-2 text-sm'>
                <div className='flex items-center gap-2 leading-none font-medium'>
                    Coupons: {((couponsOrders / totalCount) * 100).toFixed(2)}%
                </div>
                <div className='flex items-center gap-2 leading-none font-medium'>
                    Loyalty: {((loyaltyOrders / totalCount) * 100).toFixed(2)}%
                </div>
            </CardFooter>
        </Card>
    );
}
