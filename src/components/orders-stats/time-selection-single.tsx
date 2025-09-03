import { CardContent } from '@/components/ui/card';
import DaySelection from './day-selection';
import MonthSelection from './month-selection';
import WeekSelection from './week-selection';
import YearSelection from './year-selection';

type TimeSelectionSingleProps = {
    minYearForOrders?: number;
    minMonthForOrdersOnFirstYear?: number;
    startDay?: number;
    selectedPeriodType: string;
    selectedPeriod: string;
    handleSelectPeriod: (value: string) => void;
};

export default function TimeSelectionSingle({
    minYearForOrders = 2022,
    minMonthForOrdersOnFirstYear = 7,
    startDay = 21,
    selectedPeriodType,
    selectedPeriod,
    handleSelectPeriod,
}: TimeSelectionSingleProps) {
    if (selectedPeriodType === 'Year') {
        return (
            <CardContent className='grid grid-cols-2'>
                <YearSelection
                    minYearForOrders={minYearForOrders}
                    handleSelectPeriod={handleSelectPeriod}
                    selectedPeriod={selectedPeriod}
                />
            </CardContent>
        );
    }

    if (selectedPeriodType === 'Month') {
        return (
            <CardContent className='grid grid-cols-2'>
                <MonthSelection
                    minYearForOrders={minYearForOrders}
                    minMonthForOrdersOnFirstYear={minMonthForOrdersOnFirstYear}
                    handleSelectPeriod={handleSelectPeriod}
                    selectedPeriod={selectedPeriod}
                />
            </CardContent>
        );
    }

    if (selectedPeriodType === 'Week') {
        return (
            <CardContent className='grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-12'>
                <WeekSelection
                    startYear={minYearForOrders}
                    startMonth={minMonthForOrdersOnFirstYear}
                    startDay={startDay}
                    handleSelectPeriod={handleSelectPeriod}
                />
            </CardContent>
        );
    }

    if (selectedPeriodType === 'Day') {
        return (
            <CardContent className='grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-12'>
                <DaySelection
                    startYear={minYearForOrders}
                    startMonth={minMonthForOrdersOnFirstYear}
                    startDay={startDay}
                    handleSelectPeriod={handleSelectPeriod}
                />
            </CardContent>
        );
    }
    return null;
}
