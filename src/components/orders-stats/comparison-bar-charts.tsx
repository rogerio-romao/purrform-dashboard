import ComparisonBarChart from './comparison-bar-chart';

type ComparisonBarChartProps = {
    sales_value: number;
    sales_nr: number;
    loyalty_value: number;
    loyalty_nr: number;
    label: string;
}[];

export default function ComparisonBarCharts({
    chartData,
}: {
    chartData: ComparisonBarChartProps;
}) {
    if (!chartData) {
        return null;
    }

    return (
        <section className='grid grid-rows-2 lg:grid-cols-2 gap-12 p-6'>
            <ComparisonBarChart type='sales_value' chartData={chartData} />
            <ComparisonBarChart type='sales_nr' chartData={chartData} />
            <ComparisonBarChart type='loyalty_value' chartData={chartData} />
            <ComparisonBarChart type='loyalty_nr' chartData={chartData} />
        </section>
    );
}
