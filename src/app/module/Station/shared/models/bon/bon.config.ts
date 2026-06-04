export interface BonConfig {
  title: string;
  description: string;
  backLink: readonly string[];
  nextLink: readonly string[];
  guardRedirectIfNoDraft?: readonly string[];
  chefSelectLabel: string;
  headerIcon: string;
}

export const JOURNEE_BON_CONFIG: BonConfig = {
  title: 'Bons station',
  description:
    'Consultez et gérez les bons de la station. Le bon carburant est généré automatiquement depuis les index pistolets.',
  backLink: ['/journees', 'nouvelle', 'index-pistoles-step2'],
  nextLink: ['/journees', 'nouvelle', 'encaissements-step5'],
  guardRedirectIfNoDraft: ['/journees', 'nouvelle', 'configuration-step1'],
  chefSelectLabel: 'Responsable vidange / lavage',
  headerIcon: '📋',
};
