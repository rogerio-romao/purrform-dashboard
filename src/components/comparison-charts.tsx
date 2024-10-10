import { Skeleton } from '@/components/ui/skeleton';
import ComparisonBarChart from './comparison-bar-chart';

type PeriodData = {
    sales_value: number;
    sales_nr: number;
    loyalty_value: number;
    loyalty_nr: number;
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
    return (
        <section className='grid lg:grid-cols-2 gap-12 p-6'>
            {period1Data ? (
                <ComparisonBarChart chartData={[period1Data]} />
            ) : (
                <Skeleton className='h-96' />
            )}
            {period2Data ? (
                <ComparisonBarChart chartData={[period2Data]} />
            ) : (
                <Skeleton className='h-96' />
            )}
        </section>
    );
}
