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
