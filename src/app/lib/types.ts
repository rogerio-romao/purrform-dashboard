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
