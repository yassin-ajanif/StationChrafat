import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideI18n } from './core/i18n';
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
import { StockEffects, StockGestionEffects } from './module/Station/stock/state/effects';
import { stockGestionFeature } from './module/Station/stock/state/reducers/stock-gestion.reducer';
import { stockFeature } from './module/Station/stock/state/reducers/stock.reducer';
import { VentesEffects } from './module/Station/ventes/state/ventes.effects';
import { ventesFeature } from './module/Station/ventes/state/ventes.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideI18n(),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    provideStore(),
    provideState(journeeFeature),
    provideState(ventesFeature),
    provideState(achatFeature),
    provideState(stockFeature),
    provideState(stockGestionFeature),
    provideState(produitsServicesFeature),
    provideEffects(JourneeEffects, VentesEffects, AchatEffects, StockEffects, StockGestionEffects, ProduitsServicesEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
