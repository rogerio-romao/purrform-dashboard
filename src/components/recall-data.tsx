import type { RecallProductsResponse } from '@/app/lib/types';

import Loading from '@/components/loading';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface RecallDataProps {
    recallData: RecallProductsResponse | null;
    recallLoading: boolean;
}

export default function RecallData({
    recallData,
    recallLoading,
}: RecallDataProps) {
    if (recallLoading) {
        return (
            <Card className='sm:col-span-3'>
                <CardHeader className='pb-3'>
                    <Loading />
                </CardHeader>
            </Card>
        );
    }

    if (recallData) {
        const { productName, affectedOrders, customerEmails, totalOrders } =
            recallData;
        return (
            <Card className='sm:col-span-3'>
                <CardHeader className='pb-3'>
                    <CardTitle className='text-lg'>Recall Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='my-2'>
                        <span className='font-bold'>Product Name:</span>{' '}
                        {productName}
                    </p>
                    <p className='my-2'>
                        <span className='font-bold'>Total Orders:</span>{' '}
                        {totalOrders}
                    </p>
                    <p className='my-2'>
                        <span className='font-bold'>Affected Orders:</span>{' '}
                        {affectedOrders}
                    </p>
                    <p className='my-2'>
                        <span className='font-bold'>Customer Emails:</span>{' '}
                        {customerEmails.join(', ')}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return null;
}
