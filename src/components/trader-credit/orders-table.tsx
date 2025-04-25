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
                        <TableCell>{order.order_status}</TableCell>
                        <TableCell className='inline-flex gap-2'>
                            <Button variant={'default'} size={'sm'}>
                                Pay Now
                            </Button>
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
