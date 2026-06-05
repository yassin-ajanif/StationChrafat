import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AvoirFournisseur, AvoirFournisseurDraft, CommandeAchat, CommandeAchatDraft, DevisAchat, DevisAchatDraft, FactureFournisseur, FactureFournisseurDraft, Reception, ReceptionDraft, RetourFournisseur, RetourFournisseurDraft } from './store';

export const AchatActions = createActionGroup({
  source: 'Achat',
  events: {
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

    'Load Retours Fournisseur': emptyProps(),
    'Load Retours Fournisseur Success': props<{ retoursFournisseur: RetourFournisseur[] }>(),
    'Load Retours Fournisseur Failure': props<{ error: string }>(),

    'Add Retour Fournisseur': props<{ draft: RetourFournisseurDraft }>(),
    'Add Retour Fournisseur Success': props<{ retourFournisseur: RetourFournisseur }>(),
    'Add Retour Fournisseur Failure': props<{ error: string }>(),

    'Update Retour Fournisseur': props<{ id: number; draft: RetourFournisseurDraft }>(),
    'Update Retour Fournisseur Success': props<{ retourFournisseur: RetourFournisseur }>(),
    'Update Retour Fournisseur Failure': props<{ error: string }>(),

    'Remove Retour Fournisseur': props<{ id: number }>(),
    'Remove Retour Fournisseur Success': props<{ id: number }>(),
    'Remove Retour Fournisseur Failure': props<{ error: string }>(),
  },
});
