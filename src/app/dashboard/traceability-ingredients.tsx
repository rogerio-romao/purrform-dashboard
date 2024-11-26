'use client';

import getCoordinates from '@/app/actions/getCoordinates';
import type {
    TraceabilityIngredientsFeature,
    TraceabilityIngredientsGeodata,
} from '@/app/lib/types';
import { formSchema } from '@/app/lib/utils';
import CreateIngredient from '@/components/createIngredient';
import Loading from '@/components/loading';
import TraceabilityHeader from '@/components/traceability-header';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import deleteIngredient from '../actions/deleteIngredient';
import updateIngredient from '../actions/updateIngredient';

export default function TraceabilityIngredients() {
    const { toast } = useToast();

    const [ingredients, setIngredients] = useState<
        TraceabilityIngredientsFeature[]
    >([]);

    const [editingId, setEditingId] = useState<number | undefined>(undefined);

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

    const updateForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            location: '',
            longitude: 0,
            latitude: 0,
        },
    });

    function handleDeleteIngredient(id: number) {
        deleteIngredient(id).then((success) => {
            if (!success) {
                toast({
                    variant: 'destructive',
                    title: 'ERROR',
                    description: 'Failed to delete ingredient.',
                });
                return;
            }

            setIngredients((prevIngredients) =>
                prevIngredients.filter(
                    (ingredient) => ingredient.properties.id !== id
                )
            );

            toast({
                variant: 'default',
                title: 'SUCCESS',
                description: 'Ingredient deleted successfully.',
            });
        });
    }

    function onUpdate(values: z.infer<typeof formSchema>) {
        const validated = formSchema.safeParse(values);

        if (!validated.success) {
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description: validated.error.errors[0].message,
            });
            return;
        }

        const updatedIngredient = {
            type: 'Feature' as const,
            properties: {
                id: editingId!,
                title: validated.data.title,
                location: validated.data.location,
            },
            geometry: {
                type: 'Point' as const,
                coordinates: [
                    validated.data.longitude,
                    validated.data.latitude,
                ] as [number, number],
            },
        };

        updateIngredient({
            id: editingId!,
            title: validated.data.title,
            location: validated.data.location,
            longitude: validated.data.longitude,
            latitude: validated.data.latitude,
        }).then((response) => {
            if ('error' in response) {
                toast({
                    variant: 'destructive',
                    title: 'ERROR',
                    description: response.error,
                });
                return;
            }
        });

        setIngredients((prevIngredients) =>
            prevIngredients.map((ingredient) =>
                ingredient.properties.id === editingId
                    ? updatedIngredient
                    : ingredient
            )
        );

        setEditingId(undefined);
        // Close the dialog
        const closeButton = document.querySelector(
            '[role="dialog"] > button'
        ) as HTMLButtonElement;
        closeButton?.click();

        toast({
            variant: 'default',
            title: 'SUCCESS',
            description: 'Ingredient updated successfully.',
        });
    }

    function setEditingIngredient(ingredient: TraceabilityIngredientsFeature) {
        setEditingId(ingredient.properties.id);
        updateForm.setValue('title', ingredient.properties.title);
        updateForm.setValue('location', ingredient.properties.location);
        updateForm.setValue('longitude', ingredient.geometry.coordinates[0]);
        updateForm.setValue('latitude', ingredient.geometry.coordinates[1]);
    }

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
                                                            <Dialog>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger
                                                                            asChild
                                                                        >
                                                                            <DialogTrigger
                                                                                asChild
                                                                            >
                                                                                <button
                                                                                    onClick={() =>
                                                                                        setEditingIngredient(
                                                                                            ingredient
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Pencil className='w-4 h-4' />
                                                                                </button>
                                                                            </DialogTrigger>
                                                                        </TooltipTrigger>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <DialogTitle>
                                                                                    Edit
                                                                                    Ingredient
                                                                                </DialogTitle>

                                                                                <DialogDescription
                                                                                    asChild
                                                                                >
                                                                                    <Form
                                                                                        {...updateForm}
                                                                                    >
                                                                                        <form
                                                                                            onSubmit={updateForm.handleSubmit(
                                                                                                onUpdate
                                                                                            )}
                                                                                            className='space-y-8'
                                                                                        >
                                                                                            <div className='flex flex-col justify-center gap-4'>
                                                                                                <FormField
                                                                                                    control={
                                                                                                        updateForm.control
                                                                                                    }
                                                                                                    name='title'
                                                                                                    render={({
                                                                                                        field,
                                                                                                    }) => (
                                                                                                        <FormItem>
                                                                                                            <FormLabel>
                                                                                                                Title
                                                                                                            </FormLabel>
                                                                                                            <FormControl>
                                                                                                                <Input
                                                                                                                    {...field}
                                                                                                                />
                                                                                                            </FormControl>
                                                                                                            <FormMessage />
                                                                                                        </FormItem>
                                                                                                    )}
                                                                                                />
                                                                                                <FormField
                                                                                                    control={
                                                                                                        updateForm.control
                                                                                                    }
                                                                                                    name='location'
                                                                                                    render={({
                                                                                                        field,
                                                                                                    }) => (
                                                                                                        <FormItem>
                                                                                                            <FormLabel>
                                                                                                                Location
                                                                                                            </FormLabel>
                                                                                                            <FormControl>
                                                                                                                <Input
                                                                                                                    {...field}
                                                                                                                />
                                                                                                            </FormControl>
                                                                                                            <FormMessage />
                                                                                                        </FormItem>
                                                                                                    )}
                                                                                                />
                                                                                                <FormField
                                                                                                    control={
                                                                                                        updateForm.control
                                                                                                    }
                                                                                                    name='longitude'
                                                                                                    render={({
                                                                                                        field,
                                                                                                    }) => (
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
                                                                                                    control={
                                                                                                        updateForm.control
                                                                                                    }
                                                                                                    name='latitude'
                                                                                                    render={({
                                                                                                        field,
                                                                                                    }) => (
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
                                                                                                            updateForm.getValues()
                                                                                                                .location,
                                                                                                            updateForm
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    Get
                                                                                                    Coordinates
                                                                                                </Button>
                                                                                                <Button type='submit'>
                                                                                                    Submit
                                                                                                </Button>
                                                                                            </div>
                                                                                        </form>
                                                                                    </Form>
                                                                                </DialogDescription>
                                                                            </DialogHeader>
                                                                        </DialogContent>

                                                                        <TooltipContent
                                                                            side='top'
                                                                            align='center'
                                                                        >
                                                                            Edit
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </Dialog>
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <button
                                                                            onClick={() =>
                                                                                handleDeleteIngredient(
                                                                                    ingredient
                                                                                        .properties
                                                                                        .id
                                                                                )
                                                                            }
                                                                        >
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
