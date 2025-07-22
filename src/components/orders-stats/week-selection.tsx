'use client';
import { endOfWeek, startOfWeek } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { DateRange, DayPicker, rangeIncludesDate } from 'react-day-picker';

type WeekSelectionProps = {
    startYear?: number;
    startMonth?: number;
    startDay?: number;
    otherPeriod: string;
    handleSelectPeriod: (value: string) => void;
};

export default function WeekSelection({
    startYear = 2022,
    startMonth = 7,
    startDay = 21,
    otherPeriod,
    handleSelectPeriod,
}: WeekSelectionProps) {
    const [selectedWeek, setSelectedWeek] = useState<DateRange | undefined>();

    const startDate = new Date(startYear, startMonth, startDay);
    const endDate = new Date(); // Just use today's date
    endDate.setDate(endDate.getDate() + 1); // Add one day properly

    const [disabledDays, setDisabledDays] = useState([
        { from: new Date(0), to: startDate },
        { from: endDate, to: new Date(2100, 0, 1) },
    ]);

    useEffect(() => {
        if (!otherPeriod) {
            return;
        }
        const [from, to] = otherPeriod.split(' - ');
        const fromParts = from.split('/');
        const toParts = to.split('/');
        const fromYear = parseInt(fromParts[2], 10);
        const fromMonth = parseInt(fromParts[1], 10) - 1;
        const fromDay = parseInt(fromParts[0], 10);
        const toYear = parseInt(toParts[2], 10);
        const toMonth = parseInt(toParts[1], 10) - 1;
        const toDay = parseInt(toParts[0], 10);
        setDisabledDays([
            { from: new Date(0), to: startDate }, // Disable all dates before startDate
            { from: new Date(endDate), to: new Date(2100, 0, 1) }, // Disable all dates after today
            {
                from: new Date(fromYear, fromMonth, fromDay),
                to: new Date(toYear, toMonth, toDay),
            },
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otherPeriod]);

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
                disabled={disabledDays}
                fixedWeeks
                weekStartsOn={1}
                captionLayout='dropdown'
                defaultMonth={new Date()}
                startMonth={new Date(startYear, startMonth)}
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
                        from: startOfWeek(day, { weekStartsOn: 1 }),
                        to: endOfWeek(day, { weekStartsOn: 1 }),
                    });
                }}
                className='rounded-md border'
            />
        </div>
    );
}
