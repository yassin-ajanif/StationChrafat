export interface BonVidangeConfig {
  title: string;
  description: string;
  backLink: readonly string[];
  nextLink: readonly string[];
  guardRedirectIfNoDraft?: readonly string[];
  chefSelectLabel: string;
  headerIcon: string;
}

export const JOURNEE_BON_VIDANGE_CONFIG: BonVidangeConfig = {
  title: 'Bon de vidange',
  description: 'Déclarez les bons vidange du shift. Chaque bon peut contenir plusieurs interventions.',
  backLink: ['/journees', 'nouvelle', 'bon-lavage-step3'],
  nextLink: ['/journees', 'nouvelle', 'encaissements-step5'],
  guardRedirectIfNoDraft: ['/journees', 'nouvelle', 'configuration-step1'],
  chefSelectLabel: 'Responsable vidange / lavage',
  headerIcon: '🛢️',
};
