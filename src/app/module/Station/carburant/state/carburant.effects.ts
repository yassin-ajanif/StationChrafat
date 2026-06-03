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

  addDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.addDevisAchat),
      switchMap(({ draft }) =>
        this.api.addDevisAchat(draft).pipe(
          map((devisAchat) => CarburantActions.addDevisAchatSuccess({ devisAchat })),
          catchError((err) =>
            of(CarburantActions.addDevisAchatFailure({ error: err?.message ?? 'Erreur ajout devis achat' })),
          ),
        ),
      ),
    ),
  );

  updateDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.updateDevisAchat),
      switchMap(({ id, draft }) =>
        this.api.updateDevisAchat(id, draft).pipe(
          map((devisAchat) => CarburantActions.updateDevisAchatSuccess({ devisAchat })),
          catchError((err) =>
            of(CarburantActions.updateDevisAchatFailure({ error: err?.message ?? 'Erreur modification devis achat' })),
          ),
        ),
      ),
    ),
  );

  removeDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.removeDevisAchat),
      switchMap(({ id }) =>
        this.api.removeDevisAchat(id).pipe(
          map(() => CarburantActions.removeDevisAchatSuccess({ id })),
          catchError((err) =>
            of(CarburantActions.removeDevisAchatFailure({ error: err?.message ?? 'Erreur suppression devis achat' })),
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

  addCommandeAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.addCommandeAchat),
      switchMap(({ draft }) =>
        this.api.addCommandeAchat(draft).pipe(
          map((commandeAchat) => CarburantActions.addCommandeAchatSuccess({ commandeAchat })),
          catchError((err) =>
            of(CarburantActions.addCommandeAchatFailure({ error: err?.message ?? 'Erreur ajout commande achat' })),
          ),
        ),
      ),
    ),
  );

  updateCommandeAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.updateCommandeAchat),
      switchMap(({ id, draft }) =>
        this.api.updateCommandeAchat(id, draft).pipe(
          map((commandeAchat) => CarburantActions.updateCommandeAchatSuccess({ commandeAchat })),
          catchError((err) =>
            of(CarburantActions.updateCommandeAchatFailure({ error: err?.message ?? 'Erreur modification commande achat' })),
          ),
        ),
      ),
    ),
  );

  removeCommandeAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.removeCommandeAchat),
      switchMap(({ id }) =>
        this.api.removeCommandeAchat(id).pipe(
          map(() => CarburantActions.removeCommandeAchatSuccess({ id })),
          catchError((err) =>
            of(CarburantActions.removeCommandeAchatFailure({ error: err?.message ?? 'Erreur suppression commande achat' })),
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

  addReception$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.addReception),
      switchMap(({ draft }) =>
        this.api.addReception(draft).pipe(
          map((reception) => CarburantActions.addReceptionSuccess({ reception })),
          catchError((err) =>
            of(CarburantActions.addReceptionFailure({ error: err?.message ?? 'Erreur ajout réception' })),
          ),
        ),
      ),
    ),
  );

  updateReception$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.updateReception),
      switchMap(({ id, draft }) =>
        this.api.updateReception(id, draft).pipe(
          map((reception) => CarburantActions.updateReceptionSuccess({ reception })),
          catchError((err) =>
            of(CarburantActions.updateReceptionFailure({ error: err?.message ?? 'Erreur modification réception' })),
          ),
        ),
      ),
    ),
  );

  removeReception$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.removeReception),
      switchMap(({ id }) =>
        this.api.removeReception(id).pipe(
          map(() => CarburantActions.removeReceptionSuccess({ id })),
          catchError((err) =>
            of(CarburantActions.removeReceptionFailure({ error: err?.message ?? 'Erreur suppression réception' })),
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

  addFactureFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.addFactureFournisseur),
      switchMap(({ draft }) =>
        this.api.addFactureFournisseur(draft).pipe(
          map((factureFournisseur) => CarburantActions.addFactureFournisseurSuccess({ factureFournisseur })),
          catchError((err) =>
            of(CarburantActions.addFactureFournisseurFailure({ error: err?.message ?? 'Erreur ajout facture fournisseur' })),
          ),
        ),
      ),
    ),
  );

  updateFactureFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.updateFactureFournisseur),
      switchMap(({ id, draft }) =>
        this.api.updateFactureFournisseur(id, draft).pipe(
          map((factureFournisseur) => CarburantActions.updateFactureFournisseurSuccess({ factureFournisseur })),
          catchError((err) =>
            of(CarburantActions.updateFactureFournisseurFailure({ error: err?.message ?? 'Erreur modification facture fournisseur' })),
          ),
        ),
      ),
    ),
  );

  removeFactureFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.removeFactureFournisseur),
      switchMap(({ id }) =>
        this.api.removeFactureFournisseur(id).pipe(
          map(() => CarburantActions.removeFactureFournisseurSuccess({ id })),
          catchError((err) =>
            of(CarburantActions.removeFactureFournisseurFailure({ error: err?.message ?? 'Erreur suppression facture fournisseur' })),
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

  addAvoirFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.addAvoirFournisseur),
      switchMap(({ draft }) =>
        this.api.addAvoirFournisseur(draft).pipe(
          map((avoirFournisseur) => CarburantActions.addAvoirFournisseurSuccess({ avoirFournisseur })),
          catchError((err) =>
            of(CarburantActions.addAvoirFournisseurFailure({ error: err?.message ?? 'Erreur ajout avoir fournisseur' })),
          ),
        ),
      ),
    ),
  );

  updateAvoirFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.updateAvoirFournisseur),
      switchMap(({ id, draft }) =>
        this.api.updateAvoirFournisseur(id, draft).pipe(
          map((avoirFournisseur) => CarburantActions.updateAvoirFournisseurSuccess({ avoirFournisseur })),
          catchError((err) =>
            of(CarburantActions.updateAvoirFournisseurFailure({ error: err?.message ?? 'Erreur modification avoir fournisseur' })),
          ),
        ),
      ),
    ),
  );

  removeAvoirFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarburantActions.removeAvoirFournisseur),
      switchMap(({ id }) =>
        this.api.removeAvoirFournisseur(id).pipe(
          map(() => CarburantActions.removeAvoirFournisseurSuccess({ id })),
          catchError((err) =>
            of(CarburantActions.removeAvoirFournisseurFailure({ error: err?.message ?? 'Erreur suppression avoir fournisseur' })),
          ),
        ),
      ),
    ),
  );
}
