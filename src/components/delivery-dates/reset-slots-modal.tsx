import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import adjustDeliverySlots from '@/app/actions/adjustDeliverySlots';
import { adjustDeliverySlotSchema } from '@/app/lib/utils';

import { Button } from '@/components/ui/button';
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import type { DeliveryDate } from '@/app/lib/types';

type ResetSlotsModalProps = {
    deliveryDate: DeliveryDate;
    setDeliveryDates: React.Dispatch<React.SetStateAction<DeliveryDate[]>>;
};

export default function ResetSlotsModal({
    deliveryDate,
    setDeliveryDates,
}: ResetSlotsModalProps) {
    const { toast } = useToast();

    const date = new Date(deliveryDate.date);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const formattedDate = date.toLocaleDateString('en-GB', options);

    function handler() {
        const updatedDeliveryDate = {
            ...deliveryDate,
            slots: 0,
        };

        adjustDeliverySlots(updatedDeliveryDate).then((response) => {
            if ('error' in response) {
                toast({
                    variant: 'destructive',
                    title: 'ERROR',
                    description: response.error,
                });
                return;
            }
        });

        setDeliveryDates((prevDeliveryDates) =>
            prevDeliveryDates.map((prevDeliveryDate) =>
                prevDeliveryDate.id === deliveryDate.id
                    ? updatedDeliveryDate
                    : prevDeliveryDate
            )
        );

        // Close the dialog
        const closeButton = document.querySelector(
            '[role="dialog"] > button'
        ) as HTMLButtonElement;
        closeButton?.click();

        toast({
            variant: 'default',
            title: 'SUCCESS',
            description: 'Delivery slots adjusted successfully.',
        });
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Reset Delivery Slots</DialogTitle>

                <DialogDescription asChild>
                    <div className='flex flex-col gap-2 py-4'>
                        <div className='mb-4'>
                            Click below to confirm resetting slots to zero. This
                            will disable deliveries for{' '}
                            <strong>{formattedDate}</strong>.
                        </div>
                        <Button onClick={handler}>Confirm</Button>
                    </div>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    );
}
