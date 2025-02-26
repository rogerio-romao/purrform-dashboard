import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { BcCustomer } from '@/app/lib/types';
import { cn, traderCreditFormSchema } from '@/app/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { Check, ChevronsUpDown } from 'lucide-react';

export default function TraderCredit() {
    const { toast } = useToast();
    const [traders, setTraders] = useState<BcCustomer[]>([]);
    const [popoverOpen, setPopoverOpen] = useState(false);

    useEffect(() => {
        const fetchTraders = async () => {
            try {
                const response = await fetch(
                    'http://localhost:5555/getAllBcTradeCustomers'
                );

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = (await response.json()) as BcCustomer[];
                setTraders(data);
            } catch (error) {
                console.error('Error fetching traders:', error);
                toast({
                    variant: 'destructive',
                    title: 'ERROR',
                    description:
                        'An error occurred while fetching the traders data.',
                });
            }
        };

        fetchTraders();
    }, [toast]);

    const mappedTraders = traders.map((trader) => ({
        id: trader.id,
        email: trader.email,
        company: trader.company
            ? trader.company
            : `${trader.first_name} ${trader.last_name}`,
    }));

    const form = useForm<z.infer<typeof traderCreditFormSchema>>({
        resolver: zodResolver(traderCreditFormSchema),
        defaultValues: {
            selectedTraderId: 0,
            selectedTraderCompany: '',
            selectedTraderEmail: '',
        },
    });

    function onSubmit(data: z.infer<typeof traderCreditFormSchema>) {
        const validated = traderCreditFormSchema.safeParse(data);

        if (!validated.success) {
            console.error(validated.error.format());
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description: 'An error occurred while submitting the form.',
            });
            return;
        }

        console.log(data);
    }

    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40 mt-4'>
            <div className='flex flex-col sm:gap-4 sm:py-4 '>
                <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2'>
                    <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3'>
                        <Card className='sm:col-span-3'>
                            <CardHeader className='pb-3'>
                                <CardTitle>Trader Credit System</CardTitle>
                                <CardDescription className='leading-relaxed'>
                                    Manage Trade group customers. See and adjust
                                    their credit limits, view current balance
                                    and view their order history and pending
                                    payments.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className='sm:col-span-3 w-full'>
                            <CardHeader className='pb-3'>
                                <CardTitle className='text-lg'>
                                    Search for trader company
                                </CardTitle>
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
                                                            Trader
                                                        </FormLabel>
                                                        <Popover
                                                            open={popoverOpen}
                                                            onOpenChange={
                                                                setPopoverOpen
                                                            }
                                                        >
                                                            <PopoverTrigger
                                                                asChild
                                                            >
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
                                                                                  (
                                                                                      trader
                                                                                  ) =>
                                                                                      trader.company ===
                                                                                      field.value
                                                                              )
                                                                                  ?.company
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
                                                                            No
                                                                            company
                                                                            found.
                                                                        </CommandEmpty>
                                                                        <CommandGroup>
                                                                            {mappedTraders.map(
                                                                                (
                                                                                    trader
                                                                                ) => (
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
                                        <div className='flex gap-2'>
                                            <Button
                                                type='submit'
                                                disabled={
                                                    form.formState.isSubmitting
                                                }
                                            >
                                                Get trader credit
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
