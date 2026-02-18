export type CarModel = {
    id: string;
    brand: string;
    brandSlug: string;
    model: string;
    year: number;
    type: string;
    seats: number;
    transmission: string;
    fuelType: string;
    pricePerDay: number;
    image: string;
    features: string[];
}