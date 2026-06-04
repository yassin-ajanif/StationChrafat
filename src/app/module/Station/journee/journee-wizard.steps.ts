export interface JourneeWizardStep {
  id: string;
  path: string;
  label: string;
  order: number;
}

/** Canonical wizard order. */
export const JOURNEE_WIZARD_STEPS: readonly JourneeWizardStep[] = [
  { id: 'configuration-step1', path: 'configuration-step1', label: 'Configuration', order: 1 },
  { id: 'index-pistoles-step2', path: 'index-pistoles-step2', label: 'Carburant vendue', order: 2 },
  { id: 'bons-step3', path: 'bons-step3', label: 'Bons station', order: 3 },
  { id: 'encaissements-step4', path: 'encaissements-step4', label: 'Encaissements', order: 4 },
  { id: 'depenses-step6', path: 'depenses-step6', label: 'Dépenses', order: 5 },
  { id: 'validation-step6', path: 'validation-step6', label: 'Validation', order: 6 },
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
