import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { CarburantApi } from '../data-access/carburant.api';
import { CarburantActions } from './carburant.actions';

@Injectable()
export class CarburantEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(CarburantApi);

  loadStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.loadStock),
      switchMap(() =>
        this.api.getStockOverview().pipe(
          map((overview) => CarburantActions.loadStockSuccess({ overview })),
          catchError((err) =>
            of(CarburantActions.loadStockFailure({ error: err?.message ?? 'Erreur chargement stock' })),
          ),
        ),
      ),
    ),
  );

  loadDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.loadDevis),
      switchMap(() =>
        this.api.getDevis().pipe(
          map((devis) => CarburantActions.loadDevisSuccess({ devis })),
          catchError((err) =>
            of(CarburantActions.loadDevisFailure({ error: err?.message ?? 'Erreur chargement devis' })),
          ),
        ),
      ),
    ),
  );

  addDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.addDevis),
      switchMap(({ draft }) =>
        this.api.addDevis(draft).pipe(
          map((devis) => CarburantActions.addDevisSuccess({ devis })),
          catchError((err) =>
            of(CarburantActions.addDevisFailure({ error: err?.message ?? 'Erreur ajout devis' })),
          ),
        ),
      ),
    ),
  );

  updateDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.updateDevis),
      switchMap(({ id, draft }) =>
        this.api.updateDevis(id, draft).pipe(
          map((devis) => CarburantActions.updateDevisSuccess({ devis })),
          catchError((err) =>
            of(CarburantActions.updateDevisFailure({ error: err?.message ?? 'Erreur modification devis' })),
          ),
        ),
      ),
    ),
  );

  removeDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.removeDevis),
      switchMap(({ id }) =>
        this.api.removeDevis(id).pipe(
          map(() => CarburantActions.removeDevisSuccess({ id })),
          catchError((err) =>
            of(CarburantActions.removeDevisFailure({ error: err?.message ?? 'Erreur suppression devis' })),
          ),
        ),
      ),
    ),
  );

  loadCommandes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.loadCommandes),
      switchMap(() =>
        this.api.getCommandes().pipe(
          map((commandes) => CarburantActions.loadCommandesSuccess({ commandes })),
          catchError((err) =>
            of(CarburantActions.loadCommandesFailure({ error: err?.message ?? 'Erreur chargement commandes' })),
          ),
        ),
      ),
    ),
  );

  loadLivraisons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.loadLivraisons),
      switchMap(() =>
        this.api.getLivraisons().pipe(
          map((livraisons) => CarburantActions.loadLivraisonsSuccess({ livraisons })),
          catchError((err) =>
            of(CarburantActions.loadLivraisonsFailure({ error: err?.message ?? 'Erreur chargement livraisons' })),
          ),
        ),
      ),
    ),
  );

  loadFactures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.loadFactures),
      switchMap(() =>
        this.api.getFactures().pipe(
          map((factures) => CarburantActions.loadFacturesSuccess({ factures })),
          catchError((err) =>
            of(CarburantActions.loadFacturesFailure({ error: err?.message ?? 'Erreur chargement factures' })),
          ),
        ),
      ),
    ),
  );

  loadAvoirs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.loadAvoirs),
      switchMap(() =>
        this.api.getAvoirs().pipe(
          map((avoirs) => CarburantActions.loadAvoirsSuccess({ avoirs })),
          catchError((err) =>
            of(CarburantActions.loadAvoirsFailure({ error: err?.message ?? 'Erreur chargement avoirs' })),
          ),
        ),
      ),
    ),
  );

  loadDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.loadDevisAchat),
      switchMap(() =>
        this.api.getDevisAchat().pipe(
          map((devisAchat) => CarburantActions.loadDevisAchatSuccess({ devisAchat })),
          catchError((err) =>
            of(CarburantActions.loadDevisAchatFailure({ error: err?.message ?? 'Erreur chargement devis achat' })),
          ),
        ),
      ),
    ),
  );

  loadCommandesAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.loadCommandesAchat),
      switchMap(() =>
        this.api.getCommandesAchat().pipe(
          map((commandesAchat) => CarburantActions.loadCommandesAchatSuccess({ commandesAchat })),
          catchError((err) =>
            of(CarburantActions.loadCommandesAchatFailure({ error: err?.message ?? 'Erreur chargement commandes achat' })),
          ),
        ),
      ),
    ),
  );

  loadReceptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.loadReceptions),
      switchMap(() =>
        this.api.getReceptions().pipe(
          map((receptions) => CarburantActions.loadReceptionsSuccess({ receptions })),
          catchError((err) =>
            of(CarburantActions.loadReceptionsFailure({ error: err?.message ?? 'Erreur chargement réceptions' })),
          ),
        ),
      ),
    ),
  );

  loadFacturesFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.loadFacturesFournisseur),
      switchMap(() =>
        this.api.getFacturesFournisseur().pipe(
          map((facturesFournisseur) => CarburantActions.loadFacturesFournisseurSuccess({ facturesFournisseur })),
          catchError((err) =>
            of(CarburantActions.loadFacturesFournisseurFailure({
              error: err?.message ?? 'Erreur chargement factures fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  loadAvoirsFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.loadAvoirsFournisseur),
      switchMap(() =>
        this.api.getAvoirsFournisseur().pipe(
          map((avoirsFournisseur) => CarburantActions.loadAvoirsFournisseurSuccess({ avoirsFournisseur })),
          catchError((err) =>
            of(CarburantActions.loadAvoirsFournisseurFailure({
              error: err?.message ?? 'Erreur chargement avoirs fournisseur',
            })),
          ),
        ),
      ),
    ),
  );
}
