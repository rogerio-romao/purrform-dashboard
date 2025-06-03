import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import IngredientsTable from './ingredients-table';

import type { IngredientsProps } from '@/app/lib/types';

export default function CurrentIngredients({
    ingredients,
    setIngredients,
    handleGetCoordinates,
}: IngredientsProps) {
    return (
        <Card className='sm:col-span-2'>
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
