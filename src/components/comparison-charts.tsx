import { Skeleton } from '@/components/ui/skeleton';

export default function ComparisonCharts() {
    return (
        <section className='grid lg:grid-cols-2 gap-6 p-6'>
            <Skeleton className='h-96' />
            <Skeleton className='h-96' />
        </section>
    );
}
