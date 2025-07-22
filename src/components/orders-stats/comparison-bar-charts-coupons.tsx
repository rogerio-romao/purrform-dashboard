import {
    default as ComparisonBarCharCoupons,
    default as ComparisonBarChartCoupons,
} from './comparison-bar-chart-coupons';

type ComparisonBarChartCouponsProps = {
    coupon_prefix: string;
    coupon_value?: number;
    coupon_nr?: number;
    label: string;
}[];

export default function ComparisonBarChartsCoupons({
    chartData,
}: {
    chartData: ComparisonBarChartCouponsProps;
}) {
    if (!chartData) {
        return null;
    }

    return (
        <section className='grid grid-rows-2 lg:grid-cols-2 gap-12 p-6'>
            <ComparisonBarChartCoupons
                type='coupon_value'
                chartData={chartData}
            />
            <ComparisonBarChartCoupons type='coupon_nr' chartData={chartData} />
        </section>
    );
}
