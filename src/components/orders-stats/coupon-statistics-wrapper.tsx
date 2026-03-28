'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import PeriodComparisonCoupons from './period-comparison-coupons';
import SinglePeriodCoupons from './single-period-coupons';

export default function CouponStatisticsWrapper() {
    const [statisticsType, setStatisticsType] = useState<
        'single' | 'comparison'
    >('comparison');

    return (
        <Card>
            <CardHeader className='px-7 relative'>
                <CardTitle className='flex justify-between'>
                    <div>
                        Coupon Types -{' '}
                        {statisticsType === 'comparison'
                            ? 'Period Comparison'
                            : 'Single Period'}
                    </div>
                    <div className='flex items-center'>
                        <Label
                            htmlFor='coupon-comparison-toggle'
                            className='mr-2'
                        >
                            {statisticsType === 'comparison'
                                ? 'Comparison'
                                : 'Single'}
                        </Label>
                        <Switch
                            id='coupon-comparison-toggle'
                            checked={statisticsType === 'comparison'}
                            onCheckedChange={(checked) =>
                                setStatisticsType(
                                    checked ? 'comparison' : 'single'
                                )
                            }
                        />
                    </div>
                </CardTitle>
            </CardHeader>
            {statisticsType === 'comparison' ? (
                <PeriodComparisonCoupons />
            ) : (
                <SinglePeriodCoupons />
            )}
        </Card>
    );
}
