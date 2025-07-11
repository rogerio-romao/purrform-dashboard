import { Skeleton } from '@/components/ui/skeleton';
import ComparisonBarCharts from './comparison-bar-charts';

type PeriodData = {
    sales_value: number;
    sales_nr: number;
    loyalty_value: number;
    loyalty_nr: number;
    coupons_value: number;
    coupons_nr: number;
    label: string;
};

type ComparisonChartsProps = {
    period1Data: PeriodData | null;
    period2Data: PeriodData | null;
};

export default function ComparisonCharts(
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

    return <ComparisonBarCharts chartData={[period1Data!, period2Data!]} />;
}
