import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  AvoirFournisseur,
  AvoirFournisseurDraft,
  CommandeAchat,
  CommandeAchatDraft,
  DevisAchat,
  DevisAchatDraft,
  FactureFournisseur,
  FactureFournisseurDraft,
  Reception,
  ReceptionDraft,
} from '../models/achat';
import { Avoir, AvoirDraft, Commande, CommandeDraft, Devis, DevisDraft, Facture, FactureDraft, Livraison, LivraisonDraft } from '../models/ventes';
import { StockOverview } from '../models/stock-overview';

export const LavageActions = createActionGroup({
  source: 'Lavage',
  events: {
    'Load Stock': emptyProps(),
    'Load Stock Success': props<{ overview: StockOverview }>(),
    'Load Stock Failure': props<{ error: string }>(),

    'Load Devis': emptyProps(),
    'Load Devis Success': props<{ devis: Devis[] }>(),
    'Load Devis Failure': props<{ error: string }>(),

    'Add Devis': props<{ draft: DevisDraft }>(),
    'Add Devis Success': props<{ devis: Devis }>(),
    'Add Devis Failure': props<{ error: string }>(),

    'Update Devis': props<{ id: number; draft: DevisDraft }>(),
    'Update Devis Success': props<{ devis: Devis }>(),
    'Update Devis Failure': props<{ error: string }>(),

    'Remove Devis': props<{ id: number }>(),
    'Remove Devis Success': props<{ id: number }>(),
    'Remove Devis Failure': props<{ error: string }>(),

    'Load Commandes': emptyProps(),
    'Load Commandes Success': props<{ commandes: Commande[] }>(),
    'Load Commandes Failure': props<{ error: string }>(),

    'Add Commande': props<{ draft: CommandeDraft }>(),
    'Add Commande Success': props<{ commande: Commande }>(),
    'Add Commande Failure': props<{ error: string }>(),

    'Update Commande': props<{ id: number; draft: CommandeDraft }>(),
    'Update Commande Success': props<{ commande: Commande }>(),
    'Update Commande Failure': props<{ error: string }>(),

    'Remove Commande': props<{ id: number }>(),
    'Remove Commande Success': props<{ id: number }>(),
    'Remove Commande Failure': props<{ error: string }>(),

    'Load Livraisons': emptyProps(),
    'Load Livraisons Success': props<{ livraisons: Livraison[] }>(),
    'Load Livraisons Failure': props<{ error: string }>(),

    'Add Livraison': props<{ draft: LivraisonDraft }>(),
    'Add Livraison Success': props<{ livraison: Livraison }>(),
    'Add Livraison Failure': props<{ error: string }>(),

    'Update Livraison': props<{ id: number; draft: LivraisonDraft }>(),
    'Update Livraison Success': props<{ livraison: Livraison }>(),
    'Update Livraison Failure': props<{ error: string }>(),

    'Remove Livraison': props<{ id: number }>(),
    'Remove Livraison Success': props<{ id: number }>(),
    'Remove Livraison Failure': props<{ error: string }>(),

    'Load Factures': emptyProps(),
    'Load Factures Success': props<{ factures: Facture[] }>(),
    'Load Factures Failure': props<{ error: string }>(),

    'Add Facture': props<{ draft: FactureDraft }>(),
    'Add Facture Success': props<{ facture: Facture }>(),
    'Add Facture Failure': props<{ error: string }>(),

    'Update Facture': props<{ id: number; draft: FactureDraft }>(),
    'Update Facture Success': props<{ facture: Facture }>(),
    'Update Facture Failure': props<{ error: string }>(),

    'Remove Facture': props<{ id: number }>(),
    'Remove Facture Success': props<{ id: number }>(),
    'Remove Facture Failure': props<{ error: string }>(),

    'Load Avoirs': emptyProps(),
    'Load Avoirs Success': props<{ avoirs: Avoir[] }>(),
    'Load Avoirs Failure': props<{ error: string }>(),

    'Add Avoir': props<{ draft: AvoirDraft }>(),
    'Add Avoir Success': props<{ avoir: Avoir }>(),
    'Add Avoir Failure': props<{ error: string }>(),

    'Update Avoir': props<{ id: number; draft: AvoirDraft }>(),
    'Update Avoir Success': props<{ avoir: Avoir }>(),
    'Update Avoir Failure': props<{ error: string }>(),

    'Remove Avoir': props<{ id: number }>(),
    'Remove Avoir Success': props<{ id: number }>(),
    'Remove Avoir Failure': props<{ error: string }>(),

    'Load Devis Achat': emptyProps(),
    'Load Devis Achat Success': props<{ devisAchat: DevisAchat[] }>(),
    'Load Devis Achat Failure': props<{ error: string }>(),

    'Add Devis Achat': props<{ draft: DevisAchatDraft }>(),
    'Add Devis Achat Success': props<{ devisAchat: DevisAchat }>(),
    'Add Devis Achat Failure': props<{ error: string }>(),

    'Update Devis Achat': props<{ id: number; draft: DevisAchatDraft }>(),
    'Update Devis Achat Success': props<{ devisAchat: DevisAchat }>(),
    'Update Devis Achat Failure': props<{ error: string }>(),

    'Remove Devis Achat': props<{ id: number }>(),
    'Remove Devis Achat Success': props<{ id: number }>(),
    'Remove Devis Achat Failure': props<{ error: string }>(),

    'Load Commandes Achat': emptyProps(),
    'Load Commandes Achat Success': props<{ commandesAchat: CommandeAchat[] }>(),
    'Load Commandes Achat Failure': props<{ error: string }>(),

    'Add Commande Achat': props<{ draft: CommandeAchatDraft }>(),
    'Add Commande Achat Success': props<{ commandeAchat: CommandeAchat }>(),
    'Add Commande Achat Failure': props<{ error: string }>(),

    'Update Commande Achat': props<{ id: number; draft: CommandeAchatDraft }>(),
    'Update Commande Achat Success': props<{ commandeAchat: CommandeAchat }>(),
    'Update Commande Achat Failure': props<{ error: string }>(),

    'Remove Commande Achat': props<{ id: number }>(),
    'Remove Commande Achat Success': props<{ id: number }>(),
    'Remove Commande Achat Failure': props<{ error: string }>(),

    'Load Receptions': emptyProps(),
    'Load Receptions Success': props<{ receptions: Reception[] }>(),
    'Load Receptions Failure': props<{ error: string }>(),

    'Add Reception': props<{ draft: ReceptionDraft }>(),
    'Add Reception Success': props<{ reception: Reception }>(),
    'Add Reception Failure': props<{ error: string }>(),

    'Update Reception': props<{ id: number; draft: ReceptionDraft }>(),
    'Update Reception Success': props<{ reception: Reception }>(),
    'Update Reception Failure': props<{ error: string }>(),

    'Remove Reception': props<{ id: number }>(),
    'Remove Reception Success': props<{ id: number }>(),
    'Remove Reception Failure': props<{ error: string }>(),

    'Load Factures Fournisseur': emptyProps(),
    'Load Factures Fournisseur Success': props<{ facturesFournisseur: FactureFournisseur[] }>(),
    'Load Factures Fournisseur Failure': props<{ error: string }>(),

    'Add Facture Fournisseur': props<{ draft: FactureFournisseurDraft }>(),
    'Add Facture Fournisseur Success': props<{ factureFournisseur: FactureFournisseur }>(),
    'Add Facture Fournisseur Failure': props<{ error: string }>(),

    'Update Facture Fournisseur': props<{ id: number; draft: FactureFournisseurDraft }>(),
    'Update Facture Fournisseur Success': props<{ factureFournisseur: FactureFournisseur }>(),
    'Update Facture Fournisseur Failure': props<{ error: string }>(),

    'Remove Facture Fournisseur': props<{ id: number }>(),
    'Remove Facture Fournisseur Success': props<{ id: number }>(),
    'Remove Facture Fournisseur Failure': props<{ error: string }>(),

    'Load Avoirs Fournisseur': emptyProps(),
    'Load Avoirs Fournisseur Success': props<{ avoirsFournisseur: AvoirFournisseur[] }>(),
    'Load Avoirs Fournisseur Failure': props<{ error: string }>(),

    'Add Avoir Fournisseur': props<{ draft: AvoirFournisseurDraft }>(),
    'Add Avoir Fournisseur Success': props<{ avoirFournisseur: AvoirFournisseur }>(),
    'Add Avoir Fournisseur Failure': props<{ error: string }>(),

    'Update Avoir Fournisseur': props<{ id: number; draft: AvoirFournisseurDraft }>(),
    'Update Avoir Fournisseur Success': props<{ avoirFournisseur: AvoirFournisseur }>(),
    'Update Avoir Fournisseur Failure': props<{ error: string }>(),

    'Remove Avoir Fournisseur': props<{ id: number }>(),
    'Remove Avoir Fournisseur Success': props<{ id: number }>(),
    'Remove Avoir Fournisseur Failure': props<{ error: string }>(),
  },
});
