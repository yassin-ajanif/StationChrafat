import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { StockApi } from '../data-access/stock.api';
import { StockGestionApi } from '../data-access/stock-gestion.api';
import { StockActions, StockGestionActions } from './actions';

@Injectable()
export class StockEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(StockApi);

  loadStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StockActions.load),
      switchMap(() =>
        this.api.getStockOverview().pipe(
          map((overview) => StockActions.loadSuccess({ overview })),
          catchError((err) =>
            of(StockActions.loadFailure({ error: err?.message ?? 'Erreur chargement stock' })),
          ),
        ),
      ),
    ),
  );
}

@Injectable()
export class StockGestionEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(StockGestionApi);

  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StockGestionActions.loadPage),
      switchMap(() =>
        forkJoin({
          summaries: this.api.getSummary(),
          products: this.api.getProducts(),
        }).pipe(
          switchMap(({ summaries, products }) => [
            StockGestionActions.loadSummarySuccess({ summaries }),
            StockGestionActions.loadProductsSuccess({ products }),
          ]),
          catchError((err) =>
            of(
              StockGestionActions.loadFailure({
                error: err?.message ?? 'Erreur chargement gestion des stocks',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
