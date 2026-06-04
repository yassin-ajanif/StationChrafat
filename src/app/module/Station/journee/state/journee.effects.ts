import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { JourneeApi } from '../data-access/journee.api';
import { JourneeActions } from './journee.actions';
import { selectDraft } from './journee.selectors';

@Injectable()
export class JourneeEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(JourneeApi);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  loadList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JourneeActions.loadList),
      switchMap(() =>
        this.api.getJournees().pipe(
          map((journees) => JourneeActions.loadListSuccess({ journees })),
          catchError((err) =>
            of(JourneeActions.loadListFailure({ error: err?.message ?? 'Erreur chargement' })),
          ),
        ),
      ),
    ),
  );

  loadKpis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JourneeActions.loadKpis),
      switchMap(() =>
        this.api.getKpis().pipe(
          map((kpis) => JourneeActions.loadKpisSuccess({ kpis })),
          catchError((err) =>
            of(JourneeActions.loadKpisFailure({ error: err?.message ?? 'Erreur KPIs' })),
          ),
        ),
      ),
    ),
  );

  loadOperators$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JourneeActions.loadOperators),
      switchMap(() =>
        this.api.getOperators().pipe(
          map((operators) => JourneeActions.loadOperatorsSuccess({ operators })),
          catchError((err) =>
            of(JourneeActions.loadOperatorsFailure({ error: err?.message ?? 'Erreur opérateurs' })),
          ),
        ),
      ),
    ),
  );

  startJournee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JourneeActions.startJournee),
      switchMap(({ chefDePisteId, shiftSlot }) =>
        this.api.startJournee({ chefDePisteId, shiftSlot }).pipe(
          switchMap((result) =>
            this.api.hasActiveJournee().pipe(
              map(() =>
                JourneeActions.startJourneeSuccess({
                  id: result.id,
                  openedAt: result.openedAt,
                }),
              ),
            ),
          ),
          catchError((err) =>
            of(
              JourneeActions.startJourneeFailure({
                error: err?.message ?? 'Impossible de démarrer la journée',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadNozzleIndexes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JourneeActions.loadNozzleIndexes),
      switchMap(() =>
        this.api.getNozzleIndexLines().pipe(
          map((lines) => JourneeActions.loadNozzleIndexesSuccess({ lines })),
          catchError((err) =>
            of(
              JourneeActions.loadNozzleIndexesFailure({
                error: err?.message ?? 'Erreur chargement index pistolets',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadEncaissementClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JourneeActions.loadEncaissementClients),
      switchMap(() =>
        this.api.getEncaissementClients().pipe(
          map((clients) => JourneeActions.loadEncaissementClientsSuccess({ clients })),
          catchError((err) =>
            of(
              JourneeActions.loadEncaissementClientsFailure({
                error: err?.message ?? 'Erreur chargement clients',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadEncaissements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JourneeActions.loadEncaissements),
      switchMap(() =>
        this.api.getEncaissements().pipe(
          map((lines) => JourneeActions.loadEncaissementsSuccess({ lines })),
          catchError((err) =>
            of(
              JourneeActions.loadEncaissementsFailure({
                error: err?.message ?? 'Erreur chargement encaissements',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadDepenses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JourneeActions.loadDepenses),
      switchMap(() =>
        this.api.getDepenses().pipe(
          map((lines) => JourneeActions.loadDepensesSuccess({ lines })),
          catchError((err) =>
            of(
              JourneeActions.loadDepensesFailure({
                error: err?.message ?? 'Erreur chargement dépenses',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadValidationExtras$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JourneeActions.loadValidationExtras),
      switchMap(() =>
        this.api.getValidationExtras().pipe(
          map((extras) => JourneeActions.loadValidationExtrasSuccess({ extras })),
          catchError((err) =>
            of(
              JourneeActions.loadValidationExtrasFailure({
                error: err?.message ?? 'Erreur chargement validation',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  submitJournee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JourneeActions.submitJournee),
      withLatestFrom(this.store.select(selectDraft)),
      switchMap(([, draft]) => {
        if (draft.id == null) {
          return of(
            JourneeActions.submitJourneeFailure({
              error: 'Journée non démarrée',
            }),
          );
        }
        return this.api.submitJournee(draft.id).pipe(
          map(() => JourneeActions.submitJourneeSuccess()),
          catchError((err) =>
            of(
              JourneeActions.submitJourneeFailure({
                error: err?.message ?? 'Impossible de soumettre la journée',
              }),
            ),
          ),
        );
      }),
    ),
  );

  startJourneeSuccessNavigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(JourneeActions.startJourneeSuccess),
        tap(() => void this.router.navigate(['/journees', 'nouvelle', 'index-pistoles-step2'])),
      ),
    { dispatch: false },
  );

  submitJourneeSuccessNavigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(JourneeActions.submitJourneeSuccess),
        tap(() => void this.router.navigate(['/journees'])),
      ),
    { dispatch: false },
  );
}
