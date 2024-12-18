'use client';

import { useEffect, useState } from 'react';

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

import type { BreederCertificate } from '@/app/lib/types';

export default function BreederCertificates() {
    const [data, setData] = useState<BreederCertificate[]>([]);
    const [pendingCertificates, setPendingCertificates] = useState<
        BreederCertificate[]
    >([]);
    const [approvedCertificates, setApprovedCertificates] = useState<
        BreederCertificate[]
    >([]);
    const [rejectedCertificates, setRejectedCertificates] = useState<
        BreederCertificate[]
    >([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                'https://4268-2a01-4b00-805d-b800-adf5-37f9-a9f5-e235.ngrok-free.app/getBreederCertificates'
            );
            const data = (await response.json()) as BreederCertificate[];
            console.log(data);

            setData(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const pending = data.filter(
            (certificate) => certificate.status === 'pending'
        );
        setPendingCertificates(pending);
        const approved = data.filter(
            (certificate) => certificate.status === 'approved'
        );
        setApprovedCertificates(approved);
        const rejected = data.filter(
            (certificate) => certificate.status === 'rejected'
        );
        setRejectedCertificates(rejected);
    }, [data]);

    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40 mt-4'>
            <div className='flex flex-col sm:gap-4 sm:py-4 '>
                <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2'>
                    <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
                        <Card className='sm:col-span-2'>
                            <CardHeader className='pb-3'>
                                <CardTitle>Breeder Certificates</CardTitle>
                                <CardDescription className='text-balance leading-relaxed'>
                                    View and manage the list of breeder
                                    certificates. Approve or reject new
                                    certificates, and view previously approved
                                    or rejected certificates.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card
                            className='sm:col-span-2'
                            x-chunk='dashboard-05-chunk-0'
                        >
                            <CardHeader className='pb-3'>
                                <CardTitle className='text-lg'>
                                    Certificates for Approval
                                </CardTitle>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    Breeder Email
                                                </TableHead>
                                                <TableHead>
                                                    Certificate
                                                </TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pendingCertificates.map(
                                                (certificate) => (
                                                    <TableRow
                                                        key={certificate.id}
                                                    >
                                                        <TableCell>
                                                            {
                                                                certificate.breeder_email
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                certificate.upload_path
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className='flex items-center gap-2'>
                                                                <button>
                                                                    Approve
                                                                </button>
                                                                <button>
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </CardHeader>
                            <CardHeader className='pb-3'>
                                <CardTitle className='text-lg'>
                                    Approved Certificates
                                </CardTitle>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    Breeder Email
                                                </TableHead>
                                                <TableHead>
                                                    Certificate
                                                </TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                    </Table>
                                </CardContent>
                            </CardHeader>
                            <CardHeader className='pb-3'>
                                <CardTitle className='text-lg'>
                                    Rejected Certificates
                                </CardTitle>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    Breeder Email
                                                </TableHead>
                                                <TableHead>
                                                    Certificate
                                                </TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
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
