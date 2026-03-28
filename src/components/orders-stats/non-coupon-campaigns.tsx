'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { calculateDifference, gbpFormatter } from '@/app/lib/utils';

const campaignData = {
    valentineCampaign: {
        totalOrders: 784,
        ordersTotalValue: 107237.68,
        totalFreeTreatsGiven: 190,
        pricePerTreat: 9.49,
        totalValueOfFreeTreats: 1803.1,
        personalGroupOrders: 579,
        personalOrdersGlobalValue: 60116.03,
        personalOrdersWithFreeTreatsValue: 21841.48,
        startDate: '2026-02-06',
        endDate: '2026-02-13',
    },
    previousWeek: {
        totalOrders: 780,
        totalValue: 104904.56,
        personalGroupOrders: 578,
        personalGroupValue: 62672.89,
        startDate: '2026-01-30',
        endDate: '2026-02-05',
    },
    previousYear: {
        totalOrders: 797,
        totalValue: 93978.87,
        personalGroupOrders: 568,
        personalGroupValue: 59797.76,
        startDate: '2025-02-06',
        endDate: '2025-02-13',
    },
};

function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-UK').format(num);
}

function formatCurrency(num: number): string {
    return gbpFormatter.format(num);
}

function getChangeIndicator(
    current: number,
    previous: number,
): { text: string; icon: React.ReactNode } {
    const diff = calculateDifference(previous, current);
    const isUp = current >= previous;
    const icon = isUp ? (
        <TrendingUp className='h-4 w-4 text-green-600' />
    ) : (
        <TrendingDown className='h-4 w-4 text-red-600' />
    );

    const sign = isUp ? '+' : '-';
    return {
        text: `${sign}${diff.toFixed(1)}%`,
        icon,
    };
}

