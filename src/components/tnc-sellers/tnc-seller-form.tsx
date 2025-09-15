import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn, tncSellerFormSchema } from '@/app/lib/utils';
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

interface TncSellerFormProps {
    mappedSellers: {
        bc_id: number;
        first_name: string;
        last_name: string;
        email: string;
    }[];
    setSelectedSellerId: (sellerId: number | null) => void;
}

export default function TncSellerForm({
    mappedSellers,
    setSelectedSellerId,
}: TncSellerFormProps) {
    const { toast } = useToast();
    const [popoverOpen, setPopoverOpen] = useState(false);

    const form = useForm<z.infer<typeof tncSellerFormSchema>>({
        resolver: zodResolver(tncSellerFormSchema),
        defaultValues: {
            selectedSellerId: 0,
            selectedSellerFirstName: '',
            selectedSellerLastName: '',
            selectedSellerEmail: '',
        },
    });

    function onSubmit(data: z.infer<typeof tncSellerFormSchema>) {
        const validated = tncSellerFormSchema.safeParse(data);

        if (!validated.success) {
            console.error(validated.error.format());
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description: 'An error occurred while submitting the form.',
            });
            return;
        }

        setSelectedSellerId(data.selectedSellerId);
    }

    return (
        <Card className='sm:col-span-3 w-full'>
            <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>Search for TNC seller</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8 my-6'
                    >
                        <FormField
                            control={form.control}
                            name='selectedSellerId'
                            render={({ field }) => (
                                <FormItem className='hidden'>
                                    <FormControl>
                                        <Input
                                            type='hidden'
                                            {...field}
                                            value={
                                                mappedSellers.find(
                                                    (seller) =>
                                                        seller.email ===
                                                        form.getValues(
                                                            'selectedSellerEmail'
                                                        )
                                                )?.bc_id || 0
                                            }
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='selectedSellerEmail'
                            render={({ field }) => (
                                <FormItem className='hidden'>
                                    <FormControl>
                                        <Input
                                            type='hidden'
                                            {...field}
                                            value={
                                                mappedSellers.find(
                                                    (seller) =>
                                                        seller.email ===
                                                        form.getValues(
                                                            'selectedSellerEmail'
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
                                name='selectedSellerFirstName'
                                render={({ field }) => (
                                    <FormItem className='flex flex-col'>
                                        <FormLabel>
                                            TNC Sellers
                                            {mappedSellers.length > 0 && (
                                                <span className='text-xs text-muted-foreground ml-2'>
                                                    {mappedSellers.length}{' '}
                                                    sellers found
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
                                                            ? form.getValues(
                                                                  'selectedSellerFirstName'
                                                              ) +
                                                              ' ' +
                                                              form.getValues(
                                                                  'selectedSellerLastName'
                                                              )
                                                            : 'Select seller'}
                                                        <ChevronsUpDown className='opacity-50' />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className='w-[100%] p-0'>
                                                <Command>
                                                    <CommandInput
                                                        placeholder='Search seller...'
                                                        className='h-9'
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            No seller found.
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {mappedSellers.map(
                                                                (seller) => (
                                                                    <CommandItem
                                                                        value={
                                                                            seller.first_name +
                                                                            ' ' +
                                                                            seller.last_name
                                                                        }
                                                                        key={
                                                                            seller.bc_id
                                                                        }
                                                                        onSelect={() => {
                                                                            form.setValue(
                                                                                'selectedSellerFirstName',
                                                                                seller.first_name
                                                                            );
                                                                            form.setValue(
                                                                                'selectedSellerLastName',
                                                                                seller.last_name
                                                                            );
                                                                            form.setValue(
                                                                                'selectedSellerId',
                                                                                seller.bc_id
                                                                            );
                                                                            form.setValue(
                                                                                'selectedSellerEmail',
                                                                                seller.email
                                                                            );
                                                                            // Trigger form validation after setting values
                                                                            form.trigger();
                                                                            setPopoverOpen(
                                                                                false
                                                                            );
                                                                        }}
                                                                    >
                                                                        {seller.first_name +
                                                                            ' ' +
                                                                            seller.last_name}
                                                                        <Check
                                                                            className={cn(
                                                                                'ml-auto',
                                                                                seller.email ===
                                                                                    form.getValues(
                                                                                        'selectedSellerEmail'
                                                                                    )
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
                                Get seller&apos;s data
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
