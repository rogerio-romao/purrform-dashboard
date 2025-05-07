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
    created_at: string;
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
    trader_id: number;
}

export type SupabaseError = { error: string };

export type OkOrErrorResponse = { ok: true } | { ok: false; error: string };
