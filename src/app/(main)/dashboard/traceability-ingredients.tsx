'use client';

import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import CreateIngredient from '@/components/createIngredient';
import CurrentIngredients from '@/components/current-ingredients';
import Loading from '@/components/loading';
import TraceabilityHeader from '@/components/traceability-header';

import getCoordinates from '@/app/actions/getCoordinates';
import type {
    TraceabilityIngredientsFeature,
    TraceabilityIngredientsGeodata,
} from '@/app/lib/types';

export default function TraceabilityIngredients() {
    const { toast } = useToast();

    const [ingredients, setIngredients] = useState<
        TraceabilityIngredientsFeature[]
    >([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                'https://purrform-apps-027e.onrender.com/traceabilityIngredients'
            );
            const data =
                (await response.json()) as TraceabilityIngredientsGeodata;

            setIngredients(data.features);
        };
        try {
            fetchData();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description:
                    'An error occurred while fetching the ingredients data.',
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGetCoordinates = async (
        location: string,
        form: UseFormReturn<
            {
                title: string;
                location: string;
                longitude: number;
                latitude: number;
            },
            any,
            undefined
        >
    ) => {
        if (!location) {
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description:
                    'Fill in the location field to get the coordinates.',
            });
            return;
        }

        const coordinatesData = await getCoordinates(location);

        if (!coordinatesData.ok) {
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description:
                    'Sorry, an error occurred while fetching the coordinates.',
            });
            return;
        }

        form.setValue('longitude', coordinatesData.data!.longitude);
        form.setValue('latitude', coordinatesData.data!.latitude);
    };

    if (ingredients.length === 0) {
        return <Loading />;
    }

    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40 mt-4'>
            <div className='flex flex-col sm:gap-4 sm:py-4 '>
                <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2'>
                    <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
                        <TraceabilityHeader />
                        <CreateIngredient
                            setIngredients={setIngredients}
                            handleGetCoordinates={handleGetCoordinates}
                        />
                        <CurrentIngredients
                            ingredients={ingredients}
                            setIngredients={setIngredients}
                            handleGetCoordinates={handleGetCoordinates}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}
