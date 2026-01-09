'use client';
import { BACKEND_BASE_URL } from '@/app/lib/definitions';
import { useEffect, useState } from 'react';

import Loading from '@/components/common/loading';
import DeliveryDatesList from '@/components/delivery-dates/delivery-dates-list';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import type { DeliveryDate } from '@/app/lib/types';

export default function DeliveryDatesPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deliveryDates, setDeliveryDates] = useState<DeliveryDate[]>([]);

    useEffect(() => {
        // Fetch delivery dates from the backend API
        async function fetchDeliveryDates() {
            try {
                const response = await fetch(
                    `${BACKEND_BASE_URL}/deliveryDatesForDashboard`
                );
                const data = (await response.json()) as DeliveryDate[];
                setDeliveryDates(data);
            } catch (error) {
                setError('Failed to fetch delivery dates');
                console.error('Error fetching delivery dates:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchDeliveryDates();
    }, []);

    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40 mt-4'>
            <div className='flex flex-col sm:gap-4 sm:py-4 '>
                <div className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2'>
                    <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
                        <Card className='sm:col-span-2'>
                            <CardHeader className='pb-3'>
                                <CardTitle>Delivery Dates</CardTitle>
                                <CardDescription className='text-balance leading-relaxed'>
                                    View and manage delivery dates. Insert new
                                    dates, or adjust the delivery slots up or
                                    down for specific days.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card
                            className='sm:col-span-2'
                            x-chunk='dashboard-05-chunk-0'
                        >
                            {isLoading ? (
                                <Loading />
                            ) : error ? (
                                <div className='p-4 text-red-500'>{error}</div>
                            ) : (
                                <DeliveryDatesList
                                    deliveryDates={deliveryDates}
                                    setDeliveryDates={setDeliveryDates}
                                />
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
