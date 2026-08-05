import * as Location from 'expo-location';
import { DeliveryLocation } from '../services/customerApi';
import { createLogger } from './logger';

const log = createLogger('src/utils/deviceLocation.ts');

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
  log.info('geocodeAddress', 'start', { address });
  try {
    const [result] = await Location.geocodeAsync(address);
    if (!result) {
      throw new GeocodeNotFoundError(address);
    }
    const location = { latitude: result.latitude, longitude: result.longitude };
    log.info('geocodeAddress', 'end', location);
    return location;
  } catch (err) {
    log.error('geocodeAddress', 'failed to geocode address', { address }, err);
    throw err;
  }
}

// Reverse-geocodes a coordinate pair (e.g. the map's centre pin after the
// user drags it) into the shape the /customer/location API expects.
export async function reverseGeocodeCoords(
  latitude: number,
  longitude: number,
): Promise<DeliveryLocation> {
  log.info('reverseGeocodeCoords', 'start', { latitude, longitude });
  try {
    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });

    const addressLines = [place?.name ?? place?.street, place?.district ?? place?.city]
      .filter(Boolean)
      .join(', ');

    const deliveryLocation = {
      latitude,
      longitude,
      address: addressLines || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
      city: place?.city ?? undefined,
      state: place?.region ?? undefined,
      postalCode: place?.postalCode ?? undefined,
      country: place?.country ?? undefined,
    };
    log.info('reverseGeocodeCoords', 'end', deliveryLocation);
    return deliveryLocation;
  } catch (err) {
    log.error('reverseGeocodeCoords', 'failed to reverse-geocode coordinates', { latitude, longitude }, err);
    throw err;
  }
}

// Requests foreground permission, reads the device GPS, and reverse-geocodes
// it into the shape the /customer/location API expects.
export async function getCurrentDeliveryLocation(): Promise<DeliveryLocation> {
  log.info('getCurrentDeliveryLocation', 'start');
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new LocationPermissionDeniedError();
    }

    const position = await Location.getCurrentPositionAsync({});
    const deliveryLocation = await reverseGeocodeCoords(position.coords.latitude, position.coords.longitude);
    log.info('getCurrentDeliveryLocation', 'end', deliveryLocation);
    return deliveryLocation;
  } catch (err) {
    log.error('getCurrentDeliveryLocation', 'failed to get current delivery location', {}, err);
    throw err;
  }
}
