import { X } from 'lucide-react';

import { CreditSystemOrder } from '@/app/lib/types';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface PendingOrdersForTraderProps {
    companyName: string;
    pendingOrdersForTrader: CreditSystemOrder[];
    showPendingOrdersForTrader: boolean;
    setShowPendingOrdersForTrader: React.Dispatch<
        React.SetStateAction<boolean>
    >;
}

export default function PendingOrdersForTrader({
    companyName,
    pendingOrdersForTrader,
    showPendingOrdersForTrader,
    setShowPendingOrdersForTrader,
}: PendingOrdersForTraderProps) {
    if (!showPendingOrdersForTrader) {
        return null;
    }

    return (
        <Card className='mt-6 relative'>
            <div
                className='absolute right-4 top-4 cursor-pointer text-gray-500 flex items-center gap-1 group transition-colors'
                onClick={() => setShowPendingOrdersForTrader(false)}
            >
                <span className='text-xs group-hover:text-gray-600'>
                    Close Panel
                </span>
                <X className='text-gray-400 group-hover:text-gray-500' />
            </div>
            <CardHeader>
                <CardTitle className='text-lg'>
                    Pending Orders for {companyName}
                </CardTitle>
                {pendingOrdersForTrader.length === 0 && (
                    <CardDescription>No pending orders.</CardDescription>
                )}
            </CardHeader>
            {pendingOrdersForTrader.length > 0 && (
                <ul className='list-disc pl-5'>
                    {pendingOrdersForTrader.map((order) => (
                        <li key={order.id}>
                            Order Number: {order.order_nr} -{' '}
                            {order.order_status}
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}
