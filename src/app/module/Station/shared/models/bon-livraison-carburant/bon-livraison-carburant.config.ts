/** Navigation and copy for embedding the fuel delivery (bon de livraison) page. */
export interface BonLivraisonCarburantConfig {
  title: string;
  description: string;
  backLink: readonly string[];
  nextLink: readonly string[];
  /** When false, hides the wizard “Suivant” footer (standalone carburant module). */
  showWizardNext?: boolean;
  guardRedirectIfNoDraft?: readonly string[];
}

export const JOURNEE_BON_LIVRAISON_CONFIG: BonLivraisonCarburantConfig = {
  title: 'Bon de livraison carburant',
  description: 'Saisissez les index pistolets et les encaissements pour la livraison / vente carburant.',
  backLink: ['/journees', 'nouvelle', 'configuration-step1'],
  nextLink: ['/journees', 'nouvelle', 'bon-lavage-step3'],
  showWizardNext: true,
  guardRedirectIfNoDraft: ['/journees', 'nouvelle', 'configuration-step1'],
};

export const CARBURANT_BON_LIVRAISON_CONFIG: BonLivraisonCarburantConfig = {
  title: 'Bon de livraison carburant',
  description: 'Saisissez les index pistolets et les encaissements pour la vente carburant.',
  backLink: ['/station', 'carburant', 'stock'],
  nextLink: ['/station', 'carburant', 'stock'],
  showWizardNext: false,
};
