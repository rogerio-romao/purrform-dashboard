import IngredientsTable from './ingredients-table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableHead, TableHeader, TableRow } from './ui/table';

import type { IngredientsProps } from '@/app/lib/types';

export default function CurrentIngredients({
    ingredients,
    setIngredients,
    handleGetCoordinates,
}: IngredientsProps) {
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
                        <IngredientsTable
                            ingredients={ingredients}
                            setIngredients={setIngredients}
                            handleGetCoordinates={handleGetCoordinates}
                        />
                    </Table>
                </CardContent>
            </CardHeader>
        </Card>
    );
}
