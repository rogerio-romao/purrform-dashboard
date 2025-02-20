import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { BcProduct } from '@/app/lib/types';
import { cn, recallProductsFormSchema } from '@/app/lib/utils';

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

interface RecallProductsSearchProps {
    products: BcProduct[];
}

export default function RecallProductsSearch({
    products,
}: RecallProductsSearchProps) {
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

    const onSubmit = (data: z.infer<typeof recallProductsFormSchema>) => {
        if (form.formState.errors) {
            return;
        }
        console.log(data);
    };

    return (
        <Card className='sm:col-span-3 w-full'>
            <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>
                    Search for product to recall
                </CardTitle>
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
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant='outline'
                                                            role='combobox'
                                                            className={cn(
                                                                'w-[200px] justify-between',
                                                                !field.value &&
                                                                    'text-muted-foreground'
                                                            )}
                                                        >
                                                            {field.value
                                                                ? products.find(
                                                                      (
                                                                          product
                                                                      ) =>
                                                                          product.name ===
                                                                          field.value
                                                                  )?.name
                                                                : 'Select product'}
                                                            <ChevronsUpDown className='opacity-50' />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className='w-[200px] p-0'>
                                                    <Command>
                                                        <CommandInput
                                                            placeholder='Search product...'
                                                            className='h-9'
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                No product
                                                                found.
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {products.map(
                                                                    (
                                                                        product
                                                                    ) => (
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
                                                    Start Date
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
                                                <FormLabel>End Date</FormLabel>
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
                                <Button type='submit'>Search orders</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </CardHeader>
        </Card>
    );
}
