import { UseFormReturn } from 'react-hook-form';

export interface TraceabilityIngredientsFeature {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
    properties: {
        id: number;
        title: string;
        location: string;
    };
}
export interface TraceabilityIngredientsGeodata {
    type: 'FeatureCollection';
    features: TraceabilityIngredientsFeature[];
}

export type SetIngredients = React.Dispatch<
    React.SetStateAction<TraceabilityIngredientsFeature[]>
>;

export interface IngredientsProps {
    ingredients: TraceabilityIngredientsFeature[];
    setIngredients: SetIngredients;
    handleGetCoordinates: (
        location: string,
        form: UseFormReturn<
            {
                title: string;
                location: string;
                longitude: number;
                latitude: number;
            },
            any,
            undefined
        >
    ) => void;
}

export interface BreederCertificate {
    id: number;
    breeder_email: string;
    upload_path: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface BcProduct {
    id: number;
    name: string;
    price: string;
    sku: string;
    custom_url: {
        url: string;
    };
    categories: number[];
    images: Array<{
        is_thumbnail: boolean;
        sort_order: number;
        url_standard: string;
        image_file: string;
    }>;
    custom_fields: Array<{ name: string; value: string }>;
}

export interface RecallProductsResponse {
    productName: string;
    customerEmails: string[];
    totalOrders: number;
    orderNumbers: number[];
}

export interface BcCustomer {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    company: string;
}

export interface CreditSystemTrader {
    id: number;
    bc_customer_id: number;
    bc_customer_email: string;
    bc_customer_company: string;
    bc_customer_first_name: string;
    bc_customer_last_name: string;
    credit_ceiling: number;
    current_balance: number;
    has_overdue: boolean;
    is_tnc_seller: boolean;
    tier: '1' | '2';
    created_at: string;
    invoice_email: string | null;
    updated_at: string;
}

export interface CreditSystemOrder {
    id: number;
    order_nr: number;
    order_date: string;
    payment_due: string;
    order_total: number;
    order_status: 'pending' | 'paid' | 'overdue' | 'other';
    order_notes?: string;
    ordered_for?: string;
    trader_id: number;
}

export interface CouponTypeMonthBreakdown {
    id: number;
    coupon_prefix: string;
    coupon_value: number;
    coupon_nr: number;
    month: string;
}

export type SupabaseError = { error: string };

export type OkOrErrorResponse = { ok: true } | { ok: false; error: string };

export type UserRole = 'admin' | 'bookkeeper';

export interface NavItem {
    to: string;
    title: string;
    icon: React.ElementType;
    allowedRoles: UserRole[];
}

export interface CouponType {
    id: number;
    name: string;
    prefix: string;
    description?: string;
    details?: string;
}

export type TransformedDataForCouponSemesterGraph = {
    month: string;
    [key: string]: number | string;
};

export interface TescoOrder {
    id: number;
    bc_order_id: number;
    tesco_invoice_nr: string;
    order_value: number;
    order_date: string;
}

export interface TescoOrdersResponse {
    data: TescoOrder[];
    error: string | null;
}

export interface CsvDataStats {
    loyalty_nr: number;
    loyalty_value: number;
    sales_nr: number;
    sales_value: number;
    coupons_nr: number | null;
    coupons_value: number | null;
    day?: string;
    week?: string;
    month?: string;
    year?: number;
}

export interface TNCSeller {
    bc_id: number;
    first_name: string;
    last_name: string;
    email: string;
}
