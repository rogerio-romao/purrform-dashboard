import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, PoundSterling } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { CreditSystemTrader } from '@/app/lib/types';
import { addTraderToCreditFormSchema, cn } from '@/app/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
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

interface TraderCreditFormProps {
    mappedTraders: {
        id: number;
        first_name: string;
        last_name: string;
        company: string;
        email: string;
    }[];

    setCreditTraders: React.Dispatch<
        React.SetStateAction<CreditSystemTrader[]>
    >;
}

export default function TraderCreditAddTrader({
    mappedTraders,
    setCreditTraders,
}: TraderCreditFormProps) {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof addTraderToCreditFormSchema>>({
        resolver: zodResolver(addTraderToCreditFormSchema),
        defaultValues: {
            selectedTraderId: 0,
            selectedTraderCompany: '',
            selectedTraderEmail: '',
            creditAmount: 0,
        },
    });

    async function onSubmit(data: z.infer<typeof addTraderToCreditFormSchema>) {
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

        const { selectedTraderId, selectedTraderCompany, creditAmount } = data;
        const trader = mappedTraders.find(
            (trader) => trader.company === selectedTraderCompany
        );

        if (!trader) {
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description: 'An error occurred while submitting the form.',
            });
            return;
        }

        const traderToAdd: Omit<
            CreditSystemTrader,
            'id' | 'created_at' | 'updated_at'
        > = {
            bc_customer_id: trader.id,
            bc_customer_email: encodeURIComponent(trader.email),
            bc_customer_company: encodeURIComponent(trader.company),
            bc_customer_first_name: encodeURIComponent(trader.first_name),
            bc_customer_last_name: encodeURIComponent(trader.last_name),
            credit_ceiling: creditAmount!,
            current_balance: creditAmount!,
        };

        await fetch(
            `http://localhost:5555/addTraderToCreditSystem?traderId=${traderToAdd.bc_customer_id}&traderEmail=${traderToAdd.bc_customer_email}&traderCompany=${traderToAdd.bc_customer_company}&traderFirstName=${traderToAdd.bc_customer_first_name}&traderLastName=${traderToAdd.bc_customer_last_name}&creditCeiling=${traderToAdd.credit_ceiling}&currentBalance=${traderToAdd.current_balance}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        ).then(async (response) => {
            if (!response.ok) {
                const { error } = (await response.json()) as { error: string };
                toast({
                    variant: 'destructive',
                    title: 'ERROR',
                    description: error,
                });
                return;
            }

            const data = (await response.json()) as CreditSystemTrader;

            setCreditTraders((prev) => [...prev, data]);
            form.reset();

            toast({
                variant: 'default',
                title: 'SUCCESS',
                description: 'Trader added to credit system successfully.',
            });
        });
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
                                                        placeholder='Credit amount'
                                                        {...field}
                                                        value={undefined}
                                                        onChange={(e) => {
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
