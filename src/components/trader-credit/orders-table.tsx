import { NotebookPen } from 'lucide-react';
import { useState } from 'react';

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
import { toast } from '@/hooks/use-toast';

interface OrdersTableProps {
    orders: CreditSystemOrder[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;

    // Calculate pagination values
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    const showPagination = orders.length > itemsPerPage;

    // Handle page navigation
    const goToNextPage = () =>
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    const statusTextColorClass = (status: string) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-500 font-semibold text-sm uppercase';
            case 'overdue':
                return 'text-red-500 font-semibold text-sm uppercase';
            case 'paid':
                return 'text-green-500 font-semibold text-sm uppercase';
            case 'other':
                return 'text-gray-500 font-semibold text-sm uppercase';
            default:
                return 'text-gray-500 font-semibold text-sm uppercase';
        }
    };

    const handlePayNow = async (
        orderId: number,
        traderId: number,
        orderStatus: string,
        orderTotal: number
    ) => {
        // Handle the payment logic here
        try {
            const response = await fetch(
                `http://localhost:5555/markCreditSystemOrderAsPaid?orderId=${orderId}&traderId=${traderId}&orderStatus=${orderStatus}&orderTotal=${orderTotal}`
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            toast({
                title: 'Payment Successful',
                description: `Your payment of £${orderTotal} has been processed successfully.`,
                variant: 'default',
            });
        } catch (error) {
            console.error('Error processing payment:', error);
            toast({
                title: 'Payment Error',
                description: 'There was an error processing your payment.',
                variant: 'destructive',
            });
        }
    };

    return (
        <>
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
                    {currentOrders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.order_nr}</TableCell>
                            <TableCell>{order.order_date}</TableCell>
                            <TableCell>{order.payment_due}</TableCell>
                            <TableCell>£ {order.order_total}</TableCell>
                            <TableCell
                                className={statusTextColorClass(
                                    order.order_status
                                )}
                            >
                                {order.order_status}
                            </TableCell>
                            <TableCell className='inline-flex gap-2'>
                                {(order.order_status === 'pending' ||
                                    order.order_status === 'overdue') && (
                                    <Button
                                        variant={'default'}
                                        size={'sm'}
                                        onClick={() =>
                                            handlePayNow(
                                                order.id,
                                                order.trader_id,
                                                order.order_status,
                                                order.order_total
                                            )
                                        }
                                    >
                                        Pay Now
                                    </Button>
                                )}
                                <Button variant={'outline'} size={'sm'}>
                                    {order.order_notes && (
                                        <NotebookPen
                                            size={12}
                                            className='mr-1'
                                        />
                                    )}
                                    Edit Order
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {showPagination && (
                <div className='flex items-center justify-between p-4'>
                    <div className='text-sm text-muted-foreground'>
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className='flex space-x-2'>
                        <Button
                            variant='secondary'
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant='secondary'
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
