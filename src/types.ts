// Use the Pax scanner package as the canonical shape for all providers
export type PaxBarcodeScannerModule =
  typeof import('@diva-mobilepackage/diva-pera-pax-a920-barcode-scanner');

export interface BarcodeScannerProvider extends PaxBarcodeScannerModule {}
