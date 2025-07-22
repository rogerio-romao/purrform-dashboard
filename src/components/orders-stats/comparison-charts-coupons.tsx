import { Skeleton } from '@/components/ui/skeleton';
import ComparisonBarChartsCoupons from './comparison-bar-charts-coupons';

type PeriodData = {
    coupon_prefix: string;
    coupon_value?: number;
    coupon_nr?: number;
    label: string;
};

type ComparisonChartsProps = {
    period1Data: PeriodData | null;
    period2Data: PeriodData | null;
};

export default function ComparisonChartsCoupons(
    { period1Data, period2Data }: ComparisonChartsProps = {
        period1Data: null,
        period2Data: null,
    }
) {
    const noData = !period1Data && !period2Data;

    if (noData) {
        return (
            <section className='grid lg:grid-cols-2 gap-12 p-6'>
                <Skeleton className='h-96' />
                <Skeleton className='h-96' />
            </section>
        );
    }

    return (
        <ComparisonBarChartsCoupons chartData={[period1Data!, period2Data!]} />
    );
}
