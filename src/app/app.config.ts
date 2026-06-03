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
import { CarburantEffects } from './module/Station/carburant/state/carburant.effects';
import { carburantFeature } from './module/Station/carburant/state/carburant.reducer';
import { LavageEffects } from './module/Station/lavage/state/lavage.effects';
import { lavageFeature } from './module/Station/lavage/state/lavage.reducer';
import { VidangeEffects } from './module/Station/vidange/state/vidange.effects';
import { vidangeFeature } from './module/Station/vidange/state/vidange.reducer';
import { JourneeEffects } from './module/Station/journee/state/journee.effects';
import { journeeFeature } from './module/Station/journee/state/journee.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-MA' },
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    provideStore(),
    provideState(journeeFeature),
    provideState(carburantFeature),
    provideState(lavageFeature),
    provideState(vidangeFeature),
    provideEffects(JourneeEffects, CarburantEffects, LavageEffects, VidangeEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
