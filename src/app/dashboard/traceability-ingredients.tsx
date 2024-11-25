'use client';

import Loading from '@/components/loading';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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
interface TraceabilityIngredientsGeodata {
    type: 'FeatureCollection';
    features: TraceabilityIngredientsFeature[];
}

export default function TraceabilityIngredients() {
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
        fetchData();
    }, []);

    if (ingredients.length === 0) {
        return <Loading />;
    }

    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40 mt-4'>
            <div className='flex flex-col sm:gap-4 sm:py-4 '>
                <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2'>
                    <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
                        <Card
                            className='sm:col-span-2'
                            x-chunk='dashboard-05-chunk-0'
                        >
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
                        <Card
                            className='sm:col-span-2'
                            x-chunk='dashboard-05-chunk-0'
                        >
                            <CardHeader className='pb-3'>
                                <CardTitle className='text-lg'>
                                    Add an Ingredient
                                </CardTitle>
                                <CardContent></CardContent>
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
