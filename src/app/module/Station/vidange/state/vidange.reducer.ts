import { createFeature, createReducer, on } from '@ngrx/store';
import { AvoirFournisseur, CommandeAchat, DevisAchat, FactureFournisseur, Reception } from '../models/achat';
import { Avoir, Commande, Devis, Facture, Livraison } from '../models/ventes';
import { StockOverview } from '../models/stock-overview';
import { VidangeActions } from './vidange.actions';

export interface VidangeState {
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
}

export const initialVidangeState: VidangeState = {
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
};

export const vidangeFeature = createFeature({
  name: 'Vidange',
  reducer: createReducer(
    initialVidangeState,

    on(VidangeActions.loadStock, (state) => ({
      ...state,
      stockLoading: true,
      stockError: null,
    })),
    on(VidangeActions.loadStockSuccess, (state, { overview }) => ({
      ...state,
      stockLoading: false,
      stockOverview: overview,
    })),
    on(VidangeActions.loadStockFailure, (state, { error }) => ({
      ...state,
      stockLoading: false,
      stockError: error,
    })),

    on(VidangeActions.loadDevis, (state) => ({
      ...state,
      devisLoading: true,
      devisError: null,
    })),
    on(VidangeActions.loadDevisSuccess, (state, { devis }) => ({
      ...state,
      devisLoading: false,
      devis,
    })),
    on(VidangeActions.loadDevisFailure, (state, { error }) => ({
      ...state,
      devisLoading: false,
      devisError: error,
    })),

    on(VidangeActions.addDevis, VidangeActions.updateDevis, VidangeActions.removeDevis, (state) => ({
      ...state,
      devisSaving: true,
    })),
    on(VidangeActions.addDevisSuccess, (state, { devis }) => ({
      ...state,
      devisSaving: false,
      devis: [...state.devis, devis],
    })),
    on(VidangeActions.updateDevisSuccess, (state, { devis }) => ({
      ...state,
      devisSaving: false,
      devis: state.devis.map((d) => (d.id === devis.id ? devis : d)),
    })),
    on(VidangeActions.removeDevisSuccess, (state, { id }) => ({
      ...state,
      devisSaving: false,
      devis: state.devis.filter((d) => d.id !== id),
    })),
    on(
      VidangeActions.addDevisFailure,
      VidangeActions.updateDevisFailure,
      VidangeActions.removeDevisFailure,
      (state) => ({
        ...state,
        devisSaving: false,
      }),
    ),

    on(VidangeActions.loadCommandes, (state) => ({
      ...state,
      commandesLoading: true,
      commandesError: null,
    })),
    on(VidangeActions.loadCommandesSuccess, (state, { commandes }) => ({
      ...state,
      commandesLoading: false,
      commandes,
    })),
    on(VidangeActions.loadCommandesFailure, (state, { error }) => ({
      ...state,
      commandesLoading: false,
      commandesError: error,
    })),

    on(VidangeActions.addCommande, VidangeActions.updateCommande, VidangeActions.removeCommande, (state) => ({
      ...state,
      commandesSaving: true,
    })),
    on(VidangeActions.addCommandeSuccess, (state, { commande }) => ({
      ...state,
      commandesSaving: false,
      commandes: [...state.commandes, commande],
    })),
    on(VidangeActions.updateCommandeSuccess, (state, { commande }) => ({
      ...state,
      commandesSaving: false,
      commandes: state.commandes.map((c) => (c.id === commande.id ? commande : c)),
    })),
    on(VidangeActions.removeCommandeSuccess, (state, { id }) => ({
      ...state,
      commandesSaving: false,
      commandes: state.commandes.filter((c) => c.id !== id),
    })),
    on(
      VidangeActions.addCommandeFailure,
      VidangeActions.updateCommandeFailure,
      VidangeActions.removeCommandeFailure,
      (state) => ({
        ...state,
        commandesSaving: false,
      }),
    ),

    on(VidangeActions.loadLivraisons, (state) => ({
      ...state,
      livraisonsLoading: true,
      livraisonsError: null,
    })),
    on(VidangeActions.loadLivraisonsSuccess, (state, { livraisons }) => ({
      ...state,
      livraisonsLoading: false,
      livraisons,
    })),
    on(VidangeActions.loadLivraisonsFailure, (state, { error }) => ({
      ...state,
      livraisonsLoading: false,
      livraisonsError: error,
    })),

    on(VidangeActions.addLivraison, VidangeActions.updateLivraison, VidangeActions.removeLivraison, (state) => ({
      ...state,
      livraisonsSaving: true,
    })),
    on(VidangeActions.addLivraisonSuccess, (state, { livraison }) => ({
      ...state,
      livraisonsSaving: false,
      livraisons: [...state.livraisons, livraison],
    })),
    on(VidangeActions.updateLivraisonSuccess, (state, { livraison }) => ({
      ...state,
      livraisonsSaving: false,
      livraisons: state.livraisons.map((l) => (l.id === livraison.id ? livraison : l)),
    })),
    on(VidangeActions.removeLivraisonSuccess, (state, { id }) => ({
      ...state,
      livraisonsSaving: false,
      livraisons: state.livraisons.filter((l) => l.id !== id),
    })),
    on(
      VidangeActions.addLivraisonFailure,
      VidangeActions.updateLivraisonFailure,
      VidangeActions.removeLivraisonFailure,
      (state) => ({
        ...state,
        livraisonsSaving: false,
      }),
    ),

    on(VidangeActions.loadFactures, (state) => ({
      ...state,
      facturesLoading: true,
      facturesError: null,
    })),
    on(VidangeActions.loadFacturesSuccess, (state, { factures }) => ({
      ...state,
      facturesLoading: false,
      factures,
    })),
    on(VidangeActions.loadFacturesFailure, (state, { error }) => ({
      ...state,
      facturesLoading: false,
      facturesError: error,
    })),

    on(VidangeActions.addFacture, VidangeActions.updateFacture, VidangeActions.removeFacture, (state) => ({
      ...state,
      facturesSaving: true,
    })),
    on(VidangeActions.addFactureSuccess, (state, { facture }) => ({
      ...state,
      facturesSaving: false,
      factures: [...state.factures, facture],
    })),
    on(VidangeActions.updateFactureSuccess, (state, { facture }) => ({
      ...state,
      facturesSaving: false,
      factures: state.factures.map((f) => (f.id === facture.id ? facture : f)),
    })),
    on(VidangeActions.removeFactureSuccess, (state, { id }) => ({
      ...state,
      facturesSaving: false,
      factures: state.factures.filter((f) => f.id !== id),
    })),
    on(
      VidangeActions.addFactureFailure,
      VidangeActions.updateFactureFailure,
      VidangeActions.removeFactureFailure,
      (state) => ({
        ...state,
        facturesSaving: false,
      }),
    ),

    on(VidangeActions.loadAvoirs, (state) => ({
      ...state,
      avoirsLoading: true,
      avoirsError: null,
    })),
    on(VidangeActions.loadAvoirsSuccess, (state, { avoirs }) => ({
      ...state,
      avoirsLoading: false,
      avoirs,
    })),
    on(VidangeActions.loadAvoirsFailure, (state, { error }) => ({
      ...state,
      avoirsLoading: false,
      avoirsError: error,
    })),

    on(VidangeActions.addAvoir, VidangeActions.updateAvoir, VidangeActions.removeAvoir, (state) => ({
      ...state,
      avoirsSaving: true,
    })),
    on(VidangeActions.addAvoirSuccess, (state, { avoir }) => ({
      ...state,
      avoirsSaving: false,
      avoirs: [...state.avoirs, avoir],
    })),
    on(VidangeActions.updateAvoirSuccess, (state, { avoir }) => ({
      ...state,
      avoirsSaving: false,
      avoirs: state.avoirs.map((a) => (a.id === avoir.id ? avoir : a)),
    })),
    on(VidangeActions.removeAvoirSuccess, (state, { id }) => ({
      ...state,
      avoirsSaving: false,
      avoirs: state.avoirs.filter((a) => a.id !== id),
    })),
    on(
      VidangeActions.addAvoirFailure,
      VidangeActions.updateAvoirFailure,
      VidangeActions.removeAvoirFailure,
      (state) => ({
        ...state,
        avoirsSaving: false,
      }),
    ),

    on(VidangeActions.loadDevisAchat, (state) => ({
      ...state,
      devisAchatLoading: true,
      devisAchatError: null,
    })),
    on(VidangeActions.loadDevisAchatSuccess, (state, { devisAchat }) => ({
      ...state,
      devisAchatLoading: false,
      devisAchat,
    })),
    on(VidangeActions.loadDevisAchatFailure, (state, { error }) => ({
      ...state,
      devisAchatLoading: false,
      devisAchatError: error,
    })),

    on(VidangeActions.addDevisAchat, VidangeActions.updateDevisAchat, VidangeActions.removeDevisAchat, (state) => ({
      ...state,
      devisAchatSaving: true,
    })),
    on(VidangeActions.addDevisAchatSuccess, (state, { devisAchat }) => ({
      ...state,
      devisAchatSaving: false,
      devisAchat: [...state.devisAchat, devisAchat],
    })),
    on(VidangeActions.updateDevisAchatSuccess, (state, { devisAchat }) => ({
      ...state,
      devisAchatSaving: false,
      devisAchat: state.devisAchat.map((d) => (d.id === devisAchat.id ? devisAchat : d)),
    })),
    on(VidangeActions.removeDevisAchatSuccess, (state, { id }) => ({
      ...state,
      devisAchatSaving: false,
      devisAchat: state.devisAchat.filter((d) => d.id !== id),
    })),
    on(
      VidangeActions.addDevisAchatFailure,
      VidangeActions.updateDevisAchatFailure,
      VidangeActions.removeDevisAchatFailure,
      (state) => ({
        ...state,
        devisAchatSaving: false,
      }),
    ),

    on(VidangeActions.loadCommandesAchat, (state) => ({
      ...state,
      commandesAchatLoading: true,
      commandesAchatError: null,
    })),
    on(VidangeActions.loadCommandesAchatSuccess, (state, { commandesAchat }) => ({
      ...state,
      commandesAchatLoading: false,
      commandesAchat,
    })),
    on(VidangeActions.loadCommandesAchatFailure, (state, { error }) => ({
      ...state,
      commandesAchatLoading: false,
      commandesAchatError: error,
    })),

    on(
      VidangeActions.addCommandeAchat,
      VidangeActions.updateCommandeAchat,
      VidangeActions.removeCommandeAchat,
      (state) => ({
        ...state,
        commandesAchatSaving: true,
      }),
    ),
    on(VidangeActions.addCommandeAchatSuccess, (state, { commandeAchat }) => ({
      ...state,
      commandesAchatSaving: false,
      commandesAchat: [...state.commandesAchat, commandeAchat],
    })),
    on(VidangeActions.updateCommandeAchatSuccess, (state, { commandeAchat }) => ({
      ...state,
      commandesAchatSaving: false,
      commandesAchat: state.commandesAchat.map((c) =>
        c.id === commandeAchat.id ? commandeAchat : c,
      ),
    })),
    on(VidangeActions.removeCommandeAchatSuccess, (state, { id }) => ({
      ...state,
      commandesAchatSaving: false,
      commandesAchat: state.commandesAchat.filter((c) => c.id !== id),
    })),
    on(
      VidangeActions.addCommandeAchatFailure,
      VidangeActions.updateCommandeAchatFailure,
      VidangeActions.removeCommandeAchatFailure,
      (state) => ({
        ...state,
        commandesAchatSaving: false,
      }),
    ),

    on(VidangeActions.loadReceptions, (state) => ({
      ...state,
      receptionsLoading: true,
      receptionsError: null,
    })),
    on(VidangeActions.loadReceptionsSuccess, (state, { receptions }) => ({
      ...state,
      receptionsLoading: false,
      receptions,
    })),
    on(VidangeActions.loadReceptionsFailure, (state, { error }) => ({
      ...state,
      receptionsLoading: false,
      receptionsError: error,
    })),

    on(VidangeActions.addReception, VidangeActions.updateReception, VidangeActions.removeReception, (state) => ({
      ...state,
      receptionsSaving: true,
    })),
    on(VidangeActions.addReceptionSuccess, (state, { reception }) => ({
      ...state,
      receptionsSaving: false,
      receptions: [...state.receptions, reception],
    })),
    on(VidangeActions.updateReceptionSuccess, (state, { reception }) => ({
      ...state,
      receptionsSaving: false,
      receptions: state.receptions.map((r) => (r.id === reception.id ? reception : r)),
    })),
    on(VidangeActions.removeReceptionSuccess, (state, { id }) => ({
      ...state,
      receptionsSaving: false,
      receptions: state.receptions.filter((r) => r.id !== id),
    })),
    on(
      VidangeActions.addReceptionFailure,
      VidangeActions.updateReceptionFailure,
      VidangeActions.removeReceptionFailure,
      (state) => ({
        ...state,
        receptionsSaving: false,
      }),
    ),

    on(VidangeActions.loadFacturesFournisseur, (state) => ({
      ...state,
      facturesFournisseurLoading: true,
      facturesFournisseurError: null,
    })),
    on(VidangeActions.loadFacturesFournisseurSuccess, (state, { facturesFournisseur }) => ({
      ...state,
      facturesFournisseurLoading: false,
      facturesFournisseur,
    })),
    on(VidangeActions.loadFacturesFournisseurFailure, (state, { error }) => ({
      ...state,
      facturesFournisseurLoading: false,
      facturesFournisseurError: error,
    })),

    on(
      VidangeActions.addFactureFournisseur,
      VidangeActions.updateFactureFournisseur,
      VidangeActions.removeFactureFournisseur,
      (state) => ({
        ...state,
        facturesFournisseurSaving: true,
      }),
    ),
    on(VidangeActions.addFactureFournisseurSuccess, (state, { factureFournisseur }) => ({
      ...state,
      facturesFournisseurSaving: false,
      facturesFournisseur: [...state.facturesFournisseur, factureFournisseur],
    })),
    on(VidangeActions.updateFactureFournisseurSuccess, (state, { factureFournisseur }) => ({
      ...state,
      facturesFournisseurSaving: false,
      facturesFournisseur: state.facturesFournisseur.map((f) =>
        f.id === factureFournisseur.id ? factureFournisseur : f,
      ),
    })),
    on(VidangeActions.removeFactureFournisseurSuccess, (state, { id }) => ({
      ...state,
      facturesFournisseurSaving: false,
      facturesFournisseur: state.facturesFournisseur.filter((f) => f.id !== id),
    })),
    on(
      VidangeActions.addFactureFournisseurFailure,
      VidangeActions.updateFactureFournisseurFailure,
      VidangeActions.removeFactureFournisseurFailure,
      (state) => ({
        ...state,
        facturesFournisseurSaving: false,
      }),
    ),

    on(VidangeActions.loadAvoirsFournisseur, (state) => ({
      ...state,
      avoirsFournisseurLoading: true,
      avoirsFournisseurError: null,
    })),
    on(VidangeActions.loadAvoirsFournisseurSuccess, (state, { avoirsFournisseur }) => ({
      ...state,
      avoirsFournisseurLoading: false,
      avoirsFournisseur,
    })),
    on(VidangeActions.loadAvoirsFournisseurFailure, (state, { error }) => ({
      ...state,
      avoirsFournisseurLoading: false,
      avoirsFournisseurError: error,
    })),

    on(
      VidangeActions.addAvoirFournisseur,
      VidangeActions.updateAvoirFournisseur,
      VidangeActions.removeAvoirFournisseur,
      (state) => ({
        ...state,
        avoirsFournisseurSaving: true,
      }),
    ),
    on(VidangeActions.addAvoirFournisseurSuccess, (state, { avoirFournisseur }) => ({
      ...state,
      avoirsFournisseurSaving: false,
      avoirsFournisseur: [...state.avoirsFournisseur, avoirFournisseur],
    })),
    on(VidangeActions.updateAvoirFournisseurSuccess, (state, { avoirFournisseur }) => ({
      ...state,
      avoirsFournisseurSaving: false,
      avoirsFournisseur: state.avoirsFournisseur.map((a) =>
        a.id === avoirFournisseur.id ? avoirFournisseur : a,
      ),
    })),
    on(VidangeActions.removeAvoirFournisseurSuccess, (state, { id }) => ({
      ...state,
      avoirsFournisseurSaving: false,
      avoirsFournisseur: state.avoirsFournisseur.filter((a) => a.id !== id),
    })),
    on(
      VidangeActions.addAvoirFournisseurFailure,
      VidangeActions.updateAvoirFournisseurFailure,
      VidangeActions.removeAvoirFournisseurFailure,
      (state) => ({
        ...state,
        avoirsFournisseurSaving: false,
      }),
    ),
  ),
});
