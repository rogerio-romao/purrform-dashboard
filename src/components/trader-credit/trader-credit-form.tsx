import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn, traderOnCreditFormSchema } from '@/app/lib/utils';
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
        company: string;
        email: string;
    }[];
    setSelectedTraderId: (traderId: number | null) => void;
}

export default function TraderCreditForm({
    mappedTraders,
    setSelectedTraderId,
}: TraderCreditFormProps) {
    const { toast } = useToast();
    const [popoverOpen, setPopoverOpen] = useState(false);

    const form = useForm<z.infer<typeof traderOnCreditFormSchema>>({
        resolver: zodResolver(traderOnCreditFormSchema),
        defaultValues: {
            selectedTraderId: 0,
            selectedTraderCompany: '',
            selectedTraderEmail: '',
        },
    });

    function onSubmit(data: z.infer<typeof traderOnCreditFormSchema>) {
        const validated = traderOnCreditFormSchema.safeParse(data);

        if (!validated.success) {
            console.error(validated.error.format());
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description: 'An error occurred while submitting the form.',
            });
            return;
        }

        setSelectedTraderId(data.selectedTraderId);
    }

    return (
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
                                            Traders on the credit system
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
                                                                            // Trigger form validation after setting values
                                                                            form.trigger();
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
                        <div className='flex gap-2'>
                            <Button
                                type='submit'
                                disabled={
                                    !form.formState.isValid ||
                                    form.formState.isSubmitting
                                }
                            >
                                Get trader&apos;s credit data
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
