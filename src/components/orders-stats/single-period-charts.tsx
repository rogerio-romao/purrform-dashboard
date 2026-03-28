import ComparisonBarCharts from './comparison-bar-charts';

type PeriodData = {
    sales_value: number;
    sales_nr: number;
    loyalty_value: number;
    loyalty_nr: number;
    coupons_value: number;
    coupons_nr: number;
    label: string;
};

type SinglePeriodChartsProps = {
    periodData: PeriodData | null;
};

export default function SinglePeriodCharts(
    { periodData }: SinglePeriodChartsProps = {
        periodData: null,
    },
) {
    if (!periodData) {
        return null;
    }

    return <ComparisonBarCharts chartData={[periodData!]} />;
}
