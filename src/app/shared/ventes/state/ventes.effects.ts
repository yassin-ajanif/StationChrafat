import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { VentesApi } from '../data-access/ventes.api';
import { VentesActions } from './ventes.actions';

@Injectable()
export class VentesEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(VentesApi);

  loadDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VentesActions.loadDevis),
      switchMap(({ module }) =>
        this.api.getDevis(module).pipe(
          map((devis) => VentesActions.loadDevisSuccess({ devis })),
          catchError((err) =>
            of(VentesActions.loadDevisFailure({ error: err?.message ?? 'Erreur chargement devis' })),
          ),
        ),
      ),
    ),
  );

  addDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VentesActions.addDevis),
      switchMap(({ draft, module }) =>
        this.api.addDevis(draft, module).pipe(
          map((devis) => VentesActions.addDevisSuccess({ devis })),
          catchError((err) =>
            of(VentesActions.addDevisFailure({ error: err?.message ?? 'Erreur ajout devis' })),
          ),
        ),
      ),
    ),
  );

  updateDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VentesActions.updateDevis),
      switchMap(({ id, draft }) =>
        this.api.updateDevis(id, draft).pipe(
          map((devis) => VentesActions.updateDevisSuccess({ devis })),
          catchError((err) =>
            of(VentesActions.updateDevisFailure({ error: err?.message ?? 'Erreur modification devis' })),
          ),
        ),
      ),
    ),
  );

  removeDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VentesActions.removeDevis),
      switchMap(({ id }) =>
        this.api.removeDevis(id).pipe(
          map(() => VentesActions.removeDevisSuccess({ id })),
          catchError((err) =>
            of(VentesActions.removeDevisFailure({ error: err?.message ?? 'Erreur suppression devis' })),
          ),
        ),
      ),
    ),
  );
}
