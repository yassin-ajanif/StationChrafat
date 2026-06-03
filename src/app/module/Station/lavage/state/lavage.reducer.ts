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
  livraisons: Livraison[];
  livraisonsLoading: boolean;
  livraisonsError: string | null;
  factures: Facture[];
  facturesLoading: boolean;
  facturesError: string | null;
  avoirs: Avoir[];
  avoirsLoading: boolean;
  avoirsError: string | null;
  devisAchat: DevisAchat[];
  devisAchatLoading: boolean;
  devisAchatError: string | null;
  commandesAchat: CommandeAchat[];
  commandesAchatLoading: boolean;
  commandesAchatError: string | null;
  receptions: Reception[];
  receptionsLoading: boolean;
  receptionsError: string | null;
  facturesFournisseur: FactureFournisseur[];
  facturesFournisseurLoading: boolean;
  facturesFournisseurError: string | null;
  avoirsFournisseur: AvoirFournisseur[];
  avoirsFournisseurLoading: boolean;
  avoirsFournisseurError: string | null;
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
  livraisons: [],
  livraisonsLoading: false,
  livraisonsError: null,
  factures: [],
  facturesLoading: false,
  facturesError: null,
  avoirs: [],
  avoirsLoading: false,
  avoirsError: null,
  devisAchat: [],
  devisAchatLoading: false,
  devisAchatError: null,
  commandesAchat: [],
  commandesAchatLoading: false,
  commandesAchatError: null,
  receptions: [],
  receptionsLoading: false,
  receptionsError: null,
  facturesFournisseur: [],
  facturesFournisseurLoading: false,
  facturesFournisseurError: null,
  avoirsFournisseur: [],
  avoirsFournisseurLoading: false,
  avoirsFournisseurError: null,
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
  ),
});
