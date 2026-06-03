import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { LavageApi } from '../data-access/lavage.api';
import { LavageActions } from './lavage.actions';

@Injectable()
export class LavageEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(LavageApi);

  loadStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadStock),
      switchMap(() =>
        this.api.getStockOverview().pipe(
          map((overview) => LavageActions.loadStockSuccess({ overview })),
          catchError((err) =>
            of(LavageActions.loadStockFailure({ error: err?.message ?? 'Erreur chargement stock' })),
          ),
        ),
      ),
    ),
  );

  loadDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadDevis),
      switchMap(() =>
        this.api.getDevis().pipe(
          map((devis) => LavageActions.loadDevisSuccess({ devis })),
          catchError((err) =>
            of(LavageActions.loadDevisFailure({ error: err?.message ?? 'Erreur chargement devis' })),
          ),
        ),
      ),
    ),
  );

  addDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.addDevis),
      switchMap(({ draft }) =>
        this.api.addDevis(draft).pipe(
          map((devis) => LavageActions.addDevisSuccess({ devis })),
          catchError((err) =>
            of(LavageActions.addDevisFailure({ error: err?.message ?? 'Erreur ajout devis' })),
          ),
        ),
      ),
    ),
  );

  updateDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.updateDevis),
      switchMap(({ id, draft }) =>
        this.api.updateDevis(id, draft).pipe(
          map((devis) => LavageActions.updateDevisSuccess({ devis })),
          catchError((err) =>
            of(LavageActions.updateDevisFailure({ error: err?.message ?? 'Erreur modification devis' })),
          ),
        ),
      ),
    ),
  );

  removeDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.removeDevis),
      switchMap(({ id }) =>
        this.api.removeDevis(id).pipe(
          map(() => LavageActions.removeDevisSuccess({ id })),
          catchError((err) =>
            of(LavageActions.removeDevisFailure({ error: err?.message ?? 'Erreur suppression devis' })),
          ),
        ),
      ),
    ),
  );

  loadCommandes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadCommandes),
      switchMap(() =>
        this.api.getCommandes().pipe(
          map((commandes) => LavageActions.loadCommandesSuccess({ commandes })),
          catchError((err) =>
            of(LavageActions.loadCommandesFailure({ error: err?.message ?? 'Erreur chargement commandes' })),
          ),
        ),
      ),
    ),
  );

  addCommande$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.addCommande),
      switchMap(({ draft }) =>
        this.api.addCommande(draft).pipe(
          map((commande) => LavageActions.addCommandeSuccess({ commande })),
          catchError((err) =>
            of(LavageActions.addCommandeFailure({ error: err?.message ?? 'Erreur ajout commande' })),
          ),
        ),
      ),
    ),
  );

  updateCommande$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.updateCommande),
      switchMap(({ id, draft }) =>
        this.api.updateCommande(id, draft).pipe(
          map((commande) => LavageActions.updateCommandeSuccess({ commande })),
          catchError((err) =>
            of(LavageActions.updateCommandeFailure({ error: err?.message ?? 'Erreur modification commande' })),
          ),
        ),
      ),
    ),
  );

  removeCommande$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.removeCommande),
      switchMap(({ id }) =>
        this.api.removeCommande(id).pipe(
          map(() => LavageActions.removeCommandeSuccess({ id })),
          catchError((err) =>
            of(LavageActions.removeCommandeFailure({ error: err?.message ?? 'Erreur suppression commande' })),
          ),
        ),
      ),
    ),
  );

  loadLivraisons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadLivraisons),
      switchMap(() =>
        this.api.getLivraisons().pipe(
          map((livraisons) => LavageActions.loadLivraisonsSuccess({ livraisons })),
          catchError((err) =>
            of(LavageActions.loadLivraisonsFailure({ error: err?.message ?? 'Erreur chargement livraisons' })),
          ),
        ),
      ),
    ),
  );

  addLivraison$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.addLivraison),
      switchMap(({ draft }) =>
        this.api.addLivraison(draft).pipe(
          map((livraison) => LavageActions.addLivraisonSuccess({ livraison })),
          catchError((err) =>
            of(LavageActions.addLivraisonFailure({ error: err?.message ?? 'Erreur ajout livraison' })),
          ),
        ),
      ),
    ),
  );

  updateLivraison$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.updateLivraison),
      switchMap(({ id, draft }) =>
        this.api.updateLivraison(id, draft).pipe(
          map((livraison) => LavageActions.updateLivraisonSuccess({ livraison })),
          catchError((err) =>
            of(LavageActions.updateLivraisonFailure({ error: err?.message ?? 'Erreur modification livraison' })),
          ),
        ),
      ),
    ),
  );

  removeLivraison$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.removeLivraison),
      switchMap(({ id }) =>
        this.api.removeLivraison(id).pipe(
          map(() => LavageActions.removeLivraisonSuccess({ id })),
          catchError((err) =>
            of(LavageActions.removeLivraisonFailure({ error: err?.message ?? 'Erreur suppression livraison' })),
          ),
        ),
      ),
    ),
  );

  loadFactures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadFactures),
      switchMap(() =>
        this.api.getFactures().pipe(
          map((factures) => LavageActions.loadFacturesSuccess({ factures })),
          catchError((err) =>
            of(LavageActions.loadFacturesFailure({ error: err?.message ?? 'Erreur chargement factures' })),
          ),
        ),
      ),
    ),
  );

  addFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.addFacture),
      switchMap(({ draft }) =>
        this.api.addFacture(draft).pipe(
          map((facture) => LavageActions.addFactureSuccess({ facture })),
          catchError((err) =>
            of(LavageActions.addFactureFailure({ error: err?.message ?? 'Erreur ajout facture' })),
          ),
        ),
      ),
    ),
  );

  updateFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.updateFacture),
      switchMap(({ id, draft }) =>
        this.api.updateFacture(id, draft).pipe(
          map((facture) => LavageActions.updateFactureSuccess({ facture })),
          catchError((err) =>
            of(LavageActions.updateFactureFailure({ error: err?.message ?? 'Erreur modification facture' })),
          ),
        ),
      ),
    ),
  );

  removeFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.removeFacture),
      switchMap(({ id }) =>
        this.api.removeFacture(id).pipe(
          map(() => LavageActions.removeFactureSuccess({ id })),
          catchError((err) =>
            of(LavageActions.removeFactureFailure({ error: err?.message ?? 'Erreur suppression facture' })),
          ),
        ),
      ),
    ),
  );

  loadAvoirs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadAvoirs),
      switchMap(() =>
        this.api.getAvoirs().pipe(
          map((avoirs) => LavageActions.loadAvoirsSuccess({ avoirs })),
          catchError((err) =>
            of(LavageActions.loadAvoirsFailure({ error: err?.message ?? 'Erreur chargement avoirs' })),
          ),
        ),
      ),
    ),
  );

  addAvoir$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.addAvoir),
      switchMap(({ draft }) =>
        this.api.addAvoir(draft).pipe(
          map((avoir) => LavageActions.addAvoirSuccess({ avoir })),
          catchError((err) =>
            of(LavageActions.addAvoirFailure({ error: err?.message ?? 'Erreur ajout avoir' })),
          ),
        ),
      ),
    ),
  );

  updateAvoir$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.updateAvoir),
      switchMap(({ id, draft }) =>
        this.api.updateAvoir(id, draft).pipe(
          map((avoir) => LavageActions.updateAvoirSuccess({ avoir })),
          catchError((err) =>
            of(LavageActions.updateAvoirFailure({ error: err?.message ?? 'Erreur modification avoir' })),
          ),
        ),
      ),
    ),
  );

  removeAvoir$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.removeAvoir),
      switchMap(({ id }) =>
        this.api.removeAvoir(id).pipe(
          map(() => LavageActions.removeAvoirSuccess({ id })),
          catchError((err) =>
            of(LavageActions.removeAvoirFailure({ error: err?.message ?? 'Erreur suppression avoir' })),
          ),
        ),
      ),
    ),
  );

  loadDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadDevisAchat),
      switchMap(() =>
        this.api.getDevisAchat().pipe(
          map((devisAchat) => LavageActions.loadDevisAchatSuccess({ devisAchat })),
          catchError((err) =>
            of(LavageActions.loadDevisAchatFailure({ error: err?.message ?? 'Erreur chargement devis achat' })),
          ),
        ),
      ),
    ),
  );

  addDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.addDevisAchat),
      switchMap(({ draft }) =>
        this.api.addDevisAchat(draft).pipe(
          map((devisAchat) => LavageActions.addDevisAchatSuccess({ devisAchat })),
          catchError((err) =>
            of(LavageActions.addDevisAchatFailure({ error: err?.message ?? 'Erreur ajout devis achat' })),
          ),
        ),
      ),
    ),
  );

  updateDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.updateDevisAchat),
      switchMap(({ id, draft }) =>
        this.api.updateDevisAchat(id, draft).pipe(
          map((devisAchat) => LavageActions.updateDevisAchatSuccess({ devisAchat })),
          catchError((err) =>
            of(LavageActions.updateDevisAchatFailure({ error: err?.message ?? 'Erreur modification devis achat' })),
          ),
        ),
      ),
    ),
  );

  removeDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.removeDevisAchat),
      switchMap(({ id }) =>
        this.api.removeDevisAchat(id).pipe(
          map(() => LavageActions.removeDevisAchatSuccess({ id })),
          catchError((err) =>
            of(LavageActions.removeDevisAchatFailure({ error: err?.message ?? 'Erreur suppression devis achat' })),
          ),
        ),
      ),
    ),
  );

  loadCommandesAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadCommandesAchat),
      switchMap(() =>
        this.api.getCommandesAchat().pipe(
          map((commandesAchat) => LavageActions.loadCommandesAchatSuccess({ commandesAchat })),
          catchError((err) =>
            of(LavageActions.loadCommandesAchatFailure({ error: err?.message ?? 'Erreur chargement commandes achat' })),
          ),
        ),
      ),
    ),
  );

  addCommandeAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.addCommandeAchat),
      switchMap(({ draft }) =>
        this.api.addCommandeAchat(draft).pipe(
          map((commandeAchat) => LavageActions.addCommandeAchatSuccess({ commandeAchat })),
          catchError((err) =>
            of(LavageActions.addCommandeAchatFailure({ error: err?.message ?? 'Erreur ajout commande achat' })),
          ),
        ),
      ),
    ),
  );

  updateCommandeAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.updateCommandeAchat),
      switchMap(({ id, draft }) =>
        this.api.updateCommandeAchat(id, draft).pipe(
          map((commandeAchat) => LavageActions.updateCommandeAchatSuccess({ commandeAchat })),
          catchError((err) =>
            of(LavageActions.updateCommandeAchatFailure({
              error: err?.message ?? 'Erreur modification commande achat',
            })),
          ),
        ),
      ),
    ),
  );

  removeCommandeAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.removeCommandeAchat),
      switchMap(({ id }) =>
        this.api.removeCommandeAchat(id).pipe(
          map(() => LavageActions.removeCommandeAchatSuccess({ id })),
          catchError((err) =>
            of(LavageActions.removeCommandeAchatFailure({
              error: err?.message ?? 'Erreur suppression commande achat',
            })),
          ),
        ),
      ),
    ),
  );

  loadReceptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadReceptions),
      switchMap(() =>
        this.api.getReceptions().pipe(
          map((receptions) => LavageActions.loadReceptionsSuccess({ receptions })),
          catchError((err) =>
            of(LavageActions.loadReceptionsFailure({ error: err?.message ?? 'Erreur chargement réceptions' })),
          ),
        ),
      ),
    ),
  );

  addReception$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.addReception),
      switchMap(({ draft }) =>
        this.api.addReception(draft).pipe(
          map((reception) => LavageActions.addReceptionSuccess({ reception })),
          catchError((err) =>
            of(LavageActions.addReceptionFailure({ error: err?.message ?? 'Erreur ajout réception' })),
          ),
        ),
      ),
    ),
  );

  updateReception$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.updateReception),
      switchMap(({ id, draft }) =>
        this.api.updateReception(id, draft).pipe(
          map((reception) => LavageActions.updateReceptionSuccess({ reception })),
          catchError((err) =>
            of(LavageActions.updateReceptionFailure({ error: err?.message ?? 'Erreur modification réception' })),
          ),
        ),
      ),
    ),
  );

  removeReception$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.removeReception),
      switchMap(({ id }) =>
        this.api.removeReception(id).pipe(
          map(() => LavageActions.removeReceptionSuccess({ id })),
          catchError((err) =>
            of(LavageActions.removeReceptionFailure({ error: err?.message ?? 'Erreur suppression réception' })),
          ),
        ),
      ),
    ),
  );

  loadFacturesFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadFacturesFournisseur),
      switchMap(() =>
        this.api.getFacturesFournisseur().pipe(
          map((facturesFournisseur) => LavageActions.loadFacturesFournisseurSuccess({ facturesFournisseur })),
          catchError((err) =>
            of(LavageActions.loadFacturesFournisseurFailure({
              error: err?.message ?? 'Erreur chargement factures fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  addFactureFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.addFactureFournisseur),
      switchMap(({ draft }) =>
        this.api.addFactureFournisseur(draft).pipe(
          map((factureFournisseur) => LavageActions.addFactureFournisseurSuccess({ factureFournisseur })),
          catchError((err) =>
            of(LavageActions.addFactureFournisseurFailure({
              error: err?.message ?? 'Erreur ajout facture fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  updateFactureFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.updateFactureFournisseur),
      switchMap(({ id, draft }) =>
        this.api.updateFactureFournisseur(id, draft).pipe(
          map((factureFournisseur) => LavageActions.updateFactureFournisseurSuccess({ factureFournisseur })),
          catchError((err) =>
            of(LavageActions.updateFactureFournisseurFailure({
              error: err?.message ?? 'Erreur modification facture fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  removeFactureFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.removeFactureFournisseur),
      switchMap(({ id }) =>
        this.api.removeFactureFournisseur(id).pipe(
          map(() => LavageActions.removeFactureFournisseurSuccess({ id })),
          catchError((err) =>
            of(LavageActions.removeFactureFournisseurFailure({
              error: err?.message ?? 'Erreur suppression facture fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  loadAvoirsFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadAvoirsFournisseur),
      switchMap(() =>
        this.api.getAvoirsFournisseur().pipe(
          map((avoirsFournisseur) => LavageActions.loadAvoirsFournisseurSuccess({ avoirsFournisseur })),
          catchError((err) =>
            of(LavageActions.loadAvoirsFournisseurFailure({
              error: err?.message ?? 'Erreur chargement avoirs fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  addAvoirFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.addAvoirFournisseur),
      switchMap(({ draft }) =>
        this.api.addAvoirFournisseur(draft).pipe(
          map((avoirFournisseur) => LavageActions.addAvoirFournisseurSuccess({ avoirFournisseur })),
          catchError((err) =>
            of(LavageActions.addAvoirFournisseurFailure({
              error: err?.message ?? 'Erreur ajout avoir fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  updateAvoirFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.updateAvoirFournisseur),
      switchMap(({ id, draft }) =>
        this.api.updateAvoirFournisseur(id, draft).pipe(
          map((avoirFournisseur) => LavageActions.updateAvoirFournisseurSuccess({ avoirFournisseur })),
          catchError((err) =>
            of(LavageActions.updateAvoirFournisseurFailure({
              error: err?.message ?? 'Erreur modification avoir fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  removeAvoirFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.removeAvoirFournisseur),
      switchMap(({ id }) =>
        this.api.removeAvoirFournisseur(id).pipe(
          map(() => LavageActions.removeAvoirFournisseurSuccess({ id })),
          catchError((err) =>
            of(LavageActions.removeAvoirFournisseurFailure({
              error: err?.message ?? 'Erreur suppression avoir fournisseur',
            })),
          ),
        ),
      ),
    ),
  );
}
