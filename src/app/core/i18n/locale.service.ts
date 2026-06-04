import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  AppLocaleId,
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  localeDirection,
} from './supported-locales';
import { TranslateService } from './translate.service';

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
    const locale = this.activeLocale();
    html.lang = locale;
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
