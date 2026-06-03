import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { VidangeApi } from '../data-access/vidange.api';
import { VidangeActions } from './vidange.actions';

@Injectable()
export class VidangeEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(VidangeApi);

  loadStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadStock),
      switchMap(() =>
        this.api.getStockOverview().pipe(
          map((overview) => VidangeActions.loadStockSuccess({ overview })),
          catchError((err) =>
            of(VidangeActions.loadStockFailure({ error: err?.message ?? 'Erreur chargement stock' })),
          ),
        ),
      ),
    ),
  );

  loadDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadDevis),
      switchMap(() =>
        this.api.getDevis().pipe(
          map((devis) => VidangeActions.loadDevisSuccess({ devis })),
          catchError((err) =>
            of(VidangeActions.loadDevisFailure({ error: err?.message ?? 'Erreur chargement devis' })),
          ),
        ),
      ),
    ),
  );

  addDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.addDevis),
      switchMap(({ draft }) =>
        this.api.addDevis(draft).pipe(
          map((devis) => VidangeActions.addDevisSuccess({ devis })),
          catchError((err) =>
            of(VidangeActions.addDevisFailure({ error: err?.message ?? 'Erreur ajout devis' })),
          ),
        ),
      ),
    ),
  );

  updateDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.updateDevis),
      switchMap(({ id, draft }) =>
        this.api.updateDevis(id, draft).pipe(
          map((devis) => VidangeActions.updateDevisSuccess({ devis })),
          catchError((err) =>
            of(VidangeActions.updateDevisFailure({ error: err?.message ?? 'Erreur modification devis' })),
          ),
        ),
      ),
    ),
  );

  removeDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.removeDevis),
      switchMap(({ id }) =>
        this.api.removeDevis(id).pipe(
          map(() => VidangeActions.removeDevisSuccess({ id })),
          catchError((err) =>
            of(VidangeActions.removeDevisFailure({ error: err?.message ?? 'Erreur suppression devis' })),
          ),
        ),
      ),
    ),
  );

  loadCommandes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadCommandes),
      switchMap(() =>
        this.api.getCommandes().pipe(
          map((commandes) => VidangeActions.loadCommandesSuccess({ commandes })),
          catchError((err) =>
            of(VidangeActions.loadCommandesFailure({ error: err?.message ?? 'Erreur chargement commandes' })),
          ),
        ),
      ),
    ),
  );

  loadLivraisons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadLivraisons),
      switchMap(() =>
        this.api.getLivraisons().pipe(
          map((livraisons) => VidangeActions.loadLivraisonsSuccess({ livraisons })),
          catchError((err) =>
            of(VidangeActions.loadLivraisonsFailure({ error: err?.message ?? 'Erreur chargement livraisons' })),
          ),
        ),
      ),
    ),
  );

  loadFactures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadFactures),
      switchMap(() =>
        this.api.getFactures().pipe(
          map((factures) => VidangeActions.loadFacturesSuccess({ factures })),
          catchError((err) =>
            of(VidangeActions.loadFacturesFailure({ error: err?.message ?? 'Erreur chargement factures' })),
          ),
        ),
      ),
    ),
  );

  loadAvoirs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadAvoirs),
      switchMap(() =>
        this.api.getAvoirs().pipe(
          map((avoirs) => VidangeActions.loadAvoirsSuccess({ avoirs })),
          catchError((err) =>
            of(VidangeActions.loadAvoirsFailure({ error: err?.message ?? 'Erreur chargement avoirs' })),
          ),
        ),
      ),
    ),
  );

  loadDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadDevisAchat),
      switchMap(() =>
        this.api.getDevisAchat().pipe(
          map((devisAchat) => VidangeActions.loadDevisAchatSuccess({ devisAchat })),
          catchError((err) =>
            of(VidangeActions.loadDevisAchatFailure({ error: err?.message ?? 'Erreur chargement devis achat' })),
          ),
        ),
      ),
    ),
  );

  loadCommandesAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadCommandesAchat),
      switchMap(() =>
        this.api.getCommandesAchat().pipe(
          map((commandesAchat) => VidangeActions.loadCommandesAchatSuccess({ commandesAchat })),
          catchError((err) =>
            of(VidangeActions.loadCommandesAchatFailure({ error: err?.message ?? 'Erreur chargement commandes achat' })),
          ),
        ),
      ),
    ),
  );

  loadReceptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadReceptions),
      switchMap(() =>
        this.api.getReceptions().pipe(
          map((receptions) => VidangeActions.loadReceptionsSuccess({ receptions })),
          catchError((err) =>
            of(VidangeActions.loadReceptionsFailure({ error: err?.message ?? 'Erreur chargement réceptions' })),
          ),
        ),
      ),
    ),
  );

  loadFacturesFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadFacturesFournisseur),
      switchMap(() =>
        this.api.getFacturesFournisseur().pipe(
          map((facturesFournisseur) => VidangeActions.loadFacturesFournisseurSuccess({ facturesFournisseur })),
          catchError((err) =>
            of(VidangeActions.loadFacturesFournisseurFailure({
              error: err?.message ?? 'Erreur chargement factures fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  loadAvoirsFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadAvoirsFournisseur),
      switchMap(() =>
        this.api.getAvoirsFournisseur().pipe(
          map((avoirsFournisseur) => VidangeActions.loadAvoirsFournisseurSuccess({ avoirsFournisseur })),
          catchError((err) =>
            of(VidangeActions.loadAvoirsFournisseurFailure({
              error: err?.message ?? 'Erreur chargement avoirs fournisseur',
            })),
          ),
        ),
      ),
    ),
  );
}
