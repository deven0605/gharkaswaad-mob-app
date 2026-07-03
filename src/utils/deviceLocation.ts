import * as Location from 'expo-location';
import { DeliveryLocation } from '../services/customerApi';

export class LocationPermissionDeniedError extends Error {
  constructor() {
    super('Location permission was denied.');
    this.name = 'LocationPermissionDeniedError';
  }
}

export class GeocodeNotFoundError extends Error {
  constructor(address: string) {
    super(`No coordinates found for address: ${address}`);
    this.name = 'GeocodeNotFoundError';
  }
}

// Forward-geocodes a free-text address (e.g. one picked from search
// suggestions) into coordinates, without touching the device GPS.
export async function geocodeAddress(
  address: string,
): Promise<{ latitude: number; longitude: number }> {
  const [result] = await Location.geocodeAsync(address);
  if (!result) {
    throw new GeocodeNotFoundError(address);
  }
  return { latitude: result.latitude, longitude: result.longitude };
}

// Reverse-geocodes a coordinate pair (e.g. the map's centre pin after the
// user drags it) into the shape the /customer/location API expects.
export async function reverseGeocodeCoords(
  latitude: number,
  longitude: number,
): Promise<DeliveryLocation> {
  const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });

  const addressLines = [place?.name ?? place?.street, place?.district ?? place?.city]
    .filter(Boolean)
    .join(', ');

  return {
    latitude,
    longitude,
    address: addressLines || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
    city: place?.city ?? undefined,
    state: place?.region ?? undefined,
    postalCode: place?.postalCode ?? undefined,
    country: place?.country ?? undefined,
  };
}

// Requests foreground permission, reads the device GPS, and reverse-geocodes
// it into the shape the /customer/location API expects.
export async function getCurrentDeliveryLocation(): Promise<DeliveryLocation> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new LocationPermissionDeniedError();
  }

  const position = await Location.getCurrentPositionAsync({});
  return reverseGeocodeCoords(position.coords.latitude, position.coords.longitude);
}
