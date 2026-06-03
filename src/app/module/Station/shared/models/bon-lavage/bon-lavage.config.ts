export interface BonLavageConfig {
  title: string;
  description: string;
  backLink: readonly string[];
  nextLink: readonly string[];
  guardRedirectIfNoDraft?: readonly string[];
  chefSelectLabel: string;
  headerIcon: string;
}

export const JOURNEE_BON_LAVAGE_CONFIG: BonLavageConfig = {
  title: 'Bon de lavage',
  description: 'Déclarez les bons lavage du shift. Chaque bon peut contenir plusieurs prestations.',
  backLink: ['/journees', 'nouvelle', 'index-pistoles-step2'],
  nextLink: ['/journees', 'nouvelle', 'bon-vidange-step4'],
  guardRedirectIfNoDraft: ['/journees', 'nouvelle', 'configuration-step1'],
  chefSelectLabel: 'Responsable vidange / lavage',
  headerIcon: '🚿',
};
