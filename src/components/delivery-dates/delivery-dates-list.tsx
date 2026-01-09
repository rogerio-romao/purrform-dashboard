'use client';

import { useEffect, useState } from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DeliveryDatesTable from './delivery-dates-table';

import type { DeliveryDate } from '@/app/lib/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import AddDateModal from './add-date-modal';

interface DeliveryDatesListProps {
    deliveryDates: DeliveryDate[];
    setDeliveryDates: React.Dispatch<React.SetStateAction<DeliveryDate[]>>;
}

export default function DeliveryDatesList({
    deliveryDates,
    setDeliveryDates,
}: DeliveryDatesListProps) {
    const [showOnlyActive, setShowOnlyActive] = useState(false);
    const [filteredDates, setFilteredDates] =
        useState<DeliveryDate[]>(deliveryDates);

    useEffect(() => {
        if (showOnlyActive) {
            const todayString = new Date().toISOString().split('T')[0];
            const activeDates = deliveryDates.filter(
                (date) => date.date >= todayString
            );

            setFilteredDates(activeDates);
        } else {
            setFilteredDates(deliveryDates);
        }
    }, [showOnlyActive, deliveryDates]);

    return (
        <Card className='sm:col-span-2'>
            <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>Delivery Dates List</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex justify-between mb-4'>
                    <div className='flex items-center gap-2'>
                        Show only active dates?
                        <Checkbox
                            checked={showOnlyActive}
                            onCheckedChange={(checked) =>
                                setShowOnlyActive(!!checked)
                            }
                        />
                    </div>
                    <div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>Add Delivery Date</Button>
                            </DialogTrigger>
                            <AddDateModal
                                deliveryDates={deliveryDates}
                                setDeliveryDates={setDeliveryDates}
                            />
                        </Dialog>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Slots</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <DeliveryDatesTable
                        deliveryDates={filteredDates}
                        setDeliveryDates={setDeliveryDates}
                    />
                </Table>
            </CardContent>
        </Card>
    );
}
