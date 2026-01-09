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

type AddSlotsModalProps = {
    deliveryDate: DeliveryDate;
    setDeliveryDates: React.Dispatch<React.SetStateAction<DeliveryDate[]>>;
};

export default function AdjustSlotsModal({
    deliveryDate,
    setDeliveryDates,
}: AddSlotsModalProps) {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof adjustDeliverySlotSchema>>({
        resolver: zodResolver(adjustDeliverySlotSchema),
        defaultValues: {
            date: deliveryDate.date,
            newSlots: deliveryDate.slots,
        },
    });

    function onUpdate(values: z.infer<typeof adjustDeliverySlotSchema>) {
        const validated = adjustDeliverySlotSchema.safeParse(values);

        if (!validated.success) {
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description: validated.error.errors[0].message,
            });
            return;
        }

        const updatedDeliveryDate = {
            ...deliveryDate,
            slots: validated.data.newSlots,
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
                <DialogTitle>Adjust Delivery Slots</DialogTitle>

                <DialogDescription asChild>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onUpdate)}
                            className='space-y-8'
                        >
                            <div className='flex flex-col justify-center gap-4'>
                                <FormField
                                    control={form.control}
                                    name='date'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date</FormLabel>
                                            <FormControl>
                                                <Input {...field} readOnly />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='newSlots'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slots</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type='number'
                                                    min={0}
                                                    autoFocus
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='gap-2 min-h-3.5'>
                                {form.watch('newSlots') !==
                                    deliveryDate.slots && (
                                    <p className='text-sm text-muted-foreground'>
                                        Changing slots from {deliveryDate.slots}{' '}
                                        to {form.watch('newSlots')}{' '}
                                        <span className='font-semibold'>
                                            (
                                            {form.watch('newSlots')! -
                                                deliveryDate.slots >=
                                            0
                                                ? `+${
                                                      form.watch('newSlots')! -
                                                      deliveryDate.slots
                                                  }`
                                                : form.watch('newSlots')! -
                                                  deliveryDate.slots}
                                            )
                                        </span>
                                    </p>
                                )}
                            </div>
                            <div className='flex gap-2'>
                                <Button type='submit'>Submit</Button>
                            </div>
                        </form>
                    </Form>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    );
}
