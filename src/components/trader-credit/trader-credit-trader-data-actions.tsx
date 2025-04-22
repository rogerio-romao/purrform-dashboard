import type { CreditSystemTrader } from '@/app/lib/types';

import { CardContent } from '@/components//ui/card';
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
import { Button } from '@/components/ui/button';

interface TraderCreditTraderDataActionsProps {
    trader: CreditSystemTrader;
    handleViewPendingPayments: () => void;
    handleViewOrderHistory: () => void;
    handleRemoveTrader: () => void;
    companyName: string;
}

export default function TraderCreditTraderDataActions({
    trader,
    handleViewPendingPayments,
    handleViewOrderHistory,
    handleRemoveTrader,
    companyName,
}: TraderCreditTraderDataActionsProps) {
    return (
        <CardContent>
            <div className='flex space-x-4'>
                <Button variant='outline' onClick={handleViewPendingPayments}>
                    View Pending Payments
                </Button>
                <Button variant='outline' onClick={handleViewOrderHistory}>
                    View Order History
                </Button>
                <Button variant='outline'>Change Company Credit</Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='outline'>Remove Trader</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will remove <strong>{companyName}</strong>{' '}
                                ({trader.bc_customer_email}) from the credit
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
    );
}
