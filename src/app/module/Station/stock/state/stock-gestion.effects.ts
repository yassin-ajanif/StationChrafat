import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { StockGestionApi } from '../data-access/stock-gestion.api';
import { StockGestionActions } from './stock-gestion.actions';

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
