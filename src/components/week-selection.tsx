'use client';
import { endOfWeek, startOfWeek } from 'date-fns';
import { useEffect, useState } from 'react';
import { DateRange, DayPicker, rangeIncludesDate } from 'react-day-picker';

type WeekSelectionProps = {
    otherPeriod: string;
    handleSelectPeriod: (value: string) => void;
};

export default function WeekSelection({
    otherPeriod,
    handleSelectPeriod,
}: WeekSelectionProps) {
    const [selectedWeek, setSelectedWeek] = useState<DateRange | undefined>();

    useEffect(() => {
        if (!selectedWeek) {
            return;
        }
        handleSelectPeriod(
            `${selectedWeek.from?.toLocaleDateString()} - ${selectedWeek.to?.toLocaleDateString()}`
        );
    }, [selectedWeek, handleSelectPeriod]);

    return (
        <div className='flex flex-col justify-center gap-2'>
            <p>Week: </p>
            <DayPicker
                showOutsideDays={true}
                disabled={{ after: new Date(), before: new Date(2022, 7, 22) }}
                fixedWeeks
                captionLayout='dropdown'
                defaultMonth={new Date()}
                startMonth={new Date(2022, 7)}
                endMonth={new Date()}
                modifiers={{
                    selected: selectedWeek,
                    range_start: selectedWeek?.from,
                    range_end: selectedWeek?.to,
                    range_middle: (date: Date) =>
                        selectedWeek
                            ? rangeIncludesDate(selectedWeek, date, true)
                            : false,
                }}
                onDayClick={(day, modifiers) => {
                    if (modifiers.selected) {
                        setSelectedWeek(undefined); // clear the selection if the day is already selected
                        return;
                    }
                    setSelectedWeek({
                        from: startOfWeek(day),
                        to: endOfWeek(day),
                    });
                }}
                className='rounded-md border'
            />
        </div>
    );
}
