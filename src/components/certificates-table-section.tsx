import { Button } from './ui/button';
import { CardContent, CardHeader, CardTitle } from './ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table';

import type { BreederCertificate } from '@/app/lib/types';

interface CertificatesTableSectionProps {
    certificates: BreederCertificate[];
    type: 'pending' | 'approved' | 'rejected';
}

export default function CertificatesTableSection({
    certificates,
    type,
}: CertificatesTableSectionProps) {
    const bgClasses = {
        pending: '',
        approved: 'bg-green-100/15',
        rejected: 'bg-red-100/15',
    };
    const titles = {
        pending: 'Certificates for Approval',
        approved: 'Approved Certificates',
        rejected: 'Rejected Certificates',
    };
    return (
        <CardHeader className={'pb-3 ' + bgClasses[type]}>
            <CardTitle className='text-lg'>{titles[type]}</CardTitle>
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
                                {type === 'pending' && (
                                    <TableHead className='text-right'>
                                        Actions
                                    </TableHead>
                                )}
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
                                            variant={'secondary'}
                                        >
                                            Download
                                        </Button>
                                        <span className='truncate hidden lg:inline text-xs'>
                                            {certificate.upload_path}
                                        </span>
                                    </TableCell>
                                    {type === 'pending' && (
                                        <TableCell>
                                            <div className='flex justify-end gap-2'>
                                                <Button>Approve</Button>
                                                <Button variant='destructive'>
                                                    Reject
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </CardHeader>
    );
}
