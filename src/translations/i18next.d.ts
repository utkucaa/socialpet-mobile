import type { SupportedLanguages } from '@/hooks/language/schema';
import type { defaultNS, resources } from '@/translations';

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never;

type Leaves<T, K = ''> = T extends object
  ? {
      [P in keyof T]: P extends string | number
        ? Leaves<T[P], K extends '' ? P : `${K}.${P}`>
        : never;
    }[keyof T]
  : K;

// Extract all nested keys from the translations
export type NestedKeys = Leaves<typeof resources[SupportedLanguages.EN_EN]>;

// Create a custom recursive type for socialpet namespace
type Flatten<T> = T extends object
  ? {
      [K in keyof T as K extends string ? K : never]: T[K] extends object
        ? Flatten<T[K]>
        : T[K];
    }
  : T;

type NestedPath<
  T,
  D extends string = '.',
> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}${D}${NestedPath<T[K], D>}`
          : K
        : never;
    }[keyof T]
  : string;

type SocialpetTranslations = typeof resources[SupportedLanguages.EN_EN][typeof defaultNS];

export type TranslationKeys = NestedPath<SocialpetTranslations>;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources[SupportedLanguages.EN_EN];
    // Allow any key including nested paths like 'socialpet.register.title'
    returnNull: false;
    allowObjectInHTMLChildren: true;
  }
}
