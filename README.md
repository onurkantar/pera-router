# pera-router

> Vendor-aware router utilities for React Native. Route to device-specific modules by manufacturer (e.g., PAX) while keeping vendor packages optional.

## Features

- Vendor-based resolution using the device manufacturer
- Small JS helpers with a native `getManufacturer()` TurboModule
- Opt-in vendor integrations (e.g., Pax A920 barcode scanner)
- Clear error messages when a vendor package is missing

## Requirements

- React Native 0.79+
- iOS 13+ / Android 5.0+

## Installation


```sh
yarn add pera-router
```


### Optional: Install a vendor package (PAX example)

If you target PAX devices, install the Pax A920 barcode scanner package in your app:

```sh
yarn add diva.pax-a920-barcode-scanner
# iOS only
cd ios && pod install
```

Vendor package reference: [PaxA920BarcodeScanner](https://github.com/onurkantar/PaxA920BarcodeScanner)

## Rebuild after native changes

This library exposes a small TurboModule. After installing or updating it, run:

```sh
yarn prepare
```

Then rebuild your app as usual:

- Android: Gradle/Android Studio or `yarn android`
- iOS: `cd ios && pod install` then build in Xcode or `yarn ios`

## Quick start


```js
import { getBarcodeScannerModule, getManufacturer } from 'pera-router';

const manufacturer = getManufacturer();
console.log('Manufacturer:', manufacturer);

// Resolve a barcode scanner implementation by manufacturer.
// On PAX devices, this returns the Pax A920 scanner module.
const Scanner = getBarcodeScannerModule();

// Use the vendor module's API (refer to its docs for exact methods)
// Scanner.startScanning?.(...)
```


## API

### `getManufacturer(): string`
Returns the device manufacturer string.

- Android: `Build.MANUFACTURER` (e.g., `PAX`, `samsung`, `HUAWEI`)
- iOS: returns `Apple`

Example:

```js
import { getManufacturer } from 'pera-router';

const m = getManufacturer(); // e.g., 'PAX' on PAX devices
```

### `getBarcodeScannerModule<T = unknown>(): T`
Resolves and returns a vendor-specific barcode scanner module based on the manufacturer.

- PAX → resolves `diva.pax-a920-barcode-scanner`
- Throws if no integration is registered for the current device
- Throws with guidance if a required vendor package is missing

Example:

```js
import { getBarcodeScannerModule } from 'pera-router';

const Scanner = getBarcodeScannerModule();
// Then use Scanner according to the vendor package docs
```

### `multiply(a: number, b: number): number`
A simple test method included by the template. Not used in routing.

```js
import { multiply } from 'pera-router';

multiply(3, 7); // 21
```

## Error handling

- Missing vendor package:
  - Error: "PAX scanner module is not installed. Please add 'diva.pax-a920-barcode-scanner' to your app."
- Unsupported manufacturer:
  - Error: "No barcode scanner integration for manufacturer: <name>"

You can catch these errors to provide custom UX:

```js
import { getBarcodeScannerModule } from 'pera-router';

try {
  const Scanner = getBarcodeScannerModule();
  // ...use Scanner
} catch (e) {
  // Show a helpful message or fall back to a generic flow
}
```

## Extending to other vendors

At the moment, the router ships with a PAX mapping for barcode scanning. There are two common ways to extend:

1. Open a PR to add a new manufacturer mapping in `getBarcodeScannerModule()`.
2. Resolve manufacturer yourself and branch in your app:

```js
import { getManufacturer } from 'pera-router';

const m = getManufacturer().toUpperCase();
if (m === 'PAX') {
  const PaxScanner = require('diva.pax-a920-barcode-scanner');
  // use PaxScanner
} else {
  // other vendors or a generic path
}
```

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
