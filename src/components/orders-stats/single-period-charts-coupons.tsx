import ComparisonBarChartsCoupons from './comparison-bar-charts-coupons';

type CouponPeriodData = {
    coupon_prefix: string;
    coupon_value?: number;
    coupon_nr?: number;
    label: string;
};

type SinglePeriodChartsCouponsProps = {
    periodData: CouponPeriodData | null;
};

export default function SinglePeriodChartsCoupons(
    { periodData }: SinglePeriodChartsCouponsProps = {
        periodData: null,
    }
) {
    if (!periodData) {
        return null;
    }

    return <ComparisonBarChartsCoupons chartData={[periodData!]} />;
}
