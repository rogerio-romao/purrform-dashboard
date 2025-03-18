import type { CreditSystemTrader } from '@/app/lib/types';
import { useToast } from '@/hooks/use-toast';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui/card';
import { Separator } from './ui/separator';

interface TraderCreditTraderDataProps {
    trader: CreditSystemTrader | undefined;
    setSelectedTraderId: React.Dispatch<React.SetStateAction<number | null>>;
    setCreditTraders: React.Dispatch<
        React.SetStateAction<CreditSystemTrader[]>
    >;
}

export default function TraderCreditTraderData({
    trader,
    setSelectedTraderId,
    setCreditTraders,
}: TraderCreditTraderDataProps) {
    const { toast } = useToast();

    if (!trader) {
        return null;
    }

    const companyName = trader.bc_customer_company
        ? trader.bc_customer_company
        : `${trader.bc_customer_first_name} ${trader.bc_customer_last_name}`;

    async function handleRemoveTrader() {
        if (!trader) {
            return;
        }

        const response = await fetch(
            `http://localhost:5555/removeTraderFromCreditSystem?traderId=${trader.id}`
        );

        if (response.ok) {
            toast({
                variant: 'default',
                title: 'Trader Removed',
                description: `${companyName} has been removed from the credit system.`,
            });

            setSelectedTraderId(null);
            setCreditTraders((prevTraders) =>
                prevTraders.filter((t) => t.id !== trader.id)
            );
        } else {
            const message = await response.text();
            toast({
                variant: 'destructive',
                title: 'Error',
                description: `Failed to remove trader: ${message}`,
            });
        }
    }

    return (
        <Card className='sm:col-span-3'>
            <CardHeader>
                <CardTitle className='text-lg'>
                    Trader Credit Information
                </CardTitle>
            </CardHeader>
            <CardContent className='mt-3'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                    <div className='col-span-1'>
                        <CardDescription>Trader:</CardDescription>
                        <CardTitle className='mt-1'>{companyName}</CardTitle>
                        <p className='text-muted-foreground mt-[0.15rem]'>
                            {trader.bc_customer_email}
                        </p>
                    </div>
                    <div className='grid grid-cols-2 col-span-2 gap-4'>
                        <div>
                            <div className='flex items-center'>
                                <CardDescription>Customer ID:</CardDescription>
                                <p className='ml-1'>{trader.bc_customer_id}</p>
                            </div>
                            <div className='flex items-center'>
                                <CardDescription>First Name:</CardDescription>
                                <p className='pl-1'>
                                    {trader.bc_customer_first_name}
                                </p>
                            </div>
                            <div className='flex items-center'>
                                <CardDescription>Last Name:</CardDescription>
                                <p className='pl-1'>
                                    {trader.bc_customer_last_name}
                                </p>
                            </div>
                            <div className='flex items-center'>
                                <CardDescription>Company:</CardDescription>
                                <p className='ml-1'>
                                    {trader.bc_customer_company || 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div>
                                <CardDescription>Credit Limit:</CardDescription>
                                <p className='ml-1 text-xl font-bold'>
                                    £ {trader.credit_ceiling}
                                </p>
                            </div>
                            <div>
                                <CardDescription>
                                    Current Balance:
                                </CardDescription>
                                <p className='ml-1 text-xl font-bold'>
                                    £ {trader.current_balance}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Separator className='my-8' />
                <div className='flex space-x-4'>
                    <Button variant='outline'>View Pending Payments</Button>
                    <Button variant='outline'>View Order History</Button>
                    <Button variant='outline'>Change Company Credit</Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant='outline'>Remove Trader</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will remove{' '}
                                    <strong>{companyName}</strong> (
                                    {trader.bc_customer_email}) from the credit
                                    system.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Cancel Removal
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleRemoveTrader}>
                                    Confirm Removal
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
}
