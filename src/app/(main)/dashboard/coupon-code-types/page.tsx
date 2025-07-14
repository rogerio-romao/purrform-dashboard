'use client';

import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Loading from '@/components/common/loading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import createCouponType from '@/app/actions/createCouponType';
import { BACKEND_BASE_URL } from '@/app/lib/definitions';
import { createCouponTypeFormSchema } from '@/app/lib/utils';

import type { CouponType } from '@/app/lib/types';

export default function RecallProducts() {
    const { toast } = useToast();
    const [couponTypes, setCouponTypes] = useState<CouponType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchCouponTypes = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${BACKEND_BASE_URL}/getCouponTypes`
                );
                const data = (await response.json()) as CouponType[];
                setCouponTypes(data);
            } catch (error) {
                console.error('Error fetching coupon types:', error);
                toast({
                    variant: 'destructive',
                    title: 'ERROR',
                    description:
                        'An error occurred while fetching the coupon types.',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchCouponTypes();
    }, []);

    const form = useForm<z.infer<typeof createCouponTypeFormSchema>>({
        resolver: zodResolver(createCouponTypeFormSchema),
        defaultValues: {
            name: '',
            prefix: '',
            description: '',
            details: '',
        },
    });

    function handleSubmit(data: z.infer<typeof createCouponTypeFormSchema>) {
        const validated = createCouponTypeFormSchema.safeParse(data);
        if (!validated.success) {
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description: validated.error.errors[0].message,
            });
            return;
        }

        createCouponType(validated.data).then((response) => {
            if ('error' in response) {
                toast({
                    variant: 'destructive',
                    title: 'ERROR',
                    description: response.error,
                });
                return;
            }

            setCouponTypes((prev) => [...prev, response]);
            form.reset();
            toast({
                variant: 'default',
                title: 'Success',
                description: 'Coupon type created successfully.',
            });

            // close the dialog
            setDialogOpen(false);
        });
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <Card className='mt-4'>
            <CardHeader>
                <CardTitle>Coupon Code Types</CardTitle>
                <CardDescription>
                    List of the different types of coupon codes and their
                    prefixes. You can create new coupon types here.
                </CardDescription>
            </CardHeader>
            <CardContent className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {couponTypes.map((coupon) => (
                    <Card key={coupon.id} className='flex flex-col'>
                        <CardHeader>
                            <CardTitle className='text-lg'>
                                {coupon.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='flex-1'>
                            <CardDescription>
                                {coupon.description} {coupon.details}
                            </CardDescription>
                        </CardContent>
                        <CardFooter>
                            Prefix:{' '}
                            <span className='font-semibold ml-1 text-lg text-green-600'>
                                {coupon.prefix}
                            </span>
                        </CardFooter>
                    </Card>
                ))}

                {/* Add New Coupon Type */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Card className='flex flex-col cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors group'>
                            <CardHeader>
                                <CardTitle className='text-lg'>
                                    New Coupon Type
                                </CardTitle>
                                <CardDescription>
                                    Create a new type of coupon code. If
                                    possible use an underscore after the prefix.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='flex-1'>
                                <div className='flex items-center justify-center h-full'>
                                    <CirclePlus
                                        height={36}
                                        width={36}
                                        className='group-hover:text-green-600'
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[425px] lg:max-w-[650px]'>
                        <DialogHeader>
                            <DialogTitle>Create new Coupon Type</DialogTitle>
                            <DialogDescription>
                                Define the coupon type here. Click save when
                                you&apos;re done.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleSubmit)}
                                className='space-y-4'
                            >
                                <div className='grid gap-4'>
                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='e.g. New Product Launch'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='prefix'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Prefix</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='e.g. NPL_'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='description'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Description
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='e.g. This coupon is for the new product launch.'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='details'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Details</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='e.g. 10% off on this new product.'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant='outline' type='button'>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type='submit'
                                        disabled={
                                            form.formState.isSubmitting ||
                                            !form.formState.isValid
                                        }
                                    >
                                        Save changes
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
