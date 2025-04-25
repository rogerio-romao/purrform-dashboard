import ClosePanel from '@/components/common/close-panel';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import OrdersTable from './orders-table';

import { CreditSystemOrder } from '@/app/lib/types';

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
            <ClosePanel setClosePanel={setShowPendingOrdersForTrader} />
            <CardHeader>
                <CardTitle className='text-lg'>
                    Pending Orders for {companyName}
                </CardTitle>
                {pendingOrdersForTrader.length === 0 && (
                    <CardDescription>No pending orders.</CardDescription>
                )}
            </CardHeader>
            {pendingOrdersForTrader.length > 0 && (
                <OrdersTable orders={pendingOrdersForTrader} />
            )}
        </Card>
    );
}
