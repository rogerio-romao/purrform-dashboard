import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, NotebookPen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

import { BACKEND_BASE_URL } from '@/app/lib/definitions';
import { CreditSystemOrder } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';
import { toast } from '@/hooks/use-toast';

interface OrdersTableProps {
    orders: CreditSystemOrder[];
    isSellersTable?: boolean;
}

const EditOrderFormSchema = z.object({
    orderNotes: z.string().optional(),
    changeToOtherStatus: z.boolean(),
    changeToPendingStatus: z.boolean(),
    dueDate: z.string().optional(),
    adjustedOrderTotal: z.number().min(0).max(10000).optional(),
});

export default function OrdersTable({
    orders,
    isSellersTable = false,
}: OrdersTableProps) {
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
            adjustedOrderTotal: undefined,
            changeToPendingStatus: false,
            dueDate: selectedOrder ? selectedOrder.payment_due : '',
        },
    });

    const onSubmit = async (data: z.infer<typeof EditOrderFormSchema>) => {
        // Handle form submission logic here

        if (!selectedOrder) {
            toast({
                title: 'No Order Selected',
                description: 'Please select an order to edit.',
                variant: 'destructive',
            });
            return;
        }

        const {
            orderNotes,
            changeToOtherStatus,
            adjustedOrderTotal,
            changeToPendingStatus,
            dueDate,
        } = data;
        const orderId = selectedOrder.id; // Get the order ID from selectedOrder
        const traderId = selectedOrder.trader_id; // Get the trader ID from selectedOrder
        const encodedOrderNotes = encodeURIComponent(orderNotes ?? '');
        const changeStatusToOther =
            changeToOtherStatus && selectedOrder.order_status === 'paid';
        const changeStatusToPending =
            changeToPendingStatus && selectedOrder.order_status === 'overdue';
        const adjustedTotal = adjustedOrderTotal ?? selectedOrder.order_total;

        const hasNoteChanges = orderNotes !== (selectedOrder.order_notes ?? '');
        const hasTotalChanges = adjustedTotal !== selectedOrder.order_total;
        const hasChanges =
            hasNoteChanges ||
            changeStatusToOther ||
            changeStatusToPending ||
            hasTotalChanges ||
            dueDate !== selectedOrder.payment_due;

        if (!hasChanges) {
            toast({
                title: 'No Changes Made',
                description: 'Please make some changes before submitting.',
                variant: 'destructive',
            });
            return;
        }

        let adjustedTotalMessage: string | undefined;
        if (hasTotalChanges) {
            const difference = adjustedTotal! - selectedOrder.order_total;
            const isNegative = difference < 0;
            const orderAction = isNegative ? 'reduced' : 'increased';
            const balanceAction = isNegative ? 'increased' : 'reduced';
            const absoluteDifference = Math.abs(difference).toFixed(2);
            adjustedTotalMessage = `Order total has been ${orderAction} by £${absoluteDifference}. Customer balance has been ${balanceAction} by £${absoluteDifference}.`;
        }

        // Construct the URL with query parameters
        const baseUrl = `${BACKEND_BASE_URL}/editCreditSystemOrder`;
        const queryParams = new URLSearchParams({
            orderId: String(orderId),
            traderId: String(traderId),
        });
        if (hasNoteChanges) {
            queryParams.append('orderNotes', encodedOrderNotes);
        }
        if (changeStatusToOther) {
            queryParams.append('changeStatusToOther', 'true');
        }
        if (changeStatusToPending) {
            queryParams.append('changeStatusToPending', 'true');
        }
        if (dueDate) {
            queryParams.append('dueDate', dueDate);
        }
        if (hasTotalChanges) {
            queryParams.append('newTotal', String(adjustedTotal));
            queryParams.append('oldTotal', String(selectedOrder.order_total));
        }
        const url = `${baseUrl}?${queryParams.toString()}`;

        // Make the API call
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Access selectedOrder from state, not as an argument if it's not passed
            toast({
                title: 'Order Updated',
                description: `Order #${
                    selectedOrder?.order_nr
                } has been updated. ${adjustedTotalMessage ?? ''} ${
                    changeStatusToOther ? 'Order moved to "other" status.' : ''
                }`,
                variant: 'default',
            });
            setShowEditOrderDialog(false); // Close the dialog after submission
            setSelectedOrder(null); // Clear selectedOrder after submission
        } catch (error) {
            console.error('Error updating order:', error);
            toast({
                title: 'Update Failed',
                description: 'There was an error updating the order.',
                variant: 'destructive',
            });
            return;
        }
    };

    useEffect(() => {
        if (selectedOrder) {
            form.reset({
                orderNotes: selectedOrder.order_notes ?? '',
                // Consider if 'changeToOtherStatus' should be derived from selectedOrder.order_status
                changeToOtherStatus: selectedOrder.order_status === 'other',
                adjustedOrderTotal: selectedOrder.order_total ?? undefined,
                changeToPendingStatus: false,
                dueDate: selectedOrder.payment_due,
            });
        } else {
            // Reset form to defaults if selectedOrder is null (e.g., dialog closed)
            form.reset({
                orderNotes: '',
                changeToOtherStatus: false,
                adjustedOrderTotal: undefined,
                changeToPendingStatus: false,
                dueDate: '',
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
                `${BACKEND_BASE_URL}/markCreditSystemOrderAsPaid?orderId=${orderId}&traderId=${traderId}&orderStatus=${orderStatus}&orderTotal=${orderTotal}`
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
                        {isSellersTable ? null : <TableHead>Actions</TableHead>}
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
                            {isSellersTable ? null : (
                                <TableCell className='inline-flex gap-2'>
                                    {(order.order_status === 'pending' ||
                                        order.order_status === 'overdue') && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant={'default'}
                                                    size={'sm'}
                                                >
                                                    Pay Now
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Confirm Payment
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to
                                                        mark order #
                                                        {order.order_nr} as paid
                                                        for £{order.order_total}
                                                        ?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handlePayNow(
                                                                order.id,
                                                                order.trader_id,
                                                                order.order_status,
                                                                order.order_total
                                                            )
                                                        }
                                                    >
                                                        Confirm Payment
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                    {/* Button to trigger the single dialog */}
                                    <Button
                                        variant={'outline'}
                                        size={'sm'}
                                        onClick={() =>
                                            handleEditOrderClick(order)
                                        }
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
                            )}
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
                                            {selectedOrder.order_nr}
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
                                Add some notes to the order, change its status
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

                                {selectedOrder?.order_status === 'overdue' ||
                                selectedOrder?.order_status === 'pending' ? (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name='adjustedOrderTotal'
                                            render={({ field }) => (
                                                <FormItem className='mt-4'>
                                                    <FormLabel>
                                                        Adjust Order Total
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className='relative flex items-center'>
                                                            <span className='absolute left-2 text-muted-foreground'>
                                                                £
                                                            </span>
                                                            <Input
                                                                type='number'
                                                                className='pl-6'
                                                                placeholder='Adjust Amount'
                                                                {...field}
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='dueDate'
                                            render={({ field }) => (
                                                <FormItem className='flex flex-col mt-4'>
                                                    <FormLabel>
                                                        Change Due Date
                                                    </FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={
                                                                        'outline'
                                                                    }
                                                                    className={cn(
                                                                        'w-[240px] pl-3 text-left font-normal',
                                                                        !field.value &&
                                                                            'text-muted-foreground'
                                                                    )}
                                                                >
                                                                    {field.value ? (
                                                                        field.value
                                                                    ) : (
                                                                        <span>
                                                                            Pick
                                                                            a
                                                                            date
                                                                        </span>
                                                                    )}
                                                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            className='w-auto p-0'
                                                            align='start'
                                                        >
                                                            <Calendar
                                                                mode='single'
                                                                selected={
                                                                    new Date(
                                                                        field.value ||
                                                                            selectedOrder.payment_due
                                                                    )
                                                                }
                                                                onSelect={(
                                                                    date
                                                                ) => {
                                                                    if (date) {
                                                                        // this is to avoid timezone issues
                                                                        date.setHours(
                                                                            5
                                                                        );
                                                                        field.onChange(
                                                                            date
                                                                                .toISOString()
                                                                                .split(
                                                                                    'T'
                                                                                )[0]
                                                                        );
                                                                    }
                                                                }}
                                                                autoFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                ) : null}

                                {selectedOrder?.order_status === 'overdue' && (
                                    <FormField
                                        control={form.control}
                                        name='changeToPendingStatus'
                                        render={({ field }) => (
                                            <FormItem className='mt-4'>
                                                <div className='flex items-center space-x-2'>
                                                    <FormLabel>
                                                        Change status to
                                                        Pending?
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

                                {selectedOrder?.order_status === 'paid' && (
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
