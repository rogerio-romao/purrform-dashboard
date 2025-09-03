import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { BACKEND_BASE_URL } from '@/app/lib/definitions';
import type { CsvDataStats } from '@/app/lib/types';
import { convertToCsv, downloadCsv } from '@/app/lib/utils';

export default function CsvReports() {
    const { toast } = useToast();

    async function handleDownloadReport(
        period: 'daily' | 'weekly' | 'monthly' | 'yearly'
    ) {
        const response = await fetch(
            `${BACKEND_BASE_URL}/getDataForCsvStatsReport?period=${period}`
        );

            });
            return;
        }

        const data = (await response.json()) as CsvDataStats[];

        if (data) {
            // convert this into a csv
            const csv = convertToCsv(data);
            downloadCsv(csv, `sales_stats_report_${period}.csv`);
        }
    }

    return (
        <Card>
            <CardHeader className='px-7'>
                <CardTitle>Download CSV Reports</CardTitle>
                <CardDescription className='flex items-center gap-2'>
                    Download a detailed CSV report of orders, sales, loyalty
                    points and coupons. Choose between daily, weekly, monthly
                    and yearly reports.
                </CardDescription>
                <CardContent className='py-6 flex flex-wrap gap-6'>
                    <Button
                        variant='outline'
                        onClick={() => handleDownloadReport('daily')}
                    >
                        Daily Report
                    </Button>
                    <Button
                        variant='outline'
                        onClick={() => handleDownloadReport('weekly')}
                    >
                        Weekly Report
                    </Button>
                    <Button
                        variant='outline'
                        onClick={() => handleDownloadReport('monthly')}
                    >
                        Monthly Report
                    </Button>
                    <Button
                        variant='outline'
                        onClick={() => handleDownloadReport('yearly')}
                    >
                        Yearly Report
                    </Button>
                </CardContent>
            </CardHeader>
        </Card>
    );
}
