export type AppLocaleId = 'fr-MA' | 'ar-MA';

export const DEFAULT_LOCALE: AppLocaleId = 'fr-MA';
export const LOCALE_STORAGE_KEY = 'charafate-locale';

export const SUPPORTED_LOCALES: readonly AppLocaleId[] = ['fr-MA', 'ar-MA'] as const;

export const LOCALE_BUNDLE_FILES = [
  'common.json',
  'shell.json',
  'journee.json',
  'ventes.json',
  'achat.json',
  'stock.json',
  'produits-services.json',
] as const;

/** Top-level key each bundle is mounted under (must match template key prefixes). */
export const LOCALE_BUNDLE_NAMESPACE: Record<(typeof LOCALE_BUNDLE_FILES)[number], string> = {
  'common.json': 'common',
  'shell.json': 'shell',
  'journee.json': 'journee',
  'ventes.json': 'ventes',
  'achat.json': 'achat',
  'stock.json': 'stock',
  'produits-services.json': 'produitsServices',
};

export function isRtlLocale(locale: AppLocaleId): boolean {
  return locale === 'ar-MA';
}

export function localeDirection(locale: AppLocaleId): 'ltr' | 'rtl' {
  return isRtlLocale(locale) ? 'rtl' : 'ltr';
}

export function localeDisplayLabel(locale: AppLocaleId): string {
  return locale === 'fr-MA' ? 'FR' : 'AR';
}
