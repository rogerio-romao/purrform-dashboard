import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from './ui/button';
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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

import updateIngredient from '@/app/actions/updateIngredient';
import type {
    IngredientsProps,
    TraceabilityIngredientsFeature,
} from '@/app/lib/types';
import { formSchema } from '@/app/lib/utils';

type UpdateIngredientModalProps = Omit<IngredientsProps, 'ingredients'> & {
    ingredient: TraceabilityIngredientsFeature;
};

export default function UpdateIngredientModal({
    setIngredients,
    handleGetCoordinates,
    ingredient,
}: UpdateIngredientModalProps) {
    const { toast } = useToast();

    const updateForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ingredient.properties.title,
            location: ingredient.properties.location,
            longitude: ingredient.geometry.coordinates[0],
            latitude: ingredient.geometry.coordinates[1],
        },
    });

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
                id: ingredient.properties.id,
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
            id: ingredient.properties.id,
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
            prevIngredients.map((prevIngredient) =>
                prevIngredient.properties.id === ingredient.properties.id
                    ? updatedIngredient
                    : prevIngredient
            )
        );

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

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Ingredient</DialogTitle>

                <DialogDescription asChild>
                    <Form {...updateForm}>
                        <form
                            onSubmit={updateForm.handleSubmit(onUpdate)}
                            className='space-y-8'
                        >
                            <div className='flex flex-col justify-center gap-4'>
                                <FormField
                                    control={updateForm.control}
                                    name='title'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={updateForm.control}
                                    name='location'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={updateForm.control}
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
                                    control={updateForm.control}
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
                                            updateForm.getValues().location,
                                            updateForm
                                        )
                                    }
                                >
                                    Get Coordinates
                                </Button>
                                <Button type='submit'>Submit</Button>
                            </div>
                        </form>
                    </Form>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    );
}
