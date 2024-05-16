export const kelvinToCelsius = (kelvin: number): number => {
    return kelvin - 273.15;
};

export const kelvinToFahrenheit = (kelvin: number): number => {
    return (kelvin - 273.15) * 9 / 5 + 32;
};