import { createFeature, createReducer, on } from '@ngrx/store';
import { AvoirFournisseur, CommandeAchat, DevisAchat, FactureFournisseur, Reception } from '../models/achat';
import { Avoir, Commande, Devis, Facture, Livraison } from '../models/ventes';
import { StockOverview } from '../models/stock-overview';
import { RetourFournisseur } from '../models/achat';
import { Retour } from '../models/ventes';
import { ErpActions } from './erp.actions';

export interface ErpState {
  stockOverview: StockOverview | null;
  stockLoading: boolean;
  stockError: string | null;
  devis: Devis[];
  devisLoading: boolean;
  devisError: string | null;
  devisSaving: boolean;
  commandes: Commande[];
  commandesLoading: boolean;
  commandesError: string | null;
  commandesSaving: boolean;
  livraisons: Livraison[];
  livraisonsLoading: boolean;
  livraisonsError: string | null;
  livraisonsSaving: boolean;
  factures: Facture[];
  facturesLoading: boolean;
  facturesError: string | null;
  facturesSaving: boolean;
  avoirs: Avoir[];
  avoirsLoading: boolean;
  avoirsError: string | null;
  avoirsSaving: boolean;
  devisAchat: DevisAchat[];
  devisAchatLoading: boolean;
  devisAchatError: string | null;
  devisAchatSaving: boolean;
  commandesAchat: CommandeAchat[];
  commandesAchatLoading: boolean;
  commandesAchatError: string | null;
  commandesAchatSaving: boolean;
  receptions: Reception[];
  receptionsLoading: boolean;
  receptionsError: string | null;
  receptionsSaving: boolean;
  facturesFournisseur: FactureFournisseur[];
  facturesFournisseurLoading: boolean;
  facturesFournisseurError: string | null;
  facturesFournisseurSaving: boolean;
  avoirsFournisseur: AvoirFournisseur[];
  avoirsFournisseurLoading: boolean;
  avoirsFournisseurError: string | null;
  avoirsFournisseurSaving: boolean;
  retours: Retour[];
  retoursLoading: boolean;
  retoursError: string | null;
  retoursSaving: boolean;
  retoursFournisseur: RetourFournisseur[];
  retoursFournisseurLoading: boolean;
  retoursFournisseurError: string | null;
  retoursFournisseurSaving: boolean;
}

export const initialErpState: ErpState = {
  stockOverview: null,
  stockLoading: false,
  stockError: null,
  devis: [],
  devisLoading: false,
  devisError: null,
  devisSaving: false,
  commandes: [],
  commandesLoading: false,
  commandesError: null,
  commandesSaving: false,
  livraisons: [],
  livraisonsLoading: false,
  livraisonsError: null,
  livraisonsSaving: false,
  factures: [],
  facturesLoading: false,
  facturesError: null,
  facturesSaving: false,
  avoirs: [],
  avoirsLoading: false,
  avoirsError: null,
  avoirsSaving: false,
  devisAchat: [],
  devisAchatLoading: false,
  devisAchatError: null,
  devisAchatSaving: false,
  commandesAchat: [],
  commandesAchatLoading: false,
  commandesAchatError: null,
  commandesAchatSaving: false,
  receptions: [],
  receptionsLoading: false,
  receptionsError: null,
  receptionsSaving: false,
  facturesFournisseur: [],
  facturesFournisseurLoading: false,
  facturesFournisseurError: null,
  facturesFournisseurSaving: false,
  avoirsFournisseur: [],
  avoirsFournisseurLoading: false,
  avoirsFournisseurError: null,
  avoirsFournisseurSaving: false,
  retours: [],
  retoursLoading: false,
  retoursError: null,
  retoursSaving: false,
  retoursFournisseur: [],
  retoursFournisseurLoading: false,
  retoursFournisseurError: null,
  retoursFournisseurSaving: false,
};

