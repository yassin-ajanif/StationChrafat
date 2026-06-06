import { DOCUMENT, registerLocaleData } from '@angular/common';
import localeArMa from '@angular/common/locales/ar-MA';
import localeFrMa from '@angular/common/locales/fr-MA';
import { HttpClient } from '@angular/common/http';
import {
  APP_INITIALIZER,
  EnvironmentProviders,
  Injectable,
  LOCALE_ID,
  computed,
  inject,
  makeEnvironmentProviders,
  signal,
} from '@angular/core';
import { firstValueFrom, forkJoin, map, Observable, of, tap } from 'rxjs';

// --- Locale config ---

export type AppLocaleId = 'fr-MA' | 'ar-MA';

export const DEFAULT_LOCALE: AppLocaleId = 'fr-MA';
const LOCALE_STORAGE_KEY = 'charafate-locale';
const SUPPORTED_LOCALES: readonly AppLocaleId[] = ['fr-MA', 'ar-MA'];

const LOCALE_BUNDLE_FILES = [
  'common.json',
  'shell.json',
  'journee.json',
  'ventes.json',
  'achat.json',
  'stock.json',
  'produits-services.json',
  'client.json',
  'fournisseur.json',
] as const;

const LOCALE_BUNDLE_NAMESPACE: Record<(typeof LOCALE_BUNDLE_FILES)[number], string> = {
  'common.json': 'common',
  'shell.json': 'shell',
  'journee.json': 'journee',
  'ventes.json': 'ventes',
  'achat.json': 'achat',
  'stock.json': 'stock',
  'produits-services.json': 'produitsServices',
  'client.json': 'client',
  'fournisseur.json': 'fournisseur',
};

export function isRtlLocale(locale: AppLocaleId): boolean {
  return locale === 'ar-MA';
}

function localeDirection(locale: AppLocaleId): 'ltr' | 'rtl' {
  return isRtlLocale(locale) ? 'rtl' : 'ltr';
}

// --- Dictionary helpers ---

type TranslationDictionary = Record<string, unknown>;

function deepMergeTranslations(
  target: TranslationDictionary,
  source: TranslationDictionary,
): TranslationDictionary {
  for (const key of Object.keys(source)) {
    const value = source[key];
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const existing = target[key];
      target[key] = deepMergeTranslations(
        existing !== null && typeof existing === 'object' && !Array.isArray(existing)
          ? { ...(existing as TranslationDictionary) }
          : {},
        value as TranslationDictionary,
      );
    } else {
      target[key] = value;
    }
  }
  return target;
}

function resolveTranslationKey(
  dictionary: TranslationDictionary,
  key: string,
): string | undefined {
  const parts = key.split('.');
  let current: unknown = dictionary;
  for (const part of parts) {
    if (current === null || typeof current !== 'object' || Array.isArray(current)) {
      return undefined;
    }
    current = (current as TranslationDictionary)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

function interpolateParams(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) {
    return template;
  }
  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    const value = params[name];
    return value === undefined ? `{{${name}}}` : String(value);
  });
}

function loadBundles(http: HttpClient, locale: AppLocaleId): Observable<TranslationDictionary> {
  const requests = LOCALE_BUNDLE_FILES.map((file) =>
    http.get<TranslationDictionary>(`/i18n/${locale}/${file}`).pipe(
      map((bundle) => ({ [LOCALE_BUNDLE_NAMESPACE[file]]: bundle })),
    ),
  );
  return forkJoin(requests).pipe(
    map((namespacedBundles) => {
      let merged: TranslationDictionary = {};
      for (const namespaced of namespacedBundles) {
        merged = deepMergeTranslations(merged, namespaced);
      }
      return merged;
    }),
  );
}

// --- TranslateService: load JSON + resolve keys ---

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly http = inject(HttpClient);

  private readonly dictionary = signal<TranslationDictionary>({});
  private readonly fallbackDictionary = signal<TranslationDictionary>({});
  private readonly loadedLocale = signal<AppLocaleId | null>(null);
  readonly ready = signal(false);
  readonly version = signal(0);

  loadLocale(locale: AppLocaleId): Observable<void> {
    return loadBundles(this.http, locale).pipe(
      tap((merged) => {
        this.dictionary.set(merged);
        this.loadedLocale.set(locale);
        this.ready.set(true);
      }),
      map(() => undefined),
    );
  }

  ensureFallbackLoaded(): Observable<void> {
    if (Object.keys(this.fallbackDictionary()).length > 0) {
      return of(undefined);
    }
    if (DEFAULT_LOCALE === this.loadedLocale()) {
      this.fallbackDictionary.set(this.dictionary());
      return of(undefined);
    }
    return loadBundles(this.http, DEFAULT_LOCALE).pipe(
      tap((merged) => this.fallbackDictionary.set(merged)),
      map(() => undefined),
    );
  }

  instant(key: string, params?: Record<string, string | number>): string {
    const primary = resolveTranslationKey(this.dictionary(), key);
    if (primary !== undefined) {
      return interpolateParams(primary, params);
    }
    const fallback = resolveTranslationKey(this.fallbackDictionary(), key);
    if (fallback !== undefined) {
      return interpolateParams(fallback, params);
    }
    return key;
  }

  notifyChange(): void {
    this.version.update((v) => v + 1);
  }

  useLoadedAsFallback(): void {
    this.fallbackDictionary.set(this.dictionary());
  }
}

// --- LocaleService: active locale, RTL, persistence ---

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly document = inject(DOCUMENT);
  private readonly translate = inject(TranslateService);

  readonly activeLocale = signal<AppLocaleId>(this.readStoredLocale());
  readonly direction = computed(() => localeDirection(this.activeLocale()));
  readonly isRtl = computed(() => this.direction() === 'rtl');

  async initialize(): Promise<void> {
    await this.applyLocale(this.activeLocale(), false);
  }

  async setLocale(locale: AppLocaleId): Promise<void> {
    if (!SUPPORTED_LOCALES.includes(locale)) {
      return;
    }
    await this.applyLocale(locale, true);
  }

  localeId(): AppLocaleId {
    return this.activeLocale();
  }

  private async applyLocale(locale: AppLocaleId, persist: boolean): Promise<void> {
    await firstValueFrom(this.translate.loadLocale(locale));
    if (locale !== DEFAULT_LOCALE) {
      await firstValueFrom(this.translate.ensureFallbackLoaded());
    } else {
      this.translate.useLoadedAsFallback();
    }
    this.activeLocale.set(locale);
    this.syncDocument();
    this.translate.notifyChange();
    if (persist) {
      this.persistLocale(locale);
    }
  }

  private syncDocument(): void {
    const html = this.document.documentElement;
    html.lang = this.activeLocale();
    html.dir = this.direction();
  }

  private readStoredLocale(): AppLocaleId {
    if (typeof localStorage === 'undefined') {
      return DEFAULT_LOCALE;
    }
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored === 'ar-MA' || stored === 'fr-MA' ? stored : DEFAULT_LOCALE;
  }

  private persistLocale(locale: AppLocaleId): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }
}

// --- App bootstrap ---

registerLocaleData(localeFrMa);
registerLocaleData(localeArMa);

export function provideI18n(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: LOCALE_ID,
      deps: [LocaleService],
      useFactory: (locale: LocaleService) => locale.localeId(),
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (locale: LocaleService) => () => locale.initialize(),
      deps: [LocaleService],
      multi: true,
    },
  ]);
}
