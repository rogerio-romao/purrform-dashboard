import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useToast } from '@/hooks/use-toast';

import { addTraderToCreditFormSchema, cn } from '@/app/lib/utils';
import { Check, ChevronsUpDown, PoundSterling } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from './ui/command';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface TraderCreditFormProps {
    mappedTraders: {
        id: number;
        company: string;
        email: string;
    }[];
}

export default function TraderCreditAddTrader({
    mappedTraders,
}: TraderCreditFormProps) {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [creditAmount, setCreditAmount] = useState<number | undefined>(
        undefined
    );
    const { toast } = useToast();

    const form = useForm<z.infer<typeof addTraderToCreditFormSchema>>({
        resolver: zodResolver(addTraderToCreditFormSchema),
        defaultValues: {
            selectedTraderId: 0,
            selectedTraderCompany: '',
            selectedTraderEmail: '',
            creditAmount: creditAmount,
        },
    });

    function onSubmit(data: z.infer<typeof addTraderToCreditFormSchema>) {
        console.log(data);
        const validated = addTraderToCreditFormSchema.safeParse(data);

        if (!validated.success) {
            console.error(validated.error.format());
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description: 'An error occurred while submitting the form.',
            });
            return;
        }
    }

    return (
        <Card className='sm:col-span-3'>
            <CardHeader>
                <CardTitle className='text-lg'>Add Trader</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8 my-6'
                    >
                        <FormField
                            control={form.control}
                            name='selectedTraderId'
                            render={({ field }) => (
                                <FormItem className='hidden'>
                                    <FormControl>
                                        <Input
                                            type='hidden'
                                            {...field}
                                            value={
                                                mappedTraders.find(
                                                    (trader) =>
                                                        trader.company ===
                                                        form.getValues(
                                                            'selectedTraderCompany'
                                                        )
                                                )?.id || 0
                                            }
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='selectedTraderEmail'
                            render={({ field }) => (
                                <FormItem className='hidden'>
                                    <FormControl>
                                        <Input
                                            type='hidden'
                                            {...field}
                                            value={
                                                mappedTraders.find(
                                                    (trader) =>
                                                        trader.company ===
                                                        form.getValues(
                                                            'selectedTraderCompany'
                                                        )
                                                )?.email || ''
                                            }
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className='flex flex-col justify-center gap-4'>
                            <FormField
                                control={form.control}
                                name='selectedTraderCompany'
                                render={({ field }) => (
                                    <FormItem className='flex flex-col'>
                                        <FormLabel>
                                            Traders outside the credit system
                                            {mappedTraders.length > 0 && (
                                                <span className='text-xs text-muted-foreground ml-2'>
                                                    {mappedTraders.length}{' '}
                                                    traders found
                                                </span>
                                            )}
                                        </FormLabel>
                                        <Popover
                                            open={popoverOpen}
                                            onOpenChange={setPopoverOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant='outline'
                                                        role='combobox'
                                                        className={cn(
                                                            'w-full justify-between',
                                                            !field.value &&
                                                                'text-muted-foreground'
                                                        )}
                                                    >
                                                        {field.value
                                                            ? mappedTraders.find(
                                                                  (trader) =>
                                                                      trader.company ===
                                                                      field.value
                                                              )?.company
                                                            : 'Select company'}
                                                        <ChevronsUpDown className='opacity-50' />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className='w-[100%] p-0'>
                                                <Command>
                                                    <CommandInput
                                                        placeholder='Search company...'
                                                        className='h-9'
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            No company found.
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {mappedTraders.map(
                                                                (trader) => (
                                                                    <CommandItem
                                                                        value={
                                                                            trader.company
                                                                        }
                                                                        key={
                                                                            trader.id
                                                                        }
                                                                        onSelect={() => {
                                                                            form.setValue(
                                                                                'selectedTraderCompany',
                                                                                trader.company
                                                                            );
                                                                            form.setValue(
                                                                                'selectedTraderId',
                                                                                trader.id
                                                                            );
                                                                            form.setValue(
                                                                                'selectedTraderEmail',
                                                                                trader.email
                                                                            );
                                                                            setPopoverOpen(
                                                                                false
                                                                            );
                                                                        }}
                                                                    >
                                                                        {
                                                                            trader.company
                                                                        }
                                                                        <span className='text-muted-foreground text-xs'>
                                                                            {' | ' +
                                                                                trader.email}
                                                                        </span>
                                                                        <Check
                                                                            className={cn(
                                                                                'ml-auto',
                                                                                trader.company ===
                                                                                    field.value
                                                                                    ? 'opacity-100'
                                                                                    : 'opacity-0'
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                )
                                                            )}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {form.getValues('selectedTraderCompany') && (
                            <div className='max-w-xs'>
                                <FormField
                                    control={form.control}
                                    name='creditAmount'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Credit amount</FormLabel>
                                            <FormControl>
                                                <div className='relative w-full'>
                                                    <PoundSterling className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />

                                                    <Input
                                                        type='number'
                                                        className='pl-8'
                                                        {...field}
                                                        value={creditAmount}
                                                        onChange={(e) => {
                                                            setCreditAmount(
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                    10
                                                                )
                                                            );
                                                            form.setValue(
                                                                'creditAmount',
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                    10
                                                                )
                                                            );
                                                            form.trigger();
                                                        }}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                        <div className='flex gap-2'>
                            <Button
                                type='submit'
                                disabled={
                                    !form.formState.isValid ||
                                    form.formState.isSubmitting
                                }
                            >
                                Add trader to credit system
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
