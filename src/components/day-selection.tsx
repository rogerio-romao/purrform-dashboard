import { useEffect, useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';

type DaySelectionProps = {
    otherPeriod: string;
    handleSelectPeriod: (value: string) => void;
};

export default function DaySelection({
    otherPeriod,
    handleSelectPeriod,
}: DaySelectionProps) {
    const startDate = useMemo(() => new Date(2022, 7, 22), []);
    const endDate = useMemo(() => new Date().getTime() + 86400000, []);

    const [disabledDays, setDisabledDays] = useState([
        { from: new Date(0), to: startDate }, // Disable all dates before startDate
        { from: new Date(endDate), to: new Date(2100, 0, 1) }, // Disable all dates after today
    ]);

    useEffect(() => {
        if (!otherPeriod) {
            return;
        }
        const [day, month, year] = otherPeriod.split('/').map(Number);

        setDisabledDays([
            { from: new Date(0), to: startDate }, // Disable all dates before startDate
            { from: new Date(endDate), to: new Date(2100, 0, 1) }, // Disable all dates after today
            {
                from: new Date(year, month - 1, day),
                to: new Date(year, month - 1, day),
            },
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otherPeriod]);

    return (
        <div className='flex flex-col justify-center gap-2'>
            <p>Day: </p>
            <DayPicker
                showOutsideDays={true}
                mode='single'
                disabled={disabledDays}
                onDayClick={(day) => {
                    handleSelectPeriod(day.toLocaleDateString());
                }}
                fixedWeeks
                captionLayout='dropdown'
                defaultMonth={new Date()}
                startMonth={new Date(2022, 7)}
                endMonth={new Date()}
                className='rounded-md border'
            />
        </div>
    );
}
