import PeraRouter from './NativePeraRouter';

export function multiply(a: number, b: number): number {
  return PeraRouter.multiply(a, b);
}

export function getManufacturer(): string {
  try {
    return PeraRouter.getManufacturer().trim();
  } catch (error) {
    console.warn('[pera-router] getManufacturer failed:', error);
    return '';
  }
}

export function getBarcodeScannerModule<T = unknown>(): T {
  const manufacturer = getManufacturer().toUpperCase();

  if (manufacturer === 'PAX') {
    try {
      const mod = require('diva.pax-a920-barcode-scanner');
      return (mod?.default ?? mod) as T;
    } catch (e) {
      console.warn('[pera-router] Pax scanner module load failed:', e);
      throw new Error(
        "PAX scanner module is not installed. Please add 'diva.pax-a920-barcode-scanner' to your app."
      );
    }
  }

  throw new Error(
    `No barcode scanner integration for manufacturer: ${manufacturer || 'unknown'}`
  );
}
