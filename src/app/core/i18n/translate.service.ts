import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { forkJoin, map, Observable, of, tap } from 'rxjs';
import {
  AppLocaleId,
  DEFAULT_LOCALE,
  LOCALE_BUNDLE_FILES,
  LOCALE_BUNDLE_NAMESPACE,
} from './supported-locales';
import {
  deepMergeTranslations,
  interpolateParams,
  resolveTranslationKey,
  TranslationDictionary,
} from './translate.utils';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly http = inject(HttpClient);

  private readonly dictionary = signal<TranslationDictionary>({});
  private readonly fallbackDictionary = signal<TranslationDictionary>({});
  private readonly loadedLocale = signal<AppLocaleId | null>(null);
  readonly ready = signal(false);

  loadLocale(locale: AppLocaleId): Observable<void> {
    const requests = LOCALE_BUNDLE_FILES.map((file) =>
      this.http
        .get<TranslationDictionary>(`/i18n/${locale}/${file}`)
        .pipe(
          map((bundle) => ({
            [LOCALE_BUNDLE_NAMESPACE[file]]: bundle,
          })),
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
      tap((merged) => {
        this.dictionary.set(merged);
        this.loadedLocale.set(locale);
        this.ready.set(true);
      }),
      map(() => undefined),
    );
  }

  ensureFallbackLoaded(): Observable<void> {
    if (this.fallbackDictionary() && Object.keys(this.fallbackDictionary()).length > 0) {
      return of(undefined);
    }
    if (DEFAULT_LOCALE === this.loadedLocale()) {
      this.fallbackDictionary.set(this.dictionary());
      return of(undefined);
    }
    const requests = LOCALE_BUNDLE_FILES.map((file) =>
      this.http
        .get<TranslationDictionary>(`/i18n/${DEFAULT_LOCALE}/${file}`)
        .pipe(
          map((bundle) => ({
            [LOCALE_BUNDLE_NAMESPACE[file]]: bundle,
          })),
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

  /** Bump when dictionary changes so pipes re-run. */
  readonly version = signal(0);

  notifyChange(): void {
    this.version.update((v) => v + 1);
  }

  useLoadedAsFallback(): void {
    this.fallbackDictionary.set(this.dictionary());
  }
}
