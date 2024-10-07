import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const minYearForOrders = 2022;
const maxYearForOrders = new Date().getFullYear();
const yearsForOrders = Array.from(
    { length: maxYearForOrders - minYearForOrders + 1 },
    (_, i) => String(minYearForOrders + i)
);

type YearSelectionProps = {
    selectedPeriod: string;
    otherPeriod: string;
    handleSelectPeriod: (value: string) => void;
};

export default function YearSelection({
    handleSelectPeriod,
    selectedPeriod,
    otherPeriod,
}: YearSelectionProps) {
    return (
        <div className='flex items-center gap-2'>
            Year:{' '}
            <Select value={selectedPeriod} onValueChange={handleSelectPeriod}>
                <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Year' />
                </SelectTrigger>
                <SelectContent>
                    {yearsForOrders
                        .filter((y) => y !== otherPeriod)
                        .map((year) => (
                            <SelectItem key={year} value={year}>
                                {year}
                            </SelectItem>
                        ))}
                </SelectContent>
            </Select>
        </div>
    );
}
