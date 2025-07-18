import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type YearSelectionProps = {
    minYearForOrders?: number;
    selectedPeriod: string;
    otherPeriod: string;
    handleSelectPeriod: (value: string) => void;
};

export default function YearSelection({
    minYearForOrders = 2022,
    handleSelectPeriod,
    selectedPeriod,
    otherPeriod,
}: YearSelectionProps) {
    const maxYearForOrders = new Date().getFullYear();
    const yearsForOrders = Array.from(
        { length: maxYearForOrders - minYearForOrders + 1 },
        (_, i) => String(minYearForOrders + i)
    );

    return (
        <div className='flex items-center gap-2'>
            Year:{' '}
            <Select value={selectedPeriod} onValueChange={handleSelectPeriod}>
                <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Pick an option' />
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
