import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TescoSummaryCardProps {
    startDate: string;
    endDate: string;
    total: number;
    ordersCount: number;
}

export default function TescoSummaryCard({
    startDate,
    endDate,
    total,
    ordersCount,
}: TescoSummaryCardProps) {
    const rangeIsSingleDay = startDate === endDate;

    return (
        <Card className='mt-8'>
            <CardHeader>
                <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className='flex gap-8'>
                <div>
                    <strong>Number of Orders:</strong> {ordersCount}
                </div>
                <div>
                    <strong>Total value:</strong> £{total}
                </div>
                {rangeIsSingleDay ? (
                    <div>
                        <strong>Date:</strong>{' '}
                        <span className='font-semibold'>{startDate}</span>
                    </div>
                ) : (
                    <div>
                        <strong>Date Range:</strong> from{' '}
                        <span className='font-semibold'>{startDate}</span> to{' '}
                        <span className='font-semibold'>{endDate}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
