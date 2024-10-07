import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const minYearForOrders = 2022;
const maxYearForOrders = new Date().getFullYear();
const yearsForOrders = Array.from(
    { length: maxYearForOrders - minYearForOrders + 1 },
    (_, i) => String(minYearForOrders + i)
);

const minMonthForOrdersOnFirstYear = 7; // August 2022
const maxMonthForOrdersOnLastYear = new Date().getMonth(); // current month

type MonthSelectionProps = {
    selectedPeriod: string;
    otherPeriod: string;
    handleSelectPeriod: (value: string) => void;
};

export default function MonthSelection({
    handleSelectPeriod,
    selectedPeriod,
    otherPeriod,
}: MonthSelectionProps) {
    return (
        <div className='flex items-center gap-2'>
            Month:{' '}
            <Select value={selectedPeriod} onValueChange={handleSelectPeriod}>
                <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Pick an option' />
                </SelectTrigger>
                <SelectContent>
                    {yearsForOrders.map((year) => (
                        <SelectGroup key={year}>
                            <SelectLabel>{year}</SelectLabel>
                            {months
                                .filter((m) => `${m}-${year}` !== otherPeriod)
                                .map((month, index) => {
                                    if (
                                        (year === yearsForOrders[0] &&
                                            index <
                                                minMonthForOrdersOnFirstYear) ||
                                        (year ===
                                            yearsForOrders[
                                                yearsForOrders.length - 1
                                            ] &&
                                            index > maxMonthForOrdersOnLastYear)
                                    ) {
                                        return null;
                                    }
                                    return (
                                        <SelectItem
                                            key={month}
                                            value={`${month}-${year}`}
                                        >
                                            {month}{' '}
                                            <span className='text-xs text-muted-foreground'>
                                                {year}
                                            </span>
                                        </SelectItem>
                                    );
                                })}
                        </SelectGroup>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
