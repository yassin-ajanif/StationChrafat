import { registerLocaleData } from '@angular/common';
import localeArMa from '@angular/common/locales/ar-MA';
import localeFrMa from '@angular/common/locales/fr-MA';
import {
  APP_INITIALIZER,
  EnvironmentProviders,
  LOCALE_ID,
  makeEnvironmentProviders,
} from '@angular/core';
import { LocaleService } from './locale.service';

registerLocaleData(localeFrMa);
registerLocaleData(localeArMa);

function initializeI18n(locale: LocaleService): () => Promise<void> {
  return () => locale.initialize();
}

export function provideI18n(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: LOCALE_ID,
      deps: [LocaleService],
      useFactory: (locale: LocaleService) => locale.localeId(),
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeI18n,
      deps: [LocaleService],
      multi: true,
    },
  ]);
}
