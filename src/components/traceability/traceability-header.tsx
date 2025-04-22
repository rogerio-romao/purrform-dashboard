import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function TraceabilityHeader() {
    return (
        <Card className='sm:col-span-2'>
            <CardHeader className='pb-3'>
                <CardTitle>Traceability Ingredients</CardTitle>
                <CardDescription className='text-balance leading-relaxed'>
                    Manage the igredients list for the Traceability page. View
                    current list, add new ingredients, and edit or delete
                    existing ingredients and locations.
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
