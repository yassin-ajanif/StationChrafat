import { createFeature, createReducer, on } from '@ngrx/store';
import { AvoirFournisseur, CommandeAchat, DevisAchat, FactureFournisseur, Reception } from '../models/achat';
import { Avoir, Commande, Devis, Facture, Livraison } from '../models/ventes';
import { StockOverview } from '../models/stock-overview';
import { LavageActions } from './lavage.actions';

export interface LavageState {
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

export const initialLavageState: LavageState = {
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

export const lavageFeature = createFeature({
  name: 'Lavage',
  reducer: createReducer(
    initialLavageState,

    on(LavageActions.loadStock, (state) => ({
      ...state,
      stockLoading: true,
      stockError: null,
    })),
    on(LavageActions.loadStockSuccess, (state, { overview }) => ({
      ...state,
      stockLoading: false,
      stockOverview: overview,
    })),
    on(LavageActions.loadStockFailure, (state, { error }) => ({
      ...state,
      stockLoading: false,
      stockError: error,
    })),

    on(LavageActions.loadDevis, (state) => ({
      ...state,
      devisLoading: true,
      devisError: null,
    })),
    on(LavageActions.loadDevisSuccess, (state, { devis }) => ({
      ...state,
      devisLoading: false,
      devis,
    })),
    on(LavageActions.loadDevisFailure, (state, { error }) => ({
      ...state,
      devisLoading: false,
      devisError: error,
    })),

    on(LavageActions.addDevis, LavageActions.updateDevis, LavageActions.removeDevis, (state) => ({
      ...state,
      devisSaving: true,
    })),
    on(LavageActions.addDevisSuccess, (state, { devis }) => ({
      ...state,
      devisSaving: false,
      devis: [...state.devis, devis],
    })),
    on(LavageActions.updateDevisSuccess, (state, { devis }) => ({
      ...state,
      devisSaving: false,
      devis: state.devis.map((d) => (d.id === devis.id ? devis : d)),
    })),
    on(LavageActions.removeDevisSuccess, (state, { id }) => ({
      ...state,
      devisSaving: false,
      devis: state.devis.filter((d) => d.id !== id),
    })),
    on(
      LavageActions.addDevisFailure,
      LavageActions.updateDevisFailure,
      LavageActions.removeDevisFailure,
      (state) => ({
        ...state,
        devisSaving: false,
      }),
    ),

    on(LavageActions.loadCommandes, (state) => ({
      ...state,
      commandesLoading: true,
      commandesError: null,
    })),
    on(LavageActions.loadCommandesSuccess, (state, { commandes }) => ({
      ...state,
      commandesLoading: false,
      commandes,
    })),
    on(LavageActions.loadCommandesFailure, (state, { error }) => ({
      ...state,
      commandesLoading: false,
      commandesError: error,
    })),

    on(LavageActions.addCommande, LavageActions.updateCommande, LavageActions.removeCommande, (state) => ({
      ...state,
      commandesSaving: true,
    })),
    on(LavageActions.addCommandeSuccess, (state, { commande }) => ({
      ...state,
      commandesSaving: false,
      commandes: [...state.commandes, commande],
    })),
    on(LavageActions.updateCommandeSuccess, (state, { commande }) => ({
      ...state,
      commandesSaving: false,
      commandes: state.commandes.map((c) => (c.id === commande.id ? commande : c)),
    })),
    on(LavageActions.removeCommandeSuccess, (state, { id }) => ({
      ...state,
      commandesSaving: false,
      commandes: state.commandes.filter((c) => c.id !== id),
    })),
    on(
      LavageActions.addCommandeFailure,
      LavageActions.updateCommandeFailure,
      LavageActions.removeCommandeFailure,
      (state) => ({
        ...state,
        commandesSaving: false,
      }),
    ),

    on(LavageActions.loadLivraisons, (state) => ({
      ...state,
      livraisonsLoading: true,
      livraisonsError: null,
    })),
    on(LavageActions.loadLivraisonsSuccess, (state, { livraisons }) => ({
      ...state,
      livraisonsLoading: false,
      livraisons,
    })),
    on(LavageActions.loadLivraisonsFailure, (state, { error }) => ({
      ...state,
      livraisonsLoading: false,
      livraisonsError: error,
    })),

    on(LavageActions.addLivraison, LavageActions.updateLivraison, LavageActions.removeLivraison, (state) => ({
      ...state,
      livraisonsSaving: true,
    })),
    on(LavageActions.addLivraisonSuccess, (state, { livraison }) => ({
      ...state,
      livraisonsSaving: false,
      livraisons: [...state.livraisons, livraison],
    })),
    on(LavageActions.updateLivraisonSuccess, (state, { livraison }) => ({
      ...state,
      livraisonsSaving: false,
      livraisons: state.livraisons.map((l) => (l.id === livraison.id ? livraison : l)),
    })),
    on(LavageActions.removeLivraisonSuccess, (state, { id }) => ({
      ...state,
      livraisonsSaving: false,
      livraisons: state.livraisons.filter((l) => l.id !== id),
    })),
    on(
      LavageActions.addLivraisonFailure,
      LavageActions.updateLivraisonFailure,
      LavageActions.removeLivraisonFailure,
      (state) => ({
        ...state,
        livraisonsSaving: false,
      }),
    ),

    on(LavageActions.loadFactures, (state) => ({
      ...state,
      facturesLoading: true,
      facturesError: null,
    })),
    on(LavageActions.loadFacturesSuccess, (state, { factures }) => ({
      ...state,
      facturesLoading: false,
      factures,
    })),
    on(LavageActions.loadFacturesFailure, (state, { error }) => ({
      ...state,
      facturesLoading: false,
      facturesError: error,
    })),

    on(LavageActions.addFacture, LavageActions.updateFacture, LavageActions.removeFacture, (state) => ({
      ...state,
      facturesSaving: true,
    })),
    on(LavageActions.addFactureSuccess, (state, { facture }) => ({
      ...state,
      facturesSaving: false,
      factures: [...state.factures, facture],
    })),
    on(LavageActions.updateFactureSuccess, (state, { facture }) => ({
      ...state,
      facturesSaving: false,
      factures: state.factures.map((f) => (f.id === facture.id ? facture : f)),
    })),
    on(LavageActions.removeFactureSuccess, (state, { id }) => ({
      ...state,
      facturesSaving: false,
      factures: state.factures.filter((f) => f.id !== id),
    })),
    on(
      LavageActions.addFactureFailure,
      LavageActions.updateFactureFailure,
      LavageActions.removeFactureFailure,
      (state) => ({
        ...state,
        facturesSaving: false,
      }),
    ),

    on(LavageActions.loadAvoirs, (state) => ({
      ...state,
      avoirsLoading: true,
      avoirsError: null,
    })),
    on(LavageActions.loadAvoirsSuccess, (state, { avoirs }) => ({
      ...state,
      avoirsLoading: false,
      avoirs,
    })),
    on(LavageActions.loadAvoirsFailure, (state, { error }) => ({
      ...state,
      avoirsLoading: false,
      avoirsError: error,
    })),

    on(LavageActions.addAvoir, LavageActions.updateAvoir, LavageActions.removeAvoir, (state) => ({
      ...state,
      avoirsSaving: true,
    })),
    on(LavageActions.addAvoirSuccess, (state, { avoir }) => ({
      ...state,
      avoirsSaving: false,
      avoirs: [...state.avoirs, avoir],
    })),
    on(LavageActions.updateAvoirSuccess, (state, { avoir }) => ({
      ...state,
      avoirsSaving: false,
      avoirs: state.avoirs.map((a) => (a.id === avoir.id ? avoir : a)),
    })),
    on(LavageActions.removeAvoirSuccess, (state, { id }) => ({
      ...state,
      avoirsSaving: false,
      avoirs: state.avoirs.filter((a) => a.id !== id),
    })),
    on(
      LavageActions.addAvoirFailure,
      LavageActions.updateAvoirFailure,
      LavageActions.removeAvoirFailure,
      (state) => ({
        ...state,
        avoirsSaving: false,
      }),
    ),

    on(LavageActions.loadDevisAchat, (state) => ({
      ...state,
      devisAchatLoading: true,
      devisAchatError: null,
    })),
    on(LavageActions.loadDevisAchatSuccess, (state, { devisAchat }) => ({
      ...state,
      devisAchatLoading: false,
      devisAchat,
    })),
    on(LavageActions.loadDevisAchatFailure, (state, { error }) => ({
      ...state,
      devisAchatLoading: false,
      devisAchatError: error,
    })),

    on(LavageActions.addDevisAchat, LavageActions.updateDevisAchat, LavageActions.removeDevisAchat, (state) => ({
      ...state,
      devisAchatSaving: true,
    })),
    on(LavageActions.addDevisAchatSuccess, (state, { devisAchat }) => ({
      ...state,
      devisAchatSaving: false,
      devisAchat: [...state.devisAchat, devisAchat],
    })),
    on(LavageActions.updateDevisAchatSuccess, (state, { devisAchat }) => ({
      ...state,
      devisAchatSaving: false,
      devisAchat: state.devisAchat.map((d) => (d.id === devisAchat.id ? devisAchat : d)),
    })),
    on(LavageActions.removeDevisAchatSuccess, (state, { id }) => ({
      ...state,
      devisAchatSaving: false,
      devisAchat: state.devisAchat.filter((d) => d.id !== id),
    })),
    on(
      LavageActions.addDevisAchatFailure,
      LavageActions.updateDevisAchatFailure,
      LavageActions.removeDevisAchatFailure,
      (state) => ({
        ...state,
        devisAchatSaving: false,
      }),
    ),

    on(LavageActions.loadCommandesAchat, (state) => ({
      ...state,
      commandesAchatLoading: true,
      commandesAchatError: null,
    })),
    on(LavageActions.loadCommandesAchatSuccess, (state, { commandesAchat }) => ({
      ...state,
      commandesAchatLoading: false,
      commandesAchat,
    })),
    on(LavageActions.loadCommandesAchatFailure, (state, { error }) => ({
      ...state,
      commandesAchatLoading: false,
      commandesAchatError: error,
    })),

    on(
      LavageActions.addCommandeAchat,
      LavageActions.updateCommandeAchat,
      LavageActions.removeCommandeAchat,
      (state) => ({
        ...state,
        commandesAchatSaving: true,
      }),
    ),
    on(LavageActions.addCommandeAchatSuccess, (state, { commandeAchat }) => ({
      ...state,
      commandesAchatSaving: false,
      commandesAchat: [...state.commandesAchat, commandeAchat],
    })),
    on(LavageActions.updateCommandeAchatSuccess, (state, { commandeAchat }) => ({
      ...state,
      commandesAchatSaving: false,
      commandesAchat: state.commandesAchat.map((c) =>
        c.id === commandeAchat.id ? commandeAchat : c,
      ),
    })),
    on(LavageActions.removeCommandeAchatSuccess, (state, { id }) => ({
      ...state,
      commandesAchatSaving: false,
      commandesAchat: state.commandesAchat.filter((c) => c.id !== id),
    })),
    on(
      LavageActions.addCommandeAchatFailure,
      LavageActions.updateCommandeAchatFailure,
      LavageActions.removeCommandeAchatFailure,
      (state) => ({
        ...state,
        commandesAchatSaving: false,
      }),
    ),

    on(LavageActions.loadReceptions, (state) => ({
      ...state,
      receptionsLoading: true,
      receptionsError: null,
    })),
    on(LavageActions.loadReceptionsSuccess, (state, { receptions }) => ({
      ...state,
      receptionsLoading: false,
      receptions,
    })),
    on(LavageActions.loadReceptionsFailure, (state, { error }) => ({
      ...state,
      receptionsLoading: false,
      receptionsError: error,
    })),

    on(LavageActions.addReception, LavageActions.updateReception, LavageActions.removeReception, (state) => ({
      ...state,
      receptionsSaving: true,
    })),
    on(LavageActions.addReceptionSuccess, (state, { reception }) => ({
      ...state,
      receptionsSaving: false,
      receptions: [...state.receptions, reception],
    })),
    on(LavageActions.updateReceptionSuccess, (state, { reception }) => ({
      ...state,
      receptionsSaving: false,
      receptions: state.receptions.map((r) => (r.id === reception.id ? reception : r)),
    })),
    on(LavageActions.removeReceptionSuccess, (state, { id }) => ({
      ...state,
      receptionsSaving: false,
      receptions: state.receptions.filter((r) => r.id !== id),
    })),
    on(
      LavageActions.addReceptionFailure,
      LavageActions.updateReceptionFailure,
      LavageActions.removeReceptionFailure,
      (state) => ({
        ...state,
        receptionsSaving: false,
      }),
    ),

    on(LavageActions.loadFacturesFournisseur, (state) => ({
      ...state,
      facturesFournisseurLoading: true,
      facturesFournisseurError: null,
    })),
    on(LavageActions.loadFacturesFournisseurSuccess, (state, { facturesFournisseur }) => ({
      ...state,
      facturesFournisseurLoading: false,
      facturesFournisseur,
    })),
    on(LavageActions.loadFacturesFournisseurFailure, (state, { error }) => ({
      ...state,
      facturesFournisseurLoading: false,
      facturesFournisseurError: error,
    })),

    on(
      LavageActions.addFactureFournisseur,
      LavageActions.updateFactureFournisseur,
      LavageActions.removeFactureFournisseur,
      (state) => ({
        ...state,
        facturesFournisseurSaving: true,
      }),
    ),
    on(LavageActions.addFactureFournisseurSuccess, (state, { factureFournisseur }) => ({
      ...state,
      facturesFournisseurSaving: false,
      facturesFournisseur: [...state.facturesFournisseur, factureFournisseur],
    })),
    on(LavageActions.updateFactureFournisseurSuccess, (state, { factureFournisseur }) => ({
      ...state,
      facturesFournisseurSaving: false,
      facturesFournisseur: state.facturesFournisseur.map((f) =>
        f.id === factureFournisseur.id ? factureFournisseur : f,
      ),
    })),
    on(LavageActions.removeFactureFournisseurSuccess, (state, { id }) => ({
      ...state,
      facturesFournisseurSaving: false,
      facturesFournisseur: state.facturesFournisseur.filter((f) => f.id !== id),
    })),
    on(
      LavageActions.addFactureFournisseurFailure,
      LavageActions.updateFactureFournisseurFailure,
      LavageActions.removeFactureFournisseurFailure,
      (state) => ({
        ...state,
        facturesFournisseurSaving: false,
      }),
    ),

    on(LavageActions.loadAvoirsFournisseur, (state) => ({
      ...state,
      avoirsFournisseurLoading: true,
      avoirsFournisseurError: null,
    })),
    on(LavageActions.loadAvoirsFournisseurSuccess, (state, { avoirsFournisseur }) => ({
      ...state,
      avoirsFournisseurLoading: false,
      avoirsFournisseur,
    })),
    on(LavageActions.loadAvoirsFournisseurFailure, (state, { error }) => ({
      ...state,
      avoirsFournisseurLoading: false,
      avoirsFournisseurError: error,
    })),

    on(
      LavageActions.addAvoirFournisseur,
      LavageActions.updateAvoirFournisseur,
      LavageActions.removeAvoirFournisseur,
      (state) => ({
        ...state,
        avoirsFournisseurSaving: true,
      }),
    ),
    on(LavageActions.addAvoirFournisseurSuccess, (state, { avoirFournisseur }) => ({
      ...state,
      avoirsFournisseurSaving: false,
      avoirsFournisseur: [...state.avoirsFournisseur, avoirFournisseur],
    })),
    on(LavageActions.updateAvoirFournisseurSuccess, (state, { avoirFournisseur }) => ({
      ...state,
      avoirsFournisseurSaving: false,
      avoirsFournisseur: state.avoirsFournisseur.map((a) =>
        a.id === avoirFournisseur.id ? avoirFournisseur : a,
      ),
    })),
    on(LavageActions.removeAvoirFournisseurSuccess, (state, { id }) => ({
      ...state,
      avoirsFournisseurSaving: false,
      avoirsFournisseur: state.avoirsFournisseur.filter((a) => a.id !== id),
    })),
    on(
      LavageActions.addAvoirFournisseurFailure,
      LavageActions.updateAvoirFournisseurFailure,
      LavageActions.removeAvoirFournisseurFailure,
      (state) => ({
        ...state,
        avoirsFournisseurSaving: false,
      }),
    ),
  ),
});
