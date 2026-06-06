export interface JourneeWizardStep {
  id: string;
  path: string;
  labelKey: string;
  order: number;
}

/** Canonical wizard order. */
export const JOURNEE_WIZARD_STEPS: readonly JourneeWizardStep[] = [
  { id: 'configuration-step1', path: 'configuration-step1', labelKey: 'journee.wizard.steps.configuration', order: 1 },
  { id: 'index-pistoles-step2', path: 'index-pistoles-step2', labelKey: 'journee.wizard.steps.carburant', order: 2 },
  { id: 'bons-step3', path: 'bons-step3', labelKey: 'journee.wizard.steps.bonsStation', order: 3 },
  { id: 'encaissements-step4', path: 'encaissements-step4', labelKey: 'journee.wizard.steps.encaissements', order: 4 },
  { id: 'depenses-step5', path: 'depenses-step5', labelKey: 'journee.wizard.steps.depenses', order: 5 },
  { id: 'controle-stock-step6', path: 'controle-stock-step6', labelKey: 'journee.wizard.steps.stockControl', order: 6 },
  { id: 'validation-step7', path: 'validation-step7', labelKey: 'journee.wizard.steps.validation', order: 7 },
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