export const erpFeature = createFeature({
  name: 'Erp',
  reducer: createReducer(
    initialErpState,

    on(ErpActions.loadStock, (state) => ({
      ...state,
      stockLoading: true,
      stockError: null,
    })),
    on(ErpActions.loadStockSuccess, (state, { overview }) => ({
      ...state,
      stockLoading: false,
      stockOverview: overview,
    })),
    on(ErpActions.loadStockFailure, (state, { error }) => ({
      ...state,
      stockLoading: false,
      stockError: error,
    })),

    on(ErpActions.loadDevis, (state) => ({
      ...state,
      devisLoading: true,
      devisError: null,
    })),
    on(ErpActions.loadDevisSuccess, (state, { devis }) => ({
      ...state,
      devisLoading: false,
      devis,
    })),
    on(ErpActions.loadDevisFailure, (state, { error }) => ({
      ...state,
      devisLoading: false,
      devisError: error,
    })),

    on(ErpActions.addDevis, ErpActions.updateDevis, ErpActions.removeDevis, (state) => ({
      ...state,
      devisSaving: true,
    })),
    on(ErpActions.addDevisSuccess, (state, { devis }) => ({
      ...state,
      devisSaving: false,
      devis: [...state.devis, devis],
    })),
    on(ErpActions.updateDevisSuccess, (state, { devis }) => ({
      ...state,
      devisSaving: false,
      devis: state.devis.map((d) => (d.id === devis.id ? devis : d)),
    })),
    on(ErpActions.removeDevisSuccess, (state, { id }) => ({
      ...state,
      devisSaving: false,
      devis: state.devis.filter((d) => d.id !== id),
    })),
    on(
      ErpActions.addDevisFailure,
      ErpActions.updateDevisFailure,
      ErpActions.removeDevisFailure,
      (state) => ({
        ...state,
        devisSaving: false,
      }),
    ),

    on(ErpActions.loadCommandes, (state) => ({
      ...state,
      commandesLoading: true,
      commandesError: null,
    })),
    on(ErpActions.loadCommandesSuccess, (state, { commandes }) => ({
      ...state,
      commandesLoading: false,
      commandes,
    })),
    on(ErpActions.loadCommandesFailure, (state, { error }) => ({
      ...state,
      commandesLoading: false,
      commandesError: error,
    })),

    on(ErpActions.addCommande, ErpActions.updateCommande, ErpActions.removeCommande, (state) => ({
      ...state,
      commandesSaving: true,
    })),
    on(ErpActions.addCommandeSuccess, (state, { commande }) => ({
      ...state,
      commandesSaving: false,
      commandes: [...state.commandes, commande],
    })),
    on(ErpActions.updateCommandeSuccess, (state, { commande }) => ({
      ...state,
      commandesSaving: false,
      commandes: state.commandes.map((c) => (c.id === commande.id ? commande : c)),
    })),
    on(ErpActions.removeCommandeSuccess, (state, { id }) => ({
      ...state,
      commandesSaving: false,
      commandes: state.commandes.filter((c) => c.id !== id),
    })),
    on(
      ErpActions.addCommandeFailure,
      ErpActions.updateCommandeFailure,
      ErpActions.removeCommandeFailure,
      (state) => ({
        ...state,
        commandesSaving: false,
      }),
    ),

    on(ErpActions.loadLivraisons, (state) => ({
      ...state,
      livraisonsLoading: true,
      livraisonsError: null,
    })),
    on(ErpActions.loadLivraisonsSuccess, (state, { livraisons }) => ({
      ...state,
      livraisonsLoading: false,
      livraisons,
    })),
    on(ErpActions.loadLivraisonsFailure, (state, { error }) => ({
      ...state,
      livraisonsLoading: false,
      livraisonsError: error,
    })),

    on(ErpActions.addLivraison, ErpActions.updateLivraison, ErpActions.removeLivraison, (state) => ({
      ...state,
      livraisonsSaving: true,
    })),
    on(ErpActions.addLivraisonSuccess, (state, { livraison }) => ({
      ...state,
      livraisonsSaving: false,
      livraisons: [...state.livraisons, livraison],
    })),
    on(ErpActions.updateLivraisonSuccess, (state, { livraison }) => ({
      ...state,
      livraisonsSaving: false,
      livraisons: state.livraisons.map((l) => (l.id === livraison.id ? livraison : l)),
    })),
    on(ErpActions.removeLivraisonSuccess, (state, { id }) => ({
      ...state,
      livraisonsSaving: false,
      livraisons: state.livraisons.filter((l) => l.id !== id),
    })),
    on(
      ErpActions.addLivraisonFailure,
      ErpActions.updateLivraisonFailure,
      ErpActions.removeLivraisonFailure,
      (state) => ({
        ...state,
        livraisonsSaving: false,
      }),
    ),

    on(ErpActions.loadFactures, (state) => ({
      ...state,
      facturesLoading: true,
      facturesError: null,
    })),
    on(ErpActions.loadFacturesSuccess, (state, { factures }) => ({
      ...state,
      facturesLoading: false,
      factures,
    })),
    on(ErpActions.loadFacturesFailure, (state, { error }) => ({
      ...state,
      facturesLoading: false,
      facturesError: error,
    })),

    on(ErpActions.addFacture, ErpActions.updateFacture, ErpActions.removeFacture, (state) => ({
      ...state,
      facturesSaving: true,
    })),
    on(ErpActions.addFactureSuccess, (state, { facture }) => ({
      ...state,
      facturesSaving: false,
      factures: [...state.factures, facture],
    })),
    on(ErpActions.updateFactureSuccess, (state, { facture }) => ({
      ...state,
      facturesSaving: false,
      factures: state.factures.map((f) => (f.id === facture.id ? facture : f)),
    })),
    on(ErpActions.removeFactureSuccess, (state, { id }) => ({
      ...state,
      facturesSaving: false,
      factures: state.factures.filter((f) => f.id !== id),
    })),
    on(
      ErpActions.addFactureFailure,
      ErpActions.updateFactureFailure,
      ErpActions.removeFactureFailure,
      (state) => ({
        ...state,
        facturesSaving: false,
      }),
    ),

    on(ErpActions.loadAvoirs, (state) => ({
      ...state,
      avoirsLoading: true,
      avoirsError: null,
    })),
    on(ErpActions.loadAvoirsSuccess, (state, { avoirs }) => ({
      ...state,
      avoirsLoading: false,
      avoirs,
    })),
    on(ErpActions.loadAvoirsFailure, (state, { error }) => ({
      ...state,
      avoirsLoading: false,
      avoirsError: error,
    })),

    on(ErpActions.addAvoir, ErpActions.updateAvoir, ErpActions.removeAvoir, (state) => ({
      ...state,
      avoirsSaving: true,
    })),
    on(ErpActions.addAvoirSuccess, (state, { avoir }) => ({
      ...state,
      avoirsSaving: false,
      avoirs: [...state.avoirs, avoir],
    })),
    on(ErpActions.updateAvoirSuccess, (state, { avoir }) => ({
      ...state,
      avoirsSaving: false,
      avoirs: state.avoirs.map((a) => (a.id === avoir.id ? avoir : a)),
    })),
    on(ErpActions.removeAvoirSuccess, (state, { id }) => ({
      ...state,
      avoirsSaving: false,
      avoirs: state.avoirs.filter((a) => a.id !== id),
    })),
    on(
      ErpActions.addAvoirFailure,
      ErpActions.updateAvoirFailure,
      ErpActions.removeAvoirFailure,
      (state) => ({
        ...state,
        avoirsSaving: false,
      }),
    ),

    on(ErpActions.loadDevisAchat, (state) => ({
      ...state,
      devisAchatLoading: true,
      devisAchatError: null,
    })),
    on(ErpActions.loadDevisAchatSuccess, (state, { devisAchat }) => ({
      ...state,
      devisAchatLoading: false,
      devisAchat,
    })),
    on(ErpActions.loadDevisAchatFailure, (state, { error }) => ({
      ...state,
      devisAchatLoading: false,
      devisAchatError: error,
    })),

    on(ErpActions.addDevisAchat, ErpActions.updateDevisAchat, ErpActions.removeDevisAchat, (state) => ({
      ...state,
      devisAchatSaving: true,
    })),
    on(ErpActions.addDevisAchatSuccess, (state, { devisAchat }) => ({
      ...state,
      devisAchatSaving: false,
      devisAchat: [...state.devisAchat, devisAchat],
    })),
    on(ErpActions.updateDevisAchatSuccess, (state, { devisAchat }) => ({
      ...state,
      devisAchatSaving: false,
      devisAchat: state.devisAchat.map((d) => (d.id === devisAchat.id ? devisAchat : d)),
    })),
    on(ErpActions.removeDevisAchatSuccess, (state, { id }) => ({
      ...state,
      devisAchatSaving: false,
      devisAchat: state.devisAchat.filter((d) => d.id !== id),
    })),
    on(
      ErpActions.addDevisAchatFailure,
      ErpActions.updateDevisAchatFailure,
      ErpActions.removeDevisAchatFailure,
      (state) => ({
        ...state,
        devisAchatSaving: false,
      }),
    ),

    on(ErpActions.loadCommandesAchat, (state) => ({
      ...state,
      commandesAchatLoading: true,
      commandesAchatError: null,
    })),
    on(ErpActions.loadCommandesAchatSuccess, (state, { commandesAchat }) => ({
      ...state,
      commandesAchatLoading: false,
      commandesAchat,
    })),
    on(ErpActions.loadCommandesAchatFailure, (state, { error }) => ({
      ...state,
      commandesAchatLoading: false,
      commandesAchatError: error,
    })),

    on(
      ErpActions.addCommandeAchat,
      ErpActions.updateCommandeAchat,
      ErpActions.removeCommandeAchat,
      (state) => ({
        ...state,
        commandesAchatSaving: true,
      }),
    ),
    on(ErpActions.addCommandeAchatSuccess, (state, { commandeAchat }) => ({
      ...state,
      commandesAchatSaving: false,
      commandesAchat: [...state.commandesAchat, commandeAchat],
    })),
    on(ErpActions.updateCommandeAchatSuccess, (state, { commandeAchat }) => ({
      ...state,
      commandesAchatSaving: false,
      commandesAchat: state.commandesAchat.map((c) =>
        c.id === commandeAchat.id ? commandeAchat : c,
      ),
    })),
    on(ErpActions.removeCommandeAchatSuccess, (state, { id }) => ({
      ...state,
      commandesAchatSaving: false,
      commandesAchat: state.commandesAchat.filter((c) => c.id !== id),
    })),
    on(
      ErpActions.addCommandeAchatFailure,
      ErpActions.updateCommandeAchatFailure,
      ErpActions.removeCommandeAchatFailure,
      (state) => ({
        ...state,
        commandesAchatSaving: false,
      }),
    ),

    on(ErpActions.loadReceptions, (state) => ({
      ...state,
      receptionsLoading: true,
      receptionsError: null,
    })),
    on(ErpActions.loadReceptionsSuccess, (state, { receptions }) => ({
      ...state,
      receptionsLoading: false,
      receptions,
    })),
    on(ErpActions.loadReceptionsFailure, (state, { error }) => ({
      ...state,
      receptionsLoading: false,
      receptionsError: error,
    })),

    on(ErpActions.addReception, ErpActions.updateReception, ErpActions.removeReception, (state) => ({
      ...state,
      receptionsSaving: true,
    })),
    on(ErpActions.addReceptionSuccess, (state, { reception }) => ({
      ...state,
      receptionsSaving: false,
      receptions: [...state.receptions, reception],
    })),
    on(ErpActions.updateReceptionSuccess, (state, { reception }) => ({
      ...state,
      receptionsSaving: false,
      receptions: state.receptions.map((r) => (r.id === reception.id ? reception : r)),
    })),
    on(ErpActions.removeReceptionSuccess, (state, { id }) => ({
      ...state,
      receptionsSaving: false,
      receptions: state.receptions.filter((r) => r.id !== id),
    })),
    on(
      ErpActions.addReceptionFailure,
      ErpActions.updateReceptionFailure,
      ErpActions.removeReceptionFailure,
      (state) => ({
        ...state,
        receptionsSaving: false,
      }),
    ),

    on(ErpActions.loadFacturesFournisseur, (state) => ({
      ...state,
      facturesFournisseurLoading: true,
      facturesFournisseurError: null,
    })),
    on(ErpActions.loadFacturesFournisseurSuccess, (state, { facturesFournisseur }) => ({
      ...state,
      facturesFournisseurLoading: false,
      facturesFournisseur,
    })),
    on(ErpActions.loadFacturesFournisseurFailure, (state, { error }) => ({
      ...state,
      facturesFournisseurLoading: false,
      facturesFournisseurError: error,
    })),

    on(
      ErpActions.addFactureFournisseur,
      ErpActions.updateFactureFournisseur,
      ErpActions.removeFactureFournisseur,
      (state) => ({
        ...state,
        facturesFournisseurSaving: true,
      }),
    ),
    on(ErpActions.addFactureFournisseurSuccess, (state, { factureFournisseur }) => ({
      ...state,
      facturesFournisseurSaving: false,
      facturesFournisseur: [...state.facturesFournisseur, factureFournisseur],
    })),
    on(ErpActions.updateFactureFournisseurSuccess, (state, { factureFournisseur }) => ({
      ...state,
      facturesFournisseurSaving: false,
      facturesFournisseur: state.facturesFournisseur.map((f) =>
        f.id === factureFournisseur.id ? factureFournisseur : f,
      ),
    })),
    on(ErpActions.removeFactureFournisseurSuccess, (state, { id }) => ({
      ...state,
      facturesFournisseurSaving: false,
      facturesFournisseur: state.facturesFournisseur.filter((f) => f.id !== id),
    })),
    on(
      ErpActions.addFactureFournisseurFailure,
      ErpActions.updateFactureFournisseurFailure,
      ErpActions.removeFactureFournisseurFailure,
      (state) => ({
        ...state,
        facturesFournisseurSaving: false,
      }),
    ),

    on(ErpActions.loadAvoirsFournisseur, (state) => ({
      ...state,
      avoirsFournisseurLoading: true,
      avoirsFournisseurError: null,
    })),
    on(ErpActions.loadAvoirsFournisseurSuccess, (state, { avoirsFournisseur }) => ({
      ...state,
      avoirsFournisseurLoading: false,
      avoirsFournisseur,
    })),
    on(ErpActions.loadAvoirsFournisseurFailure, (state, { error }) => ({
      ...state,
      avoirsFournisseurLoading: false,
      avoirsFournisseurError: error,
    })),

    on(
      ErpActions.addAvoirFournisseur,
      ErpActions.updateAvoirFournisseur,
      ErpActions.removeAvoirFournisseur,
      (state) => ({
        ...state,
        avoirsFournisseurSaving: true,
      }),
    ),
    on(ErpActions.addAvoirFournisseurSuccess, (state, { avoirFournisseur }) => ({
      ...state,
      avoirsFournisseurSaving: false,
      avoirsFournisseur: [...state.avoirsFournisseur, avoirFournisseur],
    })),
    on(ErpActions.updateAvoirFournisseurSuccess, (state, { avoirFournisseur }) => ({
      ...state,
      avoirsFournisseurSaving: false,
      avoirsFournisseur: state.avoirsFournisseur.map((a) =>
        a.id === avoirFournisseur.id ? avoirFournisseur : a,
      ),
    })),
    on(ErpActions.removeAvoirFournisseurSuccess, (state, { id }) => ({
      ...state,
      avoirsFournisseurSaving: false,
      avoirsFournisseur: state.avoirsFournisseur.filter((a) => a.id !== id),
    })),
    on(
      ErpActions.addAvoirFournisseurFailure,
      ErpActions.updateAvoirFournisseurFailure,
      ErpActions.removeAvoirFournisseurFailure,
      (state) => ({
        ...state,
        avoirsFournisseurSaving: false,
      }),
    ),

    on(ErpActions.loadRetours, (state) => ({
      ...state,
      retoursLoading: true,
      retoursError: null,
    })),
    on(ErpActions.loadRetoursSuccess, (state, { retours }) => ({
      ...state,
      retoursLoading: false,
      retours,
    })),
    on(ErpActions.loadRetoursFailure, (state, { error }) => ({
      ...state,
      retoursLoading: false,
      retoursError: error,
    })),

    on(ErpActions.addRetour, ErpActions.updateRetour, ErpActions.removeRetour, (state) => ({
      ...state,
      retoursSaving: true,
    })),
    on(ErpActions.addRetourSuccess, (state, { retour }) => ({
      ...state,
      retoursSaving: false,
      retours: [...state.retours, retour],
    })),
    on(ErpActions.updateRetourSuccess, (state, { retour }) => ({
      ...state,
      retoursSaving: false,
      retours: state.retours.map((r) => (r.id === retour.id ? retour : r)),
    })),
    on(ErpActions.removeRetourSuccess, (state, { id }) => ({
      ...state,
      retoursSaving: false,
      retours: state.retours.filter((r) => r.id !== id),
    })),
    on(
      ErpActions.addRetourFailure,
      ErpActions.updateRetourFailure,
      ErpActions.removeRetourFailure,
      (state) => ({
        ...state,
        retoursSaving: false,
      }),
    ),

    on(ErpActions.loadRetoursFournisseur, (state) => ({
      ...state,
      retoursFournisseurLoading: true,
      retoursFournisseurError: null,
    })),
    on(ErpActions.loadRetoursFournisseurSuccess, (state, { retoursFournisseur }) => ({
      ...state,
      retoursFournisseurLoading: false,
      retoursFournisseur,
    })),
    on(ErpActions.loadRetoursFournisseurFailure, (state, { error }) => ({
      ...state,
      retoursFournisseurLoading: false,
      retoursFournisseurError: error,
    })),

    on(
      ErpActions.addRetourFournisseur,
      ErpActions.updateRetourFournisseur,
      ErpActions.removeRetourFournisseur,
      (state) => ({
        ...state,
        retoursFournisseurSaving: true,
      }),
    ),
    on(ErpActions.addRetourFournisseurSuccess, (state, { retourFournisseur }) => ({
      ...state,
      retoursFournisseurSaving: false,
      retoursFournisseur: [...state.retoursFournisseur, retourFournisseur],
    })),
    on(ErpActions.updateRetourFournisseurSuccess, (state, { retourFournisseur }) => ({
      ...state,
      retoursFournisseurSaving: false,
      retoursFournisseur: state.retoursFournisseur.map((r) =>
        r.id === retourFournisseur.id ? retourFournisseur : r,
      ),
    })),
    on(ErpActions.removeRetourFournisseurSuccess, (state, { id }) => ({
      ...state,
      retoursFournisseurSaving: false,
      retoursFournisseur: state.retoursFournisseur.filter((r) => r.id !== id),
    })),
    on(
      ErpActions.addRetourFournisseurFailure,
      ErpActions.updateRetourFournisseurFailure,
      ErpActions.removeRetourFournisseurFailure,
      (state) => ({
        ...state,
        retoursFournisseurSaving: false,
      }),
    ),
  ),
});
