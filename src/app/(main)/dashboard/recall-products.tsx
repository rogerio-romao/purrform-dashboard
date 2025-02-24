'use client';

import { useEffect, useState } from 'react';

import type { BcProduct, RecallProductsResponse } from '@/app/lib/types';
import { useToast } from '@/hooks/use-toast';

import Loading from '@/components/loading';
import RecallData from '@/components/recall-data';
import RecallHeader from '@/components/recall-header';
import RecallProductsSearch from '@/components/recall-products-search';

export const revalidate = 3600 * 24; // invalidate every 24 hours

export default function RecallProducts() {
    const { toast } = useToast();
    const [products, setProducts] = useState<BcProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [recallLoading, setRecallLoading] = useState<boolean>(false);
    const [recallData, setRecallData] = useState<RecallProductsResponse | null>(
        null
    );

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    'http://localhost:5555/getAllBcProducts'
                );
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast({
                    variant: 'destructive',
                    title: 'ERROR',
                    description:
                        'An error occurred while fetching the products data.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [toast]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40 mt-4'>
            <div className='flex flex-col sm:gap-4 sm:py-4 '>
                <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2'>
                    <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3'>
                        <RecallHeader />
                        <RecallProductsSearch
                            products={products}
                            setRecallLoading={setRecallLoading}
                            setRecallData={setRecallData}
                        />
                        <RecallData
                            recallData={recallData}
                            recallLoading={recallLoading}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}
