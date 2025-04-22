import { CreditSystemOrder } from '@/app/lib/types';

import ClosePanel from '@/components/common/close-panel';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface OrderHistoryForTraderProps {
    companyName: string;
    orderHistoryForTrader: CreditSystemOrder[];
    showOrderHistoryForTrader: boolean;
    setShowOrderHistoryForTrader: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OrderHistoryForTrader({
    companyName,
    orderHistoryForTrader,
    showOrderHistoryForTrader,
    setShowOrderHistoryForTrader,
}: OrderHistoryForTraderProps) {
    if (!showOrderHistoryForTrader) {
        return null;
    }

    return (
        <Card className='mt-6 relative'>
            <ClosePanel setClosePanel={setShowOrderHistoryForTrader} />
            <CardHeader>
                <CardTitle className='text-lg'>
                    Order History for {companyName}
                </CardTitle>
                {orderHistoryForTrader.length === 0 && (
                    <CardDescription>No orders available.</CardDescription>
                )}
            </CardHeader>
            {orderHistoryForTrader.length > 0 && (
                <ul className='list-disc pl-5'>
                    {orderHistoryForTrader.map((order) => (
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
