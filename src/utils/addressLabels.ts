import { Colors } from '../theme/colors';
import { BriefcaseIcon, HouseIcon, MapPinIcon } from '../components/Icons';
import { Address, AddressLabel } from '../services/customerApi';
import { createLogger } from './logger';

const log = createLogger('src/utils/addressLabels.ts');

export const ADDRESS_LABEL_META: Record<AddressLabel, { Icon: typeof HouseIcon; iconColor: string; bg: string }> = {
  HOME: { Icon: HouseIcon, iconColor: Colors.primary, bg: '#FBE4D8' },
  WORK: { Icon: BriefcaseIcon, iconColor: '#2C5C9E', bg: '#E3ECF7' },
  OTHER: { Icon: MapPinIcon, iconColor: '#C0392B', bg: '#FBE0E0' },
};

export const DEFAULT_ADDRESS_LABEL_META = { Icon: MapPinIcon, iconColor: Colors.primary, bg: '#FBE4D8' };

export function addressLabelMeta(label?: AddressLabel | string) {
  return (label && ADDRESS_LABEL_META[label as AddressLabel]) || DEFAULT_ADDRESS_LABEL_META;
}

const LABEL_DISPLAY_NAMES: Record<AddressLabel, string> = {
  HOME: 'Home',
  WORK: 'Work',
  OTHER: 'Other',
};

export function addressLabelDisplayName(label?: AddressLabel | string): string {
  return (label && LABEL_DISPLAY_NAMES[label as AddressLabel]) || 'Address';
}

// Composes the structured backend fields into a single display string, e.g.
// "15, Wakad Society, Wakad Road, Wakad (Near XYZ Mall), Pune 411057"
export function formatAddress(
  address: Pick<Address, 'flatNo' | 'building' | 'street' | 'area' | 'landmark' | 'city' | 'pinCode'>,
): string {
  log.info('formatAddress', 'start', { address });
  try {
    const lineParts = [address.flatNo, address.building, address.street, address.area]
      .map(s => (s ?? '').trim())
      .filter(Boolean);
    let line = lineParts.join(', ');
    if (address.landmark?.trim()) line += ` (Near ${address.landmark.trim()})`;
    const cityLine = [address.city?.trim(), address.pinCode?.trim()].filter(Boolean).join(' ');
    const formatted = [line, cityLine].filter(Boolean).join(', ');
    log.info('formatAddress', 'end', { formatted });
    return formatted;
  } catch (err) {
    log.error('formatAddress', 'failed to format address', { address }, err);
    throw err;
  }
}
