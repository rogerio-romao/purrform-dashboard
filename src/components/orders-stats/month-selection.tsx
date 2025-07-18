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

type MonthSelectionProps = {
    minYearForOrders?: number;
    minMonthForOrdersOnFirstYear?: number;
    selectedPeriod: string;
    otherPeriod: string;
    handleSelectPeriod: (value: string) => void;
};

export default function MonthSelection({
    minYearForOrders = 2022,
    minMonthForOrdersOnFirstYear = 7,
    handleSelectPeriod,
    selectedPeriod,
    otherPeriod,
}: MonthSelectionProps) {
    const maxYearForOrders = new Date().getFullYear();
    const yearsForOrders = Array.from(
        { length: maxYearForOrders - minYearForOrders + 1 },
        (_, i) => String(minYearForOrders + i)
    );

    const maxMonthForOrdersOnLastYear = new Date().getMonth(); // current month

    return (
        <div className='flex items-center gap-2'>
            Month:{' '}
            <Select value={selectedPeriod} onValueChange={handleSelectPeriod}>
                <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Pick an option' />
                </SelectTrigger>
                <SelectContent>
                    {yearsForOrders.toReversed().map((year) => (
                        <SelectGroup key={year}>
                            <SelectLabel>{year}</SelectLabel>
                            {months
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
                                })
                                .toReversed()}
                        </SelectGroup>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
