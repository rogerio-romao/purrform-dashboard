import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import createIngredient from '@/app/actions/createIngredient';
import { createIngredientsFormSchema } from '@/app/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import type { TraceabilityIngredientsFeature } from '@/app/lib/types';

interface CreateIngredientProps {
    setIngredients: React.Dispatch<
        React.SetStateAction<TraceabilityIngredientsFeature[]>
    >;
    handleGetCoordinates: (
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
    ) => void;
}

export default function CreateIngredient({
    setIngredients,
    handleGetCoordinates,
}: CreateIngredientProps) {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof createIngredientsFormSchema>>({
        resolver: zodResolver(createIngredientsFormSchema),
        defaultValues: {
            title: '',
            location: '',
            longitude: 0,
            latitude: 0,
        },
    });

    function onSubmit(values: z.infer<typeof createIngredientsFormSchema>) {
        const validated = createIngredientsFormSchema.safeParse(values);

        if (!validated.success) {
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description: validated.error.errors[0].message,
            });
            return;
        }

        createIngredient(validated.data).then((response) => {
            if ('error' in response) {
                toast({
                    variant: 'destructive',
                    title: 'ERROR',
                    description: response.error,
                });
                return;
            }

            form.reset();
            setIngredients((prevIngredients) => {
                const newIngredients = [
                    {
                        type: 'Feature' as const,
                        geometry: {
                            type: 'Point' as const,
                            coordinates: [
                                response.longitude,
                                response.latitude,
                            ] as [number, number],
                        },
                        properties: {
                            id: response.id,
                            title: response.title,
                            location: response.location,
                        },
                    },
                    ...prevIngredients,
                ];

                newIngredients.sort((a, b) =>
                    a.properties.title.localeCompare(b.properties.title)
                );

                return newIngredients;
            });

            toast({
                variant: 'default',
                title: 'SUCCESS',
                description: 'Ingredient added successfully.',
            });
        });
    }

    return (
        <Card className='sm:col-span-2 w-full'>
            <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>Add an Ingredient</CardTitle>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-8'
                        >
                            <div className='flex flex-col justify-center gap-4'>
                                <FormField
                                    control={form.control}
                                    name='title'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Rabbit Legs'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='location'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Paris France'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='longitude'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Longitude</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='latitude'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Latitude</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='flex gap-2'>
                                <Button
                                    type='button'
                                    variant='link'
                                    onClick={() =>
                                        handleGetCoordinates(
                                            form.getValues().location,
                                            form
                                        )
                                    }
                                >
                                    Get Coordinates
                                </Button>
                                <Button type='submit'>Submit</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </CardHeader>
        </Card>
    );
}
