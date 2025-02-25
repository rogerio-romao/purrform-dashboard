import type { RecallProductsResponse } from '@/app/lib/types';
import { useToast } from '@/hooks/use-toast';

import Loading from '@/components/loading';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

interface RecallDataProps {
    recallData: RecallProductsResponse | null;
    recallLoading: boolean;
}

export default function RecallData({
    recallData,
    recallLoading,
}: RecallDataProps) {
    const { toast } = useToast();

    function handleCopyEmails() {
        const emails = recallData?.customerEmails.join(', ');
        if (emails) {
            navigator.clipboard
                .writeText(emails)
                .then(() => {
                    toast({ description: 'Emails copied to clipboard!' });
                })
                .catch(() => {
                    toast({ description: 'Failed to copy emails.' });
                });
        }
    }

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
        const { productName, orderNumbers, customerEmails, totalOrders } =
            recallData;
        return (
            <Card className='sm:col-span-3'>
                <CardHeader className='pb-3'>
                    <CardTitle className='text-lg'>Recall Data</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className='mt-6'>
                    <p className='my-2 text-sm'>
                        <span className='font-bold'>Product Name:</span>{' '}
                        {productName}
                    </p>
                    <p className='my-2 text-sm'>
                        <span className='font-bold'>Total Orders:</span>{' '}
                        {totalOrders}
                    </p>
                    <p className='my-2 text-sm'>
                        <span className='font-bold'>Affected Orders:</span>{' '}
                        {orderNumbers.length}
                    </p>
                    <p className='my-2 text-sm'>
                        <span className='font-bold'>Order Numbers:</span>{' '}
                        {orderNumbers.join(', ')}
                    </p>
                    <p className='my-2 text-sm'>
                        <span className='font-bold'>Customer Emails:</span>{' '}
                        <textarea
                            className='w-full mt-2 border border-gray-300 rounded-md p-2'
                            value={customerEmails.join(', ')}
                            readOnly
                            style={{ resize: 'none' }}
                            rows={3}
                        />
                    </p>
                    <Button
                        className='mt-4'
                        variant='secondary'
                        onClick={handleCopyEmails}
                    >
                        Copy Emails
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return null;
}
