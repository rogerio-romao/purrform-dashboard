import { zodResolver } from '@hookform/resolvers/zod';
import { NotebookPen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

import { CreditSystemOrder } from '@/app/lib/types';
import { toast } from '@/hooks/use-toast';
import { set } from 'date-fns';

interface OrdersTableProps {
    orders: CreditSystemOrder[];
}

const EditOrderFormSchema = z.object({
    orderNotes: z.string().optional(),
    changeToOtherStatus: z.boolean(),
    adjustAmount: z.number().min(0).max(10000).optional(),
});

export default function OrdersTable({ orders }: OrdersTableProps) {
    const [showEditOrderDialog, setShowEditOrderDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] =
        useState<CreditSystemOrder | null>(null);
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

    const form = useForm<z.infer<typeof EditOrderFormSchema>>({
        resolver: zodResolver(EditOrderFormSchema),
        defaultValues: {
            orderNotes: '',
            changeToOtherStatus: false,
            adjustAmount: undefined,
        },
    });

    const onSubmit = async (data: z.infer<typeof EditOrderFormSchema>) => {
        // Handle form submission logic here
        console.log('Form data:', data);

        // Access selectedOrder from state, not as an argument if it's not passed
        toast({
            title: 'Order Updated',
            description: `Order #${selectedOrder?.order_nr} has been updated.`,
            variant: 'default',
        });
        setShowEditOrderDialog(false); // Close the dialog after submission
        setSelectedOrder(null); // Clear selectedOrder after submission
    };

    useEffect(() => {
        if (selectedOrder) {
            form.reset({
                orderNotes: selectedOrder.order_notes ?? '',
                // Consider if 'changeToOtherStatus' should be derived from selectedOrder.order_status
                changeToOtherStatus: selectedOrder.order_status === 'other',
                adjustAmount: selectedOrder.order_total ?? undefined,
            });
        } else {
            // Reset form to defaults if selectedOrder is null (e.g., dialog closed)
            form.reset({
                orderNotes: '',
                changeToOtherStatus: false,
                adjustAmount: undefined,
            });
        }
    }, [selectedOrder, form]);

    const handleDialogStateChange = (isOpen: boolean) => {
        setShowEditOrderDialog(isOpen);
        if (!isOpen) {
            setSelectedOrder(null); // Clear selectedOrder when dialog closes
        }
    };

    const handleEditOrderClick = (order: CreditSystemOrder) => {
        setSelectedOrder(order);
        setShowEditOrderDialog(true); // Open the single dialog
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
                                {/* Button to trigger the single dialog */}
                                <Button
                                    variant={'outline'}
                                    size={'sm'}
                                    onClick={() => handleEditOrderClick(order)}
                                >
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

            {/* Single AlertDialog, moved outside the map loop */}
            {selectedOrder && ( // Conditionally render if an order is selected
                <AlertDialog
                    open={showEditOrderDialog}
                    onOpenChange={handleDialogStateChange}
                >
                    {/* AlertDialogTrigger is not strictly needed here if Button above controls opening */}
                    <AlertDialogContent
                        onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Edit Order
                                {selectedOrder && (
                                    <>
                                        <span className='ml-1'>
                                            #{selectedOrder.order_nr}
                                        </span>
                                        <span
                                            className={`ml-2 ${statusTextColorClass(
                                                selectedOrder.order_status
                                            )}`}
                                        >
                                            {selectedOrder.order_status}
                                        </span>
                                    </>
                                )}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Add some notes to the order, change it's status
                                or adjust the amount.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name='orderNotes'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Order Notes</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder='Order Notes'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='adjustAmount'
                                    render={({ field }) => (
                                        <FormItem className='mt-4'>
                                            <FormLabel>
                                                £ Adjust Order Total
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    placeholder='Adjust Amount'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {selectedOrder?.order_status !== 'other' && (
                                    <FormField
                                        control={form.control}
                                        name='changeToOtherStatus'
                                        render={({ field }) => (
                                            <FormItem className='mt-4'>
                                                <div className='flex items-center space-x-2'>
                                                    <FormLabel>
                                                        Change status to Other?
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={
                                                                field.value
                                                            }
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                <AlertDialogFooter className='mt-6'>
                                    <AlertDialogCancel>
                                        Cancel Changes
                                    </AlertDialogCancel>
                                    <Button type='submit'>
                                        Confirm Changes
                                    </Button>
                                </AlertDialogFooter>
                            </form>
                        </Form>
                    </AlertDialogContent>
                </AlertDialog>
            )}

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
