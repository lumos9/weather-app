"use client"

import { GeoLocation, getGeoLocation } from "@/lib/geo-location";
import { kelvinToCelsius, kelvinToFahrenheit } from "@/lib/temperature";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { LoaderPinwheel, RotateCw } from "lucide-react";

export default function Weather() {
    const [location, setLocation] = useState<GeoLocation | null>(null);
    const [weather, setWeather] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const hasFetchedLocation = useRef(false);

    // Step 1: Create a mapping object
    const weatherEmojis: any = {
        "clear": "☀️",
        "clear sky": "☀️",
        "few clouds": "🌤️",
        "scattered clouds": "🌥️",
        "clouds": "🌥️",
        "broken clouds": "☁️",
        "shower rain": "🌧️",
        "rain": "🌧️",
        "thunderstorm": "⛈️",
        "snow": "❄️",
        "mist": "🌫️",
        "overcast clouds": "☁️",
        "light rain": "🌦️",
        "heavy rain": "🌧️",
        "haze": "🌫️",
        "fog": "🌫️",
        "drizzle": "🌦️",
        "light snow": "🌨️",
        "heavy snow": "❄️",
        "sleet": "🌨️",
        "windy": "🌬️",
        "hot": "🔥",
        "cold": "❄️",
        "thunderstorm with light rain": "⛈️",
        "thunderstorm with rain": "⛈️",
        "thunderstorm with heavy rain": "⛈️",
        "light thunderstorm": "🌩️",
        "heavy thunderstorm": "🌩️",
        "ragged thunderstorm": "🌩️",
        "thunderstorm with light drizzle": "⛈️",
        "thunderstorm with drizzle": "⛈️",
        "thunderstorm with heavy drizzle": "⛈️",
        "light intensity drizzle": "🌦️",
        "heavy intensity drizzle": "🌦️",
        "light intensity drizzle rain": "🌦️",
        "drizzle rain": "🌦️",
        "heavy intensity drizzle rain": "🌦️",
        "shower rain and drizzle": "🌧️",
        "heavy shower rain and drizzle": "🌧️",
        "shower drizzle": "🌧️",
        "moderate rain": "🌧️",
        "heavy intensity rain": "🌧️",
        "very heavy rain": "🌧️",
        "extreme rain": "🌧️",
        "freezing rain": "❄️",
        "light intensity shower rain": "🌧️",
        "heavy intensity shower rain": "🌧️",
        "ragged shower rain": "🌧️",
        "light shower sleet": "🌨️",
        "shower sleet": "🌨️",
        "light rain and snow": "🌨️",
        "rain and snow": "🌨️",
        "light shower snow": "🌨️",
        "shower snow": "🌨️",
        "heavy shower snow": "❄️",
        "smoke": "🌫️",
        "sand/dust whirls": "🌪️",
        "sand": "🌪️",
        "dust": "🌪️",
        "volcanic ash": "🌋",
        "squalls": "🌬️",
        "tornado": "🌪️",
    };

    // Step 2: Function to get emoji based on weather description
    function getWeatherEmoji(description: any) {
        return weatherEmojis[description.toLowerCase()] || "🌈";  // Default to rainbow if not found
    }

    function supportsFahrenheit(country: any) {
        const fahrenheitCountries = new Set([
            'United States',
            'Bahamas',
            'Cayman Islands',
            'Palau'
            // Add more countries that use Fahrenheit
        ]);
        return fahrenheitCountries.has(country);
    }

    const fetchLocation = async () => {
        setIsLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        if (apiKey) {
            const geoData = await getGeoLocation();
            if (geoData) {
                setLocation(geoData);
                const lat = geoData.latitude || "37.1289771";
                const long = geoData.longitude || "-84.0832636";
                const weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`;
                const weatherResponse = await fetch(weatherApiUrl, { cache: 'no-store' });
                const weather = await weatherResponse.json();
                console.log(weather);
                if (weatherResponse.ok) {
                    setWeather(weather);
                }
            }
        } else {
            console.error("API key not found");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!hasFetchedLocation.current) {
                hasFetchedLocation.current = true;
                fetchLocation();
            }
        }
    }, []);

    return (
        <div className="flex justify-center items-center text-pretty font-medium">
            {isLoading ? (
                <LoaderPinwheel className="animate-spin size-10" color="#fec700" />
            ) : (
                weather ? (
                    <div className="flex flex-col justify-center items-center gap-5">
                        <div className="flex flex-col justify-center items-center gap-2">
                            <div className="text-8xl">{getWeatherEmoji(weather.weather[0].main)}</div>
                            {
                                supportsFahrenheit(location?.country_name) ? (
                                    <div className="flex flex-row">
                                        <div className="text-8xl text-pretty font-medium">{kelvinToFahrenheit(weather.main.temp).toFixed(1)}</div>
                                        <span className="superscript text-xl">°F</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-row">
                                        <div className="text-8xl text-pretty font-medium">{kelvinToCelsius(weather.main.temp).toFixed(1)}</div>
                                        <span className="superscript text-xl">°C</span>
                                    </div>
                                )
                            }
                            <div className="text-2xl font-normal">{location?.city}, {location?.region} </div>
                            <div className="text-2xl font-normal">{location?.country_name}</div>
                        </div>
                        <Button variant={"outline"} onClick={() => fetchLocation()} className="cursor-pointer"><RotateCw /></Button>
                        <div className="text-sm md:text-base font-normal text-muted-foreground text-center flex flex-col gap-2">
                            <div>Retrieved approx. location info from your public IP address</div>
                            <div>{location?.ip}</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center gap-4">
                        <div>No data</div>
                        <Button variant={"outline"} onClick={() => fetchLocation()} className="cursor-pointer"><RotateCw /></Button>
                    </div>
                )
            )}
        </div>
    );
}
