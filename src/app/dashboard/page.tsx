import OrdersBarChart from '@/components/orders-bar-chart';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default async function Page() {
    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40'>
            <div className='flex flex-col sm:gap-4 sm:py-4 '>
                <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2'>
                    <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
                        <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4'>
                            <Card
                                className='sm:col-span-2'
                                x-chunk='dashboard-05-chunk-0'
                            >
                                <CardHeader className='pb-3'>
                                    <CardTitle>
                                        Orders & Loyalty Points
                                    </CardTitle>
                                    <CardDescription className='max-w-lg text-balance leading-relaxed'>
                                        Reporting number of orders, value of
                                        orders, and loyalty points usage value
                                        and percentage of total orders.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card x-chunk='dashboard-05-chunk-1'>
                                <CardHeader className='pb-2'>
                                    <CardDescription>
                                        Orders This month
                                    </CardDescription>
                                    <CardTitle className='text-2xl lg:text-3xl'>
                                        £341,841
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='text-xs text-muted-foreground'>
                                        2,826 orders
                                    </div>
                                </CardContent>
                                <CardHeader className='pb-2'>
                                    <CardDescription>
                                        Orders Last Month
                                    </CardDescription>
                                    <CardTitle className='text-2xl lg:text-3xl'>
                                        £322,348
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='text-xs text-muted-foreground'>
                                        2,699 orders
                                    </div>
                                </CardContent>
                            </Card>
                            <Card x-chunk='dashboard-05-chunk-2'>
                                <CardHeader className='pb-2'>
                                    <CardDescription>
                                        Loyalty Points This Month
                                    </CardDescription>
                                    <CardTitle className='text-2xl lg:text-3xl'>
                                        £5,329
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='text-xs text-muted-foreground'>
                                        156 orders
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <div className='flex flex-col w-full gap-2'>
                                        <div className='text-xs text-muted-foreground'>
                                            1.5% of value
                                        </div>
                                        <Progress
                                            value={1.5}
                                            aria-label='1.5% of value'
                                        />
                                        <div className='text-xs text-muted-foreground'>
                                            5.5% of orders
                                        </div>
                                        <Progress
                                            value={5.5}
                                            aria-label='5.5% of orders'
                                        />
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                        <Card>
                            <CardHeader className='px-7'>
                                <CardTitle>Orders & Loyalty Points</CardTitle>
                                <CardDescription>
                                    Last 6 months breakdown
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <OrdersBarChart />
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
