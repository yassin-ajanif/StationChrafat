import { registerLocaleData } from '@angular/common';
import localeFrMa from '@angular/common/locales/fr-MA';
import { ApplicationConfig, LOCALE_ID, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';

registerLocaleData(localeFrMa);
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { JourneeEffects } from './module/journee/state/journee.effects';
import { journeeFeature } from './module/journee/state/journee.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-MA' },
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    provideStore(),
    provideState(journeeFeature),
    provideEffects(JourneeEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
