'use client';

import getCoordinates from '@/app/actions/getCoordinates';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import createIngredient from '../actions/createIngredient';

const formSchema = z.object({
    title: z
        .string({ required_error: 'Title is required' })
        .min(3, 'Title must be at least 3 characters'),
    location: z
        .string({ required_error: 'Location is required' })
        .min(3, 'Location must be at least 3 characters'),
    longitude: z.number({ required_error: 'Longitude is required' }),
    latitude: z.number({ required_error: 'Latitude is required' }),
});

interface TraceabilityIngredientsFeature {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
    properties: {
        id: number;
        title: string;
        location: string;
    };
}
export interface TraceabilityIngredientsGeodata {
    type: 'FeatureCollection';
    features: TraceabilityIngredientsFeature[];
}

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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            location: '',
            longitude: 0,
            latitude: 0,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const validated = formSchema.safeParse(values);

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

    const handleGetCoordinates = async (location: string) => {
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
                        <Card className='sm:col-span-2'>
                            <CardHeader className='pb-3'>
                                <CardTitle>Traceability Ingredients</CardTitle>
                                <CardDescription className='text-balance leading-relaxed'>
                                    Manage the igredients list for the
                                    Traceability page. View current list, add
                                    new ingredients, and edit or delete existing
                                    ingredients and locations.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className='sm:col-span-2 w-full'>
                            <CardHeader className='pb-3'>
                                <CardTitle className='text-lg'>
                                    Add an Ingredient
                                </CardTitle>
                                <CardContent>
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(
                                                onSubmit
                                            )}
                                            className='space-y-8'
                                        >
                                            <div className='flex flex-col justify-center gap-4'>
                                                <FormField
                                                    control={form.control}
                                                    name='title'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Title
                                                            </FormLabel>
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
                                                            <FormLabel>
                                                                Location
                                                            </FormLabel>
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
                                                            <FormLabel>
                                                                Longitude
                                                            </FormLabel>
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
                                                            <FormLabel>
                                                                Latitude
                                                            </FormLabel>
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
                                                            form.getValues()
                                                                .location
                                                        )
                                                    }
                                                >
                                                    Get Coordinates
                                                </Button>
                                                <Button type='submit'>
                                                    Submit
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </CardHeader>
                        </Card>
                        <Card
                            className='sm:col-span-2'
                            x-chunk='dashboard-05-chunk-0'
                        >
                            <CardHeader className='pb-3'>
                                <CardTitle className='text-lg'>
                                    Current Ingredients List
                                </CardTitle>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    Ingredient
                                                </TableHead>
                                                <TableHead>Location</TableHead>
                                                <TableHead>Longitude</TableHead>
                                                <TableHead>Latitude</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {ingredients.map((ingredient) => (
                                                <TableRow
                                                    key={
                                                        ingredient.properties.id
                                                    }
                                                >
                                                    <TableCell>
                                                        {
                                                            ingredient
                                                                .properties
                                                                .title
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            ingredient
                                                                .properties
                                                                .location
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            ingredient.geometry
                                                                .coordinates[0]
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            ingredient.geometry
                                                                .coordinates[1]
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className='flex items-center gap-2'>
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <button>
                                                                            <Pencil className='w-4 h-4' />
                                                                        </button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent
                                                                        side='top'
                                                                        align='center'
                                                                    >
                                                                        Edit
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <button>
                                                                            <Trash2 className='w-4 h-4' />
                                                                        </button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent
                                                                        side='top'
                                                                        align='center'
                                                                    >
                                                                        Delete
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </CardHeader>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
