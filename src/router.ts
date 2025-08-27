export type Manufacturer = string;

export type ProviderLoader<TModule> = () => TModule;

export interface ProviderMap<TModule> {
  [key: string]: ProviderLoader<TModule>;
}

/**
 * Creates a lazy, manufacturer-aware proxy for a module. The first property access
 * resolves the actual provider module using the provided loader map.
 */
export function createManufacturerRouter<TModule>(
  getCurrentManufacturer: () => Manufacturer,
  providers: ProviderMap<TModule>,
  options?: { onMissing?: (manufacturer: Manufacturer) => never }
): TModule {
  let resolvedModule: TModule | null = null;

  function resolve(): TModule {
    if (resolvedModule) return resolvedModule;
    const current = String(getCurrentManufacturer() || '').toUpperCase();
    const loader = providers[current];
    if (!loader) {
      const onMissing = options?.onMissing;
      if (onMissing) return onMissing(current);
      throw new Error(
        `No provider registered for manufacturer: ${current || 'unknown'}`
      );
    }
    resolvedModule = loader();
    return resolvedModule as TModule;
  }

  const target: Record<string | symbol, unknown> = {};

  return new Proxy(target, {
    get(_t, prop, _recv) {
      const mod: any = resolve();
      const value = mod[prop as any];
      if (typeof value === 'function') {
        return value.bind(mod);
      }
      return value;
    },
    has(_t, prop) {
      const mod: any = resolve();
      return prop in mod;
    },
    ownKeys() {
      const mod: any = resolve();
      return Reflect.ownKeys(mod);
    },
    getOwnPropertyDescriptor(_t, prop) {
      const mod: any = resolve();
      const desc = Object.getOwnPropertyDescriptor(mod, prop as any);
      if (!desc) return undefined;
      return { ...desc, configurable: true };
    },
  }) as unknown as TModule;
}
