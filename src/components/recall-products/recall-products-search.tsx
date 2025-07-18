import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { BcProduct, RecallProductsResponse } from '@/app/lib/types';
import { cn, recallProductsFormSchema } from '@/app/lib/utils';
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

import { BACKEND_BASE_URL } from '@/app/lib/definitions';

interface RecallProductsSearchProps {
    products: BcProduct[];
    setRecallLoading: (loading: boolean) => void;
    setRecallData: (data: RecallProductsResponse | null) => void;
}

export default function RecallProductsSearch({
    products,
    setRecallLoading,
    setRecallData,
}: RecallProductsSearchProps) {
    const { toast } = useToast();
    const [popoverOpen, setPopoverOpen] = useState(false);

    const form = useForm<z.infer<typeof recallProductsFormSchema>>({
        resolver: zodResolver(recallProductsFormSchema),
        defaultValues: {
            selectedProductName: '',
            selectedProductId: undefined,
            startDate: '',
            endDate: '',
        },
    });

    const [startInput, endInput] = form.watch(['startDate', 'endDate']);

    useEffect(() => {
        if (startInput && endInput) {
            const startDate = new Date(startInput);
            const endDate = new Date(endInput);

            if (startDate > endDate) {
                form.setError('startDate', {
                    type: 'manual',
                    message: 'Start date must be before end date',
                });
            } else {
                form.clearErrors('startDate');
            }
        }
    }, [startInput, endInput, form]);

    async function onSubmit(data: z.infer<typeof recallProductsFormSchema>) {
        const validated = recallProductsFormSchema.safeParse(data);

        if (!validated.success) {
            console.error('Validation error:', validated.error.errors);
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description: validated.error.errors[0].message,
            });
            return;
        }

        const { selectedProductName, selectedProductId, startDate, endDate } =
            validated.data;

        setRecallLoading(true);

        const startDateWithTime = `${startDate}T00:00:00`;
        const endDateWithTime = `${endDate}T23:59:59`;

        // Call API to search for orders
        const response = await fetch(
            `${BACKEND_BASE_URL}/recallProducts?productName=${encodeURIComponent(
                selectedProductName
            )}&productId=${selectedProductId}&startDate=${startDateWithTime}&endDate=${endDateWithTime}`
        );

        if (!response.ok) {
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description:
                    'An error occurred while fetching the orders data.',
            });
            return;
        }

        const recallData = (await response.json()) as RecallProductsResponse;

        setRecallData(recallData);
        setRecallLoading(false);
    }

    return (
        <Card className='sm:col-span-3 w-full'>
            <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>
                    Search for product to recall
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
                            name='selectedProductId'
                            render={({ field }) => (
                                <FormItem className='hidden'>
                                    <FormControl>
                                        <Input
                                            type='hidden'
                                            {...field}
                                            value={
                                                products.find(
                                                    (product) =>
                                                        product.name ===
                                                        form.getValues(
                                                            'selectedProductName'
                                                        )
                                                )?.id || 0
                                            }
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className='flex flex-col justify-center gap-4'>
                            <FormField
                                control={form.control}
                                name='selectedProductName'
                                render={({ field }) => (
                                    <FormItem className='flex flex-col'>
                                        <FormLabel>Product</FormLabel>
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
                                                            ? products.find(
                                                                  (product) =>
                                                                      product.name ===
                                                                      field.value
                                                              )?.name
                                                            : 'Select product'}
                                                        <ChevronsUpDown className='opacity-50' />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className='w-[100%] p-0'>
                                                <Command>
                                                    <CommandInput
                                                        placeholder='Search product...'
                                                        className='h-9'
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            No product found.
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {products.map(
                                                                (product) => (
                                                                    <CommandItem
                                                                        value={
                                                                            product.name
                                                                        }
                                                                        key={
                                                                            product.id
                                                                        }
                                                                        onSelect={() => {
                                                                            form.setValue(
                                                                                'selectedProductName',
                                                                                product.name
                                                                            );
                                                                            form.setValue(
                                                                                'selectedProductId',
                                                                                product.id
                                                                            );
                                                                            setPopoverOpen(
                                                                                false
                                                                            );
                                                                        }}
                                                                    >
                                                                        {
                                                                            product.name
                                                                        }
                                                                        <Check
                                                                            className={cn(
                                                                                'ml-auto',
                                                                                product.name ===
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
                            <div className='flex gap-4'>
                                <FormField
                                    control={form.control}
                                    name='startDate'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Start Date{' '}
                                                <span className='text-xs text-muted-foreground ml-1'>
                                                    from 00:00H
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='date'
                                                    {...field}
                                                    required
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='endDate'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                End Date{' '}
                                                <span className='text-xs text-muted-foreground ml-1'>
                                                    to 23:59H
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='date'
                                                    {...field}
                                                    required
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <Button
                                type='submit'
                                disabled={
                                    !form.formState.isValid ||
                                    form.formState.isSubmitting
                                }
                            >
                                Search orders
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
