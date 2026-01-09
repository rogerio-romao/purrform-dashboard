'use client';

import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import addDeliveryDate from '@/app/actions/addDeliveryDate';

import type { BankHolidaysResponse, DeliveryDate } from '@/app/lib/types';

type AddDateModalProps = {
    deliveryDates: DeliveryDate[];
    setDeliveryDates: React.Dispatch<React.SetStateAction<DeliveryDate[]>>;
};

export default function AddDateModal({
    deliveryDates,
    setDeliveryDates,
}: AddDateModalProps) {
    const { toast } = useToast();

    const [holidayDates, setHolidayDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | undefined>(
        undefined
    );
    const [slots, setSlots] = useState<number>(250);

    useEffect(() => {
        async function fetchHolidays() {
            try {
                const response = await fetch(
                    'https://www.gov.uk/bank-holidays.json'
                );
                const data = (await response.json()) as BankHolidaysResponse;
                setHolidayDates(
                    data['england-and-wales'].events.map((event) => event.date)
                );
            } catch (error) {
                console.error('Error fetching holiday dates:', error);
            }
        }

        fetchHolidays();
    }, []);

    const disabledDatesSet = new Set([
        ...deliveryDates.map((date) => date.date),
        ...holidayDates,
    ]);
    const disabledDates = Array.from(disabledDatesSet);

    function handler() {
        if (!selectedDate) {
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description: 'Please select a date.',
            });
            return;
        }

        addDeliveryDate(selectedDate, slots).then((response) => {
            if ('error' in response) {
                toast({
                    variant: 'destructive',
                    title: 'ERROR',
                    description: response.error,
                });
                return;
            }

            setDeliveryDates((prevDeliveryDates) => [
                response,
                ...prevDeliveryDates,
            ]);
        });

        // Close the dialog
        const closeButton = document.querySelector(
            '[role="dialog"] > button'
        ) as HTMLButtonElement;
        closeButton?.click();

        toast({
            variant: 'default',
            title: 'SUCCESS',
            description: 'Delivery date slots added successfully.',
        });
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Delivery Date</DialogTitle>

                <DialogDescription asChild>
                    <div className='flex flex-col gap-2 py-4'>
                        <div className='mb-4'>
                            Fill in the details below to add a new delivery
                            date.
                        </div>
                        <div>
                            <p className='font-semibold'>Select a date:</p>
                            <Calendar
                                mode='single'
                                selected={
                                    selectedDate
                                        ? new Date(selectedDate)
                                        : new Date()
                                }
                                onSelect={(date) =>
                                    setSelectedDate(
                                        date
                                            ? date.toISOString().split('T')[0]
                                            : undefined
                                    )
                                }
                                disabled={(date) =>
                                    disabledDates.some(
                                        (disabledDate) =>
                                            disabledDate ===
                                            date.toISOString().split('T')[0]
                                    ) ||
                                    date < new Date() ||
                                    date.getDay() === 0 ||
                                    date.getDay() === 1
                                }
                            />
                            <p className='font-semibold'>Slots:</p>
                            <Input
                                type='number'
                                min={0}
                                value={slots}
                                onChange={(e) =>
                                    setSlots(Number(e.target.value))
                                }
                            />
                        </div>
                        <Button onClick={handler} className='mt-3'>
                            Confirm
                        </Button>
                    </div>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    );
}
