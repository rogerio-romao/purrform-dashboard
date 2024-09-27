import {
    ChevronLeft,
    ChevronRight,
    Copy,
    CreditCard,
    File,
    Home,
    LineChart,
    ListFilter,
    MoreVertical,
    Package,
    Package2,
    PanelLeft,
    Search,
    Settings,
    ShoppingCart,
    Truck,
    Users2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

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
                        <Tabs defaultValue='week'>
                            <div className='flex items-center'>
                                <TabsList>
                                    <TabsTrigger value='week'>Week</TabsTrigger>
                                    <TabsTrigger value='month'>
                                        Month
                                    </TabsTrigger>
                                    <TabsTrigger value='year'>Year</TabsTrigger>
                                </TabsList>
                                <div className='ml-auto flex items-center gap-2'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant='outline'
                                                size='sm'
                                                className='h-7 gap-1 text-sm'
                                            >
                                                <ListFilter className='h-3.5 w-3.5' />
                                                <span className='sr-only sm:not-sr-only'>
                                                    Filter
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuLabel>
                                                Filter by
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuCheckboxItem checked>
                                                Fulfilled
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem>
                                                Declined
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem>
                                                Refunded
                                            </DropdownMenuCheckboxItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button
                                        size='sm'
                                        variant='outline'
                                        className='h-7 gap-1 text-sm'
                                    >
                                        <File className='h-3.5 w-3.5' />
                                        <span className='sr-only sm:not-sr-only'>
                                            Export
                                        </span>
                                    </Button>
                                </div>
                            </div>
                            <TabsContent value='week'>
                                <Card x-chunk='dashboard-05-chunk-3'>
                                    <CardHeader className='px-7'>
                                        <CardTitle>Orders</CardTitle>
                                        <CardDescription>
                                            Recent orders from your store.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        Customer
                                                    </TableHead>
                                                    <TableHead className='hidden sm:table-cell'>
                                                        Type
                                                    </TableHead>
                                                    <TableHead className='hidden sm:table-cell'>
                                                        Status
                                                    </TableHead>
                                                    <TableHead className='hidden md:table-cell'>
                                                        Date
                                                    </TableHead>
                                                    <TableHead className='text-right'>
                                                        Amount
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow className='bg-accent'>
                                                    <TableCell>
                                                        <div className='font-medium'>
                                                            Liam Johnson
                                                        </div>
                                                        <div className='hidden text-sm text-muted-foreground md:inline'>
                                                            liam@example.com
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='hidden sm:table-cell'>
                                                        Sale
                                                    </TableCell>
                                                    <TableCell className='hidden sm:table-cell'>
                                                        <Badge
                                                            className='text-xs'
                                                            variant='secondary'
                                                        >
                                                            Fulfilled
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className='hidden md:table-cell'>
                                                        2023-06-23
                                                    </TableCell>
                                                    <TableCell className='text-right'>
                                                        $250.00
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <div className='font-medium'>
                                                            Olivia Smith
                                                        </div>
                                                        <div className='hidden text-sm text-muted-foreground md:inline'>
                                                            olivia@example.com
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='hidden sm:table-cell'>
                                                        Refund
                                                    </TableCell>
                                                    <TableCell className='hidden sm:table-cell'>
                                                        <Badge
                                                            className='text-xs'
                                                            variant='outline'
                                                        >
                                                            Declined
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className='hidden md:table-cell'>
                                                        2023-06-24
                                                    </TableCell>
                                                    <TableCell className='text-right'>
                                                        $150.00
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <div className='font-medium'>
                                                            Noah Williams
                                                        </div>
                                                        <div className='hidden text-sm text-muted-foreground md:inline'>
                                                            noah@example.com
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='hidden sm:table-cell'>
                                                        Subscription
                                                    </TableCell>
                                                    <TableCell className='hidden sm:table-cell'>
                                                        <Badge
                                                            className='text-xs'
                                                            variant='secondary'
                                                        >
                                                            Fulfilled
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className='hidden md:table-cell'>
                                                        2023-06-25
                                                    </TableCell>
                                                    <TableCell className='text-right'>
                                                        $350.00
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <div className='font-medium'>
                                                            Emma Brown
                                                        </div>
                                                        <div className='hidden text-sm text-muted-foreground md:inline'>
                                                            emma@example.com
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='hidden sm:table-cell'>
                                                        Sale
                                                    </TableCell>
                                                    <TableCell className='hidden sm:table-cell'>
                                                        <Badge
                                                            className='text-xs'
                                                            variant='secondary'
                                                        >
                                                            Fulfilled
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className='hidden md:table-cell'>
                                                        2023-06-26
                                                    </TableCell>
                                                    <TableCell className='text-right'>
                                                        $450.00
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <div className='font-medium'>
                                                            Liam Johnson
                                                        </div>
                                                        <div className='hidden text-sm text-muted-foreground md:inline'>
                                                            liam@example.com
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='hidden sm:table-cell'>
                                                        Sale
                                                    </TableCell>
                                                    <TableCell className='hidden sm:table-cell'>
                                                        <Badge
                                                            className='text-xs'
                                                            variant='secondary'
                                                        >
                                                            Fulfilled
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className='hidden md:table-cell'>
                                                        2023-06-23
                                                    </TableCell>
                                                    <TableCell className='text-right'>
                                                        $250.00
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <div className='font-medium'>
                                                            Liam Johnson
                                                        </div>
                                                        <div className='hidden text-sm text-muted-foreground md:inline'>
                                                            liam@example.com
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='hidden sm:table-cell'>
                                                        Sale
                                                    </TableCell>
                                                    <TableCell className='hidden sm:table-cell'>
                                                        <Badge
                                                            className='text-xs'
                                                            variant='secondary'
                                                        >
                                                            Fulfilled
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className='hidden md:table-cell'>
                                                        2023-06-23
                                                    </TableCell>
                                                    <TableCell className='text-right'>
                                                        $250.00
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <div className='font-medium'>
                                                            Olivia Smith
                                                        </div>
                                                        <div className='hidden text-sm text-muted-foreground md:inline'>
                                                            olivia@example.com
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='hidden sm:table-cell'>
                                                        Refund
                                                    </TableCell>
                                                    <TableCell className='hidden sm:table-cell'>
                                                        <Badge
                                                            className='text-xs'
                                                            variant='outline'
                                                        >
                                                            Declined
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className='hidden md:table-cell'>
                                                        2023-06-24
                                                    </TableCell>
                                                    <TableCell className='text-right'>
                                                        $150.00
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <div className='font-medium'>
                                                            Emma Brown
                                                        </div>
                                                        <div className='hidden text-sm text-muted-foreground md:inline'>
                                                            emma@example.com
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='hidden sm:table-cell'>
                                                        Sale
                                                    </TableCell>
                                                    <TableCell className='hidden sm:table-cell'>
                                                        <Badge
                                                            className='text-xs'
                                                            variant='secondary'
                                                        >
                                                            Fulfilled
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className='hidden md:table-cell'>
                                                        2023-06-26
                                                    </TableCell>
                                                    <TableCell className='text-right'>
                                                        $450.00
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </div>
    );
}
