import { Skeleton } from '@/components/ui/skeleton';

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
                <div>{JSON.stringify(period1Data)}</div>
            ) : (
                <Skeleton className='h-96' />
            )}
            {period2Data ? (
                <div>{JSON.stringify(period2Data)}</div>
            ) : (
                <Skeleton className='h-96' />
            )}
        </section>
    );
}
