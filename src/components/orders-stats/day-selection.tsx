import { Checkbox } from '@/components/ui/checkbox';
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
    const endDate = useMemo(() => new Date().getTime(), []);

    const [multiple, setMultiple] = useState(false);
    const [disabledDays, setDisabledDays] = useState([
        { from: new Date(0), to: startDate }, // Disable all dates before startDate
        { from: new Date(endDate), to: new Date(2100, 0, 1) }, // Disable all dates after today
    ]);

    useEffect(() => {
        if (!otherPeriod || multiple) {
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
            <p className='flex items-center justify-between'>
                <span>Day{multiple ? 's' : ''}: </span>
                <span className='inline-flex items-center gap-2'>
                    <label
                        htmlFor='multiple'
                        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                        Multiple
                    </label>
                    <Checkbox
                        id='multiple'
                        checked={multiple}
                        onCheckedChange={() => setMultiple((prev) => !prev)}
                    />
                </span>
            </p>
            {multiple ? (
                <MultipleDays
                    disabledDays={disabledDays}
                    handleSelectPeriod={handleSelectPeriod}
                />
            ) : (
                <SingleDay
                    disabledDays={disabledDays}
                    handleSelectPeriod={handleSelectPeriod}
                />
            )}
        </div>
    );
}

type SingleDayProps = {
    disabledDays: { from: Date; to: Date }[];
    handleSelectPeriod: (value: string) => void;
};

function SingleDay({ disabledDays, handleSelectPeriod }: SingleDayProps) {
    return (
        <DayPicker
            showOutsideDays={true}
            mode='single'
            disabled={disabledDays}
            weekStartsOn={1}
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
    );
}

type MultipleDaysProps = {
    disabledDays: { from: Date; to: Date }[];
    handleSelectPeriod: (value: string) => void;
};

function MultipleDays({ disabledDays, handleSelectPeriod }: MultipleDaysProps) {
    const [selectedDays, setSelectedDays] = useState<Date[]>([]);

    useEffect(() => {
        if (!selectedDays.length) {
            return;
        }
        handleSelectPeriod(
            selectedDays.map((day) => day.toLocaleDateString()).join(', ')
        );
    }, [selectedDays, handleSelectPeriod]);

    return (
        <DayPicker
            showOutsideDays={true}
            mode='multiple'
            disabled={disabledDays}
            weekStartsOn={1}
            onDayClick={(day, modifiers) => {
                if (modifiers.selected) {
                    setSelectedDays((prev) =>
                        prev.filter(
                            (d) =>
                                d.toLocaleDateString() !==
                                day.toLocaleDateString()
                        )
                    );
                    return;
                }
                setSelectedDays((prev) => [...prev, day]);
            }}
            fixedWeeks
            captionLayout='dropdown'
            defaultMonth={new Date()}
            startMonth={new Date(2022, 7)}
            endMonth={new Date()}
            modifiers={{
                selected: selectedDays,
            }}
            className='rounded-md border'
        />
    );
}
