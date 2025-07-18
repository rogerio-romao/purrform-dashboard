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

// Add index signature to allow any string key
const chartConfig: ChartConfig & {
    [key: string]: { label: string; color: string };
} = {
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

export default function CouponTypes6MonthBreakdownChartByValue({
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

    const lastMonthOfTransformedData =
        transformedData[transformedData.length - 1];

    const transformedDataKeys = Object.keys(lastMonthOfTransformedData).filter(
        (key) => key !== 'month'
    );

    // Create a mutable copy of chartConfig
    const dynamicChartConfig = { ...chartConfig };

    // if there are keys in transformedData that are not in chartConfig, add them to the copy
    for (const key of transformedDataKeys) {
        if (!dynamicChartConfig[key]) {
            dynamicChartConfig[key] = {
                label: key,
                color: `hsl(${Math.floor(Math.random() * 360)} 70% 50%)`, // Random color for unknown keys
            };
        }
    }

    const accumulatedValuesByCouponPrefix = transformedDataKeys.reduce(
        (acc, key) => {
            acc[key] = transformedData.reduce(
                (sum, item) => sum + (Number(item[key]) || 0),
                0
            );
            return acc;
        },
        {} as Record<string, number>
    );

    // grab the top 3 from accumulatedValuesByCouponPrefix
    const top3ByValue = Object.entries(accumulatedValuesByCouponPrefix)
        .toSorted((a, b) => b[1] - a[1])
        .slice(0, 3);
    const bottom3ByValue = Object.entries(accumulatedValuesByCouponPrefix)
        .toSorted((a, b) => a[1] - b[1])
        .slice(0, 3);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{currentPeriod} (£ Value)</CardTitle>
                <CardDescription>
                    Coupon statistics by value for the last 6 months.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={dynamicChartConfig}>
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

                        {Object.keys(dynamicChartConfig).map((key) => (
                            <Line
                                key={key}
                                dataKey={key}
                                type='monotone'
                                stroke={`var(--color-${key})`}
                                strokeWidth={2}
                                dot={true}
                            />
                        ))}
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
                                <span
                                    className='font-medium'
                                    style={{
                                        color: dynamicChartConfig[type.prefix]
                                            ?.color,
                                    }}
                                >
                                    {type.prefix}
                                </span>
                                <span className='ml-2'>{type.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='leading-none font-medium mt-3'>
                    Top & Bottom Coupons (accumulated 6 months)
                </div>
                <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 w-full'>
                    <Card className='col-span-2'>
                        <CardHeader>
                            <CardTitle className='text-base'>
                                Top 3 by Value
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {top3ByValue.map(
                                ([coupon_prefix, coupon_value]) => (
                                    <div
                                        key={coupon_prefix}
                                        className='flex justify-between'
                                    >
                                        <span className='font-medium text-green-600'>
                                            {coupon_prefix}{' '}
                                        </span>
                                        <span>£{coupon_value.toFixed(2)}</span>
                                    </div>
                                )
                            )}
                        </CardContent>
                    </Card>

                    <Card className='ml-2 col-span-2'>
                        <CardHeader>
                            <CardTitle className='text-base'>
                                Bottom 3 by Value
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {bottom3ByValue.map(
                                ([coupon_prefix, coupon_value], index) => (
                                    <div
                                        key={`${coupon_prefix}-${index}`}
                                        className='flex justify-between'
                                    >
                                        <span className='font-medium text-green-600'>
                                            {coupon_prefix}{' '}
                                        </span>
                                        <span>£{coupon_value.toFixed(2)}</span>
                                    </div>
                                )
                            )}
                        </CardContent>
                    </Card>
                </div>
            </CardFooter>
        </Card>
    );
}
