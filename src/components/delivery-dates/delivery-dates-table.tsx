import { BadgeX, Pencil } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
    TableBody,
    TableCell,
    TableFooter,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AdjustSlotsModal from './adjust-slots-modal';
import ResetSlotsModal from './reset-slots-modal';

import type { DeliveryDate } from '@/app/lib/types';

interface DeliveryDatesTableProps {
    deliveryDates: DeliveryDate[];
    setDeliveryDates: React.Dispatch<React.SetStateAction<DeliveryDate[]>>;
}

export default function DeliveryDatesTable({
    deliveryDates,
    setDeliveryDates,
}: DeliveryDatesTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;

    // Calculate pagination values
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = deliveryDates.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(deliveryDates.length / itemsPerPage);

    const showPagination = deliveryDates.length > itemsPerPage;

    // Handle page navigation
    const goToNextPage = () =>
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    const todayString = new Date().toISOString().split('T')[0];

    return (
        <>
            <TableBody>
                {currentItems.map((deliveryDate) => (
                    <TableRow key={deliveryDate.id}>
                        <TableCell>{deliveryDate.date}</TableCell>
                        <TableCell>{deliveryDate.slots}</TableCell>
                        <TableCell>
                            <div className='flex items-center gap-2 font-normal'>
                                {deliveryDate.date >= todayString && (
                                    <Dialog>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant={'outline'}
                                                        >
                                                            <Pencil className='w-4 h-4 mr-2' />
                                                            Adjust Slots
                                                        </Button>
                                                    </DialogTrigger>
                                                </TooltipTrigger>
                                                <AdjustSlotsModal
                                                    deliveryDate={deliveryDate}
                                                    setDeliveryDates={
                                                        setDeliveryDates
                                                    }
                                                />

                                                <TooltipContent
                                                    side='top'
                                                    align='center'
                                                >
                                                    Edit
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </Dialog>
                                )}
                                {deliveryDate.date >= todayString &&
                                    deliveryDate.slots > 0 && (
                                        <Dialog>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant={
                                                                    'outline'
                                                                }
                                                            >
                                                                <BadgeX className='w-4 h-4 mr-2' />
                                                                Set to Zero{' '}
                                                                <span className='ml-1 text-sm text-muted-foreground'>
                                                                    (disable
                                                                    deliveries)
                                                                </span>
                                                            </Button>
                                                        </DialogTrigger>
                                                    </TooltipTrigger>
                                                    <ResetSlotsModal
                                                        deliveryDate={
                                                            deliveryDate
                                                        }
                                                        setDeliveryDates={
                                                            setDeliveryDates
                                                        }
                                                    />
                                                    <TooltipContent
                                                        side='top'
                                                        align='center'
                                                    >
                                                        Disable deliveries
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </Dialog>
                                    )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>

            {showPagination && (
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>
                            <div className='flex items-center justify-between p-2'>
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
                        </TableCell>
                    </TableRow>
                </TableFooter>
            )}
        </>
    );
}
