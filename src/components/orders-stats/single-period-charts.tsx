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

type SinglePeriodChartsProps = {
    periodData: PeriodData | null;
};

export default function SinglePeriodCharts(
    { periodData }: SinglePeriodChartsProps = {
        periodData: null,
    }
) {
    if (!periodData) {
        return (
            <section className='p-6'>
                <Skeleton className='h-96' />
            </section>
        );
    }

    return <ComparisonBarCharts chartData={[periodData!]} />;
}
