'use client';

import { useEffect, useState } from 'react';

import CertificatesTableSection from '@/components/breeder-certificates/certificates-table-section';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
                'https://purrform-apps-027e.onrender.com/getBreederCertificates'
            );
            const data = (await response.json()) as BreederCertificate[];

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
                <div className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2'>
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
                            <CertificatesTableSection
                                setData={setData}
                                certificates={pendingCertificates}
                                type='pending'
                            />
                            <Separator />
                            <CertificatesTableSection
                                certificates={rejectedCertificates}
                                type='rejected'
                            />
                            <Separator />
                            <CertificatesTableSection
                                certificates={approvedCertificates}
                                type='approved'
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
