import PeraRouter from './NativePeraRouter';
import { createManufacturerRouter } from './router';
import type { BarcodeScannerProvider } from './types';

function getManufacturer(): string {
  try {
    return PeraRouter.getManufacturer().trim();
  } catch (error) {
    console.warn('[pera-router] getManufacturer failed:', error);
    return '';
  }
}

export function getBarcodeScannerModule<T = BarcodeScannerProvider>(): T {
  const manufacturer = getManufacturer().toUpperCase();
  if (manufacturer === 'PAX') {
    try {
      // Load from the actual npm package name
      const mod = require('@diva-mobilepackage/diva-pera-pax-a920-barcode-scanner');
      return (mod?.default ?? mod) as T;
    } catch (e) {
      console.warn('[pera-router] Pax scanner module load failed:', e);
      throw new Error(
        "PAX scanner module is not installed. Please add '@diva-mobilepackage/diva-pera-pax-a920-barcode-scanner' to your app."
      );
    }
  }
  throw new Error(
    `No barcode scanner integration for manufacturer: ${manufacturer || 'unknown'}`
  );
}

// Expose a lazy proxy that forwards every function of the selected provider
export const BarcodeScanner: BarcodeScannerProvider =
  createManufacturerRouter<BarcodeScannerProvider>(
    () => getManufacturer().toUpperCase(),
    {
      PAX: (): BarcodeScannerProvider => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require('@diva-mobilepackage/diva-pera-pax-a920-barcode-scanner');
        return (mod?.default ?? mod) as BarcodeScannerProvider;
      },
    },
    {
      onMissing: (m) => {
        throw new Error(
          `No barcode scanner integration for manufacturer: ${m || 'unknown'}`
        );
      },
    }
  );
