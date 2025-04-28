import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { CreditSystemOrder } from '@/app/lib/types';

interface OrdersTableProps {
    orders: CreditSystemOrder[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
    const statusTextColorClass = (status: string) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-500 font-bold';
            case 'overdue':
                return 'text-red-500 font-bold';
            case 'paid':
                return 'text-green-500 font-bold';
            case 'other':
                return 'text-gray-500 font-bold';
            default:
                return 'text-gray-500 font-bold';
        }
    };
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Payment Due</TableHead>
                    <TableHead>Order Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell>{order.order_nr}</TableCell>
                        <TableCell>{order.order_date}</TableCell>
                        <TableCell>{order.payment_due}</TableCell>
                        <TableCell>£ {order.order_total}</TableCell>
                        <TableCell
                            className={statusTextColorClass(order.order_status)}
                        >
                            {order.order_status}
                        </TableCell>
                        <TableCell className='inline-flex gap-2'>
                            {(order.order_status === 'pending' ||
                                order.order_status === 'overdue') && (
                                <Button variant={'default'} size={'sm'}>
                                    Pay Now
                                </Button>
                            )}
                            <Button variant={'outline'} size={'sm'}>
                                Order Notes
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
