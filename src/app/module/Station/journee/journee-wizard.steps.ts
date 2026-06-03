export interface JourneeWizardStep {
  id: string;
  path: string;
  label: string;
  order: number;
}

/** Canonical wizard order (image sequence). */
export const JOURNEE_WIZARD_STEPS: readonly JourneeWizardStep[] = [
  { id: 'configuration-step1', path: 'configuration-step1', label: 'Configuration', order: 1 },
  { id: 'index-pistoles-step2', path: 'index-pistoles-step2', label: 'Bon livraison carburant', order: 2 },
  { id: 'bon-lavage-step3', path: 'bon-lavage-step3', label: 'Bon lavage', order: 3 },
  { id: 'bon-vidange-step4', path: 'bon-vidange-step4', label: 'Bon vidange', order: 4 },
  { id: 'encaissements-step5', path: 'encaissements-step5', label: 'Encaissements', order: 5 },
  { id: 'depenses-step6', path: 'depenses-step6', label: 'Dépenses', order: 6 },
  { id: 'validation-step7', path: 'validation-step7', label: 'Validation', order: 7 },
] as const;

export const JOURNEE_WIZARD_STEP_COUNT = JOURNEE_WIZARD_STEPS.length;

export function journeeWizardStepByPath(path: string): JourneeWizardStep | undefined {
  return JOURNEE_WIZARD_STEPS.find((s) => s.path === path);
}

export function nextWizardStep(currentPath: string): JourneeWizardStep | undefined {
  const idx = JOURNEE_WIZARD_STEPS.findIndex((s) => s.path === currentPath);
  return idx >= 0 && idx < JOURNEE_WIZARD_STEPS.length - 1
    ? JOURNEE_WIZARD_STEPS[idx + 1]
    : undefined;
}

export function prevWizardStep(currentPath: string): JourneeWizardStep | undefined {
  const idx = JOURNEE_WIZARD_STEPS.findIndex((s) => s.path === currentPath);
  return idx > 0 ? JOURNEE_WIZARD_STEPS[idx - 1] : undefined;
}
