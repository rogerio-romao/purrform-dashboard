import { CardContent } from './ui/card';

import MonthSelection from './month-selection';
import YearSelection from './year-selection';

type TimeSelectionProps = {
    selectedPeriod: string;
    selectedPeriod1: string;
    selectedPeriod2: string;
    handleSelectPeriod1: (value: string) => void;
    handleSelectPeriod2: (value: string) => void;
};

export default function TimeSelection({
    selectedPeriod,
    selectedPeriod1,
    selectedPeriod2,
    handleSelectPeriod1,
    handleSelectPeriod2,
}: TimeSelectionProps) {
    if (selectedPeriod === 'Year') {
        return (
            <CardContent className='grid grid-cols-2'>
                <YearSelection
                    handleSelectPeriod={handleSelectPeriod1}
                    selectedPeriod={selectedPeriod1}
                    otherPeriod={selectedPeriod2}
                />
                <YearSelection
                    handleSelectPeriod={handleSelectPeriod2}
                    selectedPeriod={selectedPeriod2}
                    otherPeriod={selectedPeriod1}
                />
            </CardContent>
        );
    }

    if (selectedPeriod === 'Month') {
        return (
            <CardContent className='grid grid-cols-2'>
                <MonthSelection
                    handleSelectPeriod={handleSelectPeriod1}
                    selectedPeriod={selectedPeriod1}
                    otherPeriod={selectedPeriod2}
                />
                <MonthSelection
                    handleSelectPeriod={handleSelectPeriod2}
                    selectedPeriod={selectedPeriod2}
                    otherPeriod={selectedPeriod1}
                />
            </CardContent>
        );
    }
    return null;
}
