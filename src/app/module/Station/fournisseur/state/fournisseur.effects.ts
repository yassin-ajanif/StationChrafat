import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { FournisseurApi } from '../data-access/fournisseur.api';
import { FournisseurActions } from './fournisseur.actions';

@Injectable()
export class FournisseurEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(FournisseurApi);

  loadFournisseurs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FournisseurActions.loadFournisseurs),
      switchMap(() =>
        this.api.getFournisseurs().pipe(
          map((fournisseurs) => FournisseurActions.loadFournisseursSuccess({ fournisseurs })),
          catchError((err) =>
            of(
              FournisseurActions.loadFournisseursFailure({
                error: err?.message ?? 'Erreur chargement fournisseurs',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  addFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FournisseurActions.addFournisseur),
      switchMap(({ draft }) =>
        this.api.createFournisseur(draft).pipe(
          map((fournisseur) => FournisseurActions.addFournisseurSuccess({ fournisseur })),
          catchError((err) =>
            of(
              FournisseurActions.addFournisseurFailure({
                error: err?.message ?? 'Erreur ajout fournisseur',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FournisseurActions.updateFournisseur),
      switchMap(({ id, draft }) =>
        this.api.updateFournisseur(id, draft).pipe(
          map((fournisseur) => FournisseurActions.updateFournisseurSuccess({ fournisseur })),
          catchError((err) =>
            of(
              FournisseurActions.updateFournisseurFailure({
                error: err?.message ?? 'Erreur modification fournisseur',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  removeFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FournisseurActions.removeFournisseur),
      switchMap(({ id }) =>
        this.api.deleteFournisseur(id).pipe(
          map(() => FournisseurActions.removeFournisseurSuccess({ id })),
          catchError((err) =>
            of(
              FournisseurActions.removeFournisseurFailure({
                error: err?.message ?? 'Erreur suppression fournisseur',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
