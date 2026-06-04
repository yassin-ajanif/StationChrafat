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
import { AchatEffects } from './module/Station/achat/state/achat.effects';
import { achatFeature } from './module/Station/achat/state/achat.reducer';
import { JourneeEffects } from './module/Station/journee/state/journee.effects';
import { journeeFeature } from './module/Station/journee/state/journee.reducer';
import { ProduitsServicesEffects } from './module/Station/produits-services/state/produits-services.effects';
import { produitsServicesFeature } from './module/Station/produits-services/state/produits-services.reducer';
import { StockEffects } from './module/Station/stock/state/stock.effects';
import { stockFeature } from './module/Station/stock/state/stock.reducer';
import { VentesEffects } from './module/Station/ventes/state/ventes.effects';
import { ventesFeature } from './module/Station/ventes/state/ventes.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-MA' },
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    provideStore(),
    provideState(journeeFeature),
    provideState(ventesFeature),
    provideState(achatFeature),
    provideState(stockFeature),
    provideState(produitsServicesFeature),
    provideEffects(JourneeEffects, VentesEffects, AchatEffects, StockEffects, ProduitsServicesEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
