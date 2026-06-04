import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { StockApi } from '../data-access/stock.api';
import { StockActions } from './stock.actions';

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
