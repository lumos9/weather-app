// utils/getGeoLocation.tsx
import axios from 'axios';

export interface GeoLocation {
    ip: string;
    city: string;
    region: string;
    country_name: string;
    latitude: number;
    longitude: number;
}

export const getGeoLocation = async (): Promise<GeoLocation | null> => {
    try {
        const response = await axios.get<GeoLocation>('https://ipapi.co/json/');
        return response.data;
    } catch (error) {
        console.error('Error fetching the geolocation data', error);
        return null;
    }
};