export default function NonCouponCampaigns() {
    const { valentineCampaign, previousWeek, previousYear } = campaignData;

    const conversionRate =
        (valentineCampaign.totalFreeTreatsGiven /
            valentineCampaign.personalGroupOrders) *
        100;

    const personalOrdersVsPrevWeek = getChangeIndicator(
        valentineCampaign.personalGroupOrders,
        previousWeek.personalGroupOrders,
    );
    const personalOrdersVsLY = getChangeIndicator(
        valentineCampaign.personalGroupOrders,
        previousYear.personalGroupOrders,
    );

    const personalRevenueVsPrevWeek = getChangeIndicator(
        valentineCampaign.personalOrdersGlobalValue,
        previousWeek.personalGroupValue,
    );
    const personalRevenueVsLY = getChangeIndicator(
        valentineCampaign.personalOrdersGlobalValue,
        previousYear.personalGroupValue,
    );

    const totalRevenueVsPrevWeek = getChangeIndicator(
        valentineCampaign.ordersTotalValue,
        previousWeek.totalValue,
    );
    const totalRevenueVsLY = getChangeIndicator(
        valentineCampaign.ordersTotalValue,
        previousYear.totalValue,
    );

    return (
        <Card>
            <CardHeader className='px-7'>
                <CardTitle>Non-Coupon Campaigns</CardTitle>
                <CardDescription>
                    Performance insights for campaigns without discount codes or
                    coupons.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-xl'>
                            Valentine&apos;s Campaign 2026
                        </CardTitle>
                        <CardDescription>
                            Feb 6-13, 2026 &bull; Free treat for Personal group
                            orders over £80 (Ox Heart Treats)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-6 mt-4'>
                        <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
                            <Card>
                                <CardHeader className='pb-2'>
                                    <CardDescription className='font-semibold'>
                                        Campaign Performance
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className='flex flex-col gap-2'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-xs text-muted-foreground'>
                                            Eligible / Total Orders
                                        </span>
                                        <span className='text-sm'>
                                            {formatNumber(
                                                valentineCampaign.personalGroupOrders,
                                            )}{' '}
                                            /{' '}
                                            {formatNumber(
                                                valentineCampaign.totalOrders,
                                            )}
                                        </span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-xs text-muted-foreground'>
                                            Total Orders Value
                                        </span>
                                        <span className='text-sm'>
                                            {formatCurrency(
                                                valentineCampaign.ordersTotalValue,
                                            )}
                                        </span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-xs text-muted-foreground'>
                                            Personal Group Orders Value
                                        </span>
                                        <span className='text-sm'>
                                            {formatCurrency(
                                                valentineCampaign.personalOrdersGlobalValue,
                                            )}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className='pb-2'>
                                    <CardDescription className='font-semibold'>
                                        Free Treats Promotion
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className='flex flex-col gap-2'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-xs text-muted-foreground'>
                                            Total Claimed
                                        </span>
                                        <span className='text-sm'>
                                            {formatNumber(
                                                valentineCampaign.totalFreeTreatsGiven,
                                            )}
                                        </span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-xs text-muted-foreground'>
                                            Eligible Conversion
                                        </span>
                                        <span className='text-sm'>
                                            {conversionRate.toFixed(1)}% of{' '}
                                            {formatNumber(
                                                valentineCampaign.personalGroupOrders,
                                            )}
                                        </span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-xs text-muted-foreground'>
                                            Offer Cost{' '}
                                            {formatCurrency(
                                                valentineCampaign.pricePerTreat,
                                            )}{' '}
                                            each{' '}
                                        </span>
                                        <span className='text-sm'>
                                            {formatCurrency(
                                                valentineCampaign.totalValueOfFreeTreats,
                                            )}{' '}
                                            total
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className='pb-2'>
                                    <CardDescription className='font-semibold'>
                                        Orders Comparison (Personal/Total)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className='flex flex-col gap-2'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-xs text-muted-foreground'>
                                            Campaign
                                        </span>
                                        <span className='text-sm'>
                                            {formatNumber(
                                                valentineCampaign.personalGroupOrders,
                                            )}{' '}
                                            /{' '}
                                            {formatNumber(
                                                valentineCampaign.totalOrders,
                                            )}
                                        </span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-xs text-muted-foreground'>
                                            Prev Week
                                        </span>
                                        <span className='flex items-center gap-2'>
                                            <span className='flex items-center'>
                                                {personalOrdersVsPrevWeek.icon}
                                                <span
                                                    className={`text-xs ${
                                                        valentineCampaign.personalGroupOrders >=
                                                        previousWeek.personalGroupOrders
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    {
                                                        personalOrdersVsPrevWeek.text
                                                    }
                                                </span>
                                            </span>
                                            <span className='text-sm'>
                                                {formatNumber(
                                                    previousWeek.personalGroupOrders,
                                                )}{' '}
                                                /{' '}
                                                {formatNumber(
                                                    previousWeek.totalOrders,
                                                )}
                                            </span>
                                        </span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-xs text-muted-foreground'>
                                            Same Week LY
                                        </span>
                                        <span className='flex items-center gap-2'>
                                            <span className='flex items-center'>
                                                {personalOrdersVsLY.icon}
                                                <span
                                                    className={`text-xs ${
                                                        valentineCampaign.personalGroupOrders >=
                                                        previousYear.personalGroupOrders
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    {personalOrdersVsLY.text}
                                                </span>
                                            </span>
                                            <span className='text-sm'>
                                                {formatNumber(
                                                    previousYear.personalGroupOrders,
                                                )}{' '}
                                                /{' '}
                                                {formatNumber(
                                                    previousYear.totalOrders,
                                                )}
                                            </span>
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className='pb-2'>
                                    <CardDescription className='font-semibold'>
                                        Revenue Comparison (Personal Group)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className='flex flex-col gap-2'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-xs text-muted-foreground'>
                                            Campaign
                                        </span>
                                        <span className='text-sm'>
                                            {formatCurrency(
                                                valentineCampaign.personalOrdersGlobalValue,
                                            )}
                                        </span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-xs text-muted-foreground'>
                                            Prev Week
                                        </span>
                                        <span className='flex items-center gap-2'>
                                            <span className='flex items-center'>
                                                {personalRevenueVsPrevWeek.icon}
                                                <span
                                                    className={`text-xs ${
                                                        valentineCampaign.personalOrdersGlobalValue >=
                                                        previousWeek.personalGroupValue
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    {
                                                        personalRevenueVsPrevWeek.text
                                                    }
                                                </span>
                                            </span>
                                            <span className='text-sm'>
                                                {formatCurrency(
                                                    previousWeek.personalGroupValue,
                                                )}
                                            </span>
                                        </span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-xs text-muted-foreground'>
                                            Same Week LY
                                        </span>
                                        <span className='flex items-center gap-2'>
                                            <span className='flex items-center'>
                                                {personalRevenueVsLY.icon}
                                                <span
                                                    className={`text-xs ${
                                                        valentineCampaign.personalOrdersGlobalValue >=
                                                        previousYear.personalGroupValue
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    {personalRevenueVsLY.text}
                                                </span>
                                            </span>
                                            <span className='text-sm'>
                                                {formatCurrency(
                                                    previousYear.personalGroupValue,
                                                )}
                                            </span>
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className='pb-2'>
                                    <CardDescription className='font-semibold'>
                                        Total Revenue Comparison
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className='flex flex-col gap-2'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-xs text-muted-foreground'>
                                            Campaign
                                        </span>
                                        <span className='text-sm'>
                                            {formatCurrency(
                                                valentineCampaign.ordersTotalValue,
                                            )}
                                        </span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-xs text-muted-foreground'>
                                            Prev Week
                                        </span>
                                        <span className='flex items-center gap-2'>
                                            <span className='flex items-center'>
                                                {totalRevenueVsPrevWeek.icon}
                                                <span
                                                    className={`text-xs ${
                                                        valentineCampaign.ordersTotalValue >=
                                                        previousWeek.totalValue
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    {
                                                        totalRevenueVsPrevWeek.text
                                                    }
                                                </span>
                                            </span>
                                            <span className='text-sm'>
                                                {formatCurrency(
                                                    previousWeek.totalValue,
                                                )}
                                            </span>
                                        </span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-xs text-muted-foreground'>
                                            Same Week LY
                                        </span>
                                        <span className='flex items-center gap-2'>
                                            <span className='flex items-center'>
                                                {totalRevenueVsLY.icon}
                                                <span
                                                    className={`text-xs ${
                                                        valentineCampaign.ordersTotalValue >=
                                                        previousYear.totalValue
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    {totalRevenueVsLY.text}
                                                </span>
                                            </span>
                                            <span className='text-sm'>
                                                {formatCurrency(
                                                    previousYear.totalValue,
                                                )}
                                            </span>
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}
