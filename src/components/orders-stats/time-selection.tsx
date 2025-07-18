import { CardContent } from '@/components/ui/card';
import DaySelection from './day-selection';
import MonthSelection from './month-selection';
import WeekSelection from './week-selection';
import YearSelection from './year-selection';

type TimeSelectionProps = {
    minYearForOrders?: number;
    minMonthForOrdersOnFirstYear?: number;
    startDay?: number;
    selectedPeriodType: string;
    selectedPeriod1: string;
    selectedPeriod2: string;
    handleSelectPeriod1: (value: string) => void;
    handleSelectPeriod2: (value: string) => void;
};

export default function TimeSelection({
    minYearForOrders = 2022,
    minMonthForOrdersOnFirstYear = 7,
    startDay = 21,
    selectedPeriodType,
    selectedPeriod1,
    selectedPeriod2,
    handleSelectPeriod1,
    handleSelectPeriod2,
}: TimeSelectionProps) {
    if (selectedPeriodType === 'Year') {
        return (
            <CardContent className='grid grid-cols-2'>
                <YearSelection
                    minYearForOrders={minYearForOrders}
                    handleSelectPeriod={handleSelectPeriod1}
                    selectedPeriod={selectedPeriod1}
                    otherPeriod={selectedPeriod2}
                />
                <YearSelection
                    minYearForOrders={minYearForOrders}
                    handleSelectPeriod={handleSelectPeriod2}
                    selectedPeriod={selectedPeriod2}
                    otherPeriod={selectedPeriod1}
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
                    handleSelectPeriod={handleSelectPeriod1}
                    selectedPeriod={selectedPeriod1}
                    otherPeriod={selectedPeriod2}
                />
                <MonthSelection
                    minYearForOrders={minYearForOrders}
                    minMonthForOrdersOnFirstYear={minMonthForOrdersOnFirstYear}
                    handleSelectPeriod={handleSelectPeriod2}
                    selectedPeriod={selectedPeriod2}
                    otherPeriod={selectedPeriod1}
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
                    handleSelectPeriod={handleSelectPeriod1}
                    otherPeriod={selectedPeriod2}
                />
                <WeekSelection
                    startYear={minYearForOrders}
                    startMonth={minMonthForOrdersOnFirstYear}
                    startDay={startDay}
                    handleSelectPeriod={handleSelectPeriod2}
                    otherPeriod={selectedPeriod1}
                />
            </CardContent>
        );
    }

    if (selectedPeriodType === 'Day') {
        return (
            <CardContent className='grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-12'>
                <DaySelection
                    handleSelectPeriod={handleSelectPeriod1}
                    otherPeriod={selectedPeriod2}
                />
                <DaySelection
                    handleSelectPeriod={handleSelectPeriod2}
                    otherPeriod={selectedPeriod1}
                />
            </CardContent>
        );
    }
    return null;
}
