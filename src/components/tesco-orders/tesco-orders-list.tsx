'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { TescoOrder } from '@/app/lib/types';

interface TescoOrdersListProps {
    orders: TescoOrder[];
    title: string;
}

export default function TescoOrdersList({
    orders,
    title,
}: TescoOrdersListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;

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

    return (
        <Card className='sm:col-span-2'>
            <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>{title}</CardTitle>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Bc Order ID</TableHead>
                                <TableHead>Tesco Invoice ID</TableHead>
                                <TableHead>Order Total</TableHead>
                                <TableHead>Order Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.bc_order_id}</TableCell>
                                    <TableCell>
                                        {order.tesco_invoice_nr}
                                    </TableCell>
                                    <TableCell>
                                        £ {order.order_value.toFixed(2)}
                                    </TableCell>
                                    <TableCell>{order.order_date}</TableCell>
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
                </CardContent>
            </CardHeader>
        </Card>
    );
}
