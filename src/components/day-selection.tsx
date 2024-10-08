type DaySelectionProps = {
    otherPeriod: string;
    handleSelectPeriod: (value: string) => void;
};

export default function DaySelection({
    otherPeriod,
    handleSelectPeriod,
}: DaySelectionProps) {
    return <div>Day Selection</div>;
}
