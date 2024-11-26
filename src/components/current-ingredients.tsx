'use client';

import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { Pencil, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './ui/tooltip';

import deleteIngredient from '@/app/actions/deleteIngredient';
import updateIngredient from '@/app/actions/updateIngredient';
import type { TraceabilityIngredientsFeature } from '@/app/lib/types';
import { formSchema } from '@/app/lib/utils';

interface CurrentIngredientsProps {
    ingredients: TraceabilityIngredientsFeature[];
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

export default function CurrentIngredients({
    ingredients,
    setIngredients,
    handleGetCoordinates,
}: CurrentIngredientsProps) {
    const { toast } = useToast();
    const [editingId, setEditingId] = useState<number | undefined>(undefined);

    const updateForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            location: '',
            longitude: 0,
            latitude: 0,
        },
    });

    function setEditingIngredient(ingredient: TraceabilityIngredientsFeature) {
        setEditingId(ingredient.properties.id);
        updateForm.setValue('title', ingredient.properties.title);
        updateForm.setValue('location', ingredient.properties.location);
        updateForm.setValue('longitude', ingredient.geometry.coordinates[0]);
        updateForm.setValue('latitude', ingredient.geometry.coordinates[1]);
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

    return (
        <Card className='sm:col-span-2' x-chunk='dashboard-05-chunk-0'>
            <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>
                    Current Ingredients List
                </CardTitle>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ingredient</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Longitude</TableHead>
                                <TableHead>Latitude</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ingredients.map((ingredient) => (
                                <TableRow key={ingredient.properties.id}>
                                    <TableCell>
                                        {ingredient.properties.title}
                                    </TableCell>
                                    <TableCell>
                                        {ingredient.properties.location}
                                    </TableCell>
                                    <TableCell>
                                        {ingredient.geometry.coordinates[0]}
                                    </TableCell>
                                    <TableCell>
                                        {ingredient.geometry.coordinates[1]}
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center gap-2'>
                                            <Dialog>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
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
                                                    <TooltipTrigger asChild>
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
    );
}
