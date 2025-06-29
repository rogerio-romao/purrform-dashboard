import { Dispatch, SetStateAction } from 'react';

import acceptBreederCertificate from '@/app/actions/acceptBreederCertificate';
import rejectBreederCertificate from '@/app/actions/rejectBreederCertificate';
import supabase from '@/app/lib/supabase';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import type { BreederCertificate } from '@/app/lib/types';

interface CertificatesTableSectionProps {
    setData?: Dispatch<SetStateAction<BreederCertificate[]>>;
    certificates: BreederCertificate[];
    type: 'pending' | 'approved' | 'rejected';
}

export default function CertificatesTableSection({
    setData,
    certificates,
    type,
}: CertificatesTableSectionProps) {
    const titles = {
        pending: 'Certificates for Approval',
        approved: 'Approved Certificates',
        rejected: 'Rejected Certificates',
    };

    const { toast } = useToast();

    async function handleAcceptCertificate(id: number, email: string) {
        const result = await acceptBreederCertificate(id, email);

        if (!result.ok) {
            toast({
                title: 'Error',
                description: 'Failed to accept certificate. Please try again.',
                variant: 'destructive',
            });

            return;
        }

        toast({
            title: 'Success',
            description: 'Certificate accepted successfully.',
            variant: 'default',
        });

        if (setData) {
            setData((prevData) => {
                const certificateIndex = prevData.findIndex(
                    (certificate) => certificate.id === id
                );

                if (certificateIndex === -1) {
                    return prevData;
                }

                const updatedData = [...prevData];
                updatedData[certificateIndex].status = 'approved';

                return updatedData;
            });
        }
    }

    async function handleRejectCertificate(id: number) {
        const result = await rejectBreederCertificate(id);

        if (!result.ok) {
            toast({
                title: 'Error',
                description: 'Failed to reject certificate. Please try again.',
                variant: 'destructive',
            });

            return;
        }

        toast({
            title: 'Success',
            description: 'Certificate rejected successfully.',
            variant: 'default',
        });

        if (setData) {
            setData((prevData) => {
                const certificateIndex = prevData.findIndex(
                    (certificate) => certificate.id === id
                );

                if (certificateIndex === -1) {
                    return prevData;
                }

                const updatedData = [...prevData];
                updatedData[certificateIndex].status = 'rejected';

                return updatedData;
            });
        }
    }

    async function handleDownloadCertificate(uploadPath: string) {
        const { data, error } = await supabase.storage
            .from('breeder-certificates')
            .download(uploadPath);

        if (error) {
            console.error('Error downloading file: ', error.message);
            toast({
                title: 'Error',
                description:
                    'Failed to download certificate. Please try again.',
                variant: 'destructive',
            });
            return;
        }

        const url = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', uploadPath);
        document.body.appendChild(link);
        link.click();

        URL.revokeObjectURL(url);
        document.body.removeChild(link);

        toast({
            title: 'Success',
            description: 'Certificate downloaded successfully.',
            variant: 'default',
        });

        return;
    }

    return (
        <CardHeader className='pb-3'>
            <CardTitle className='text-base font-semibold mb-4'>
                {titles[type]}
            </CardTitle>
            <CardContent>
                {certificates.length === 0 ? (
                    <div className='text-muted-foreground mt-2'>
                        No {type} certificates to display.
                    </div>
                ) : (
                    <Table className='rounded'>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-1/4 min-w-72'>
                                    Breeder Email
                                </TableHead>
                                <TableHead>Certificate</TableHead>

                                <TableHead className='text-right'>
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {certificates.map((certificate) => (
                                <TableRow key={certificate.id}>
                                    <TableCell className='truncate w-1/4 min-w-72'>
                                        {certificate.breeder_email}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            className='mr-4'
                                            variant={'outline'}
                                            onClick={() =>
                                                handleDownloadCertificate(
                                                    certificate.upload_path
                                                )
                                            }
                                        >
                                            Download
                                        </Button>
                                        <span className='truncate hidden lg:inline text-xs'>
                                            {certificate.upload_path}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex justify-end gap-2'>
                                            {type === 'pending' && (
                                                <>
                                                    <Button
                                                        onClick={() => {
                                                            handleAcceptCertificate(
                                                                certificate.id,
                                                                certificate.breeder_email
                                                            );
                                                        }}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant='destructive'
                                                        onClick={() =>
                                                            handleRejectCertificate(
                                                                certificate.id
                                                            )
                                                        }
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            {type === 'rejected' && (
                                                <Button
                                                    asChild
                                                    variant='outline'
                                                >
                                                    <a
                                                        href={`mailto:${certificate.breeder_email}?subject=Your%20certificate%20was%20not%20approved`}
                                                    >
                                                        Email the customer
                                                    </a>
                                                </Button>
                                            )}
                                            {type === 'approved' && (
                                                <span>No action required.</span>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </CardHeader>
    );
}
