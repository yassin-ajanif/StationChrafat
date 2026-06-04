export type TranslationDictionary = Record<string, unknown>;

export function deepMergeTranslations(
  target: TranslationDictionary,
  source: TranslationDictionary,
): TranslationDictionary {
  for (const key of Object.keys(source)) {
    const value = source[key];
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const existing = target[key];
      target[key] = deepMergeTranslations(
        existing !== null && typeof existing === 'object' && !Array.isArray(existing)
          ? { ...(existing as TranslationDictionary) }
          : {},
        value as TranslationDictionary,
      );
    } else {
      target[key] = value;
    }
  }
  return target;
}

export function resolveTranslationKey(
  dictionary: TranslationDictionary,
  key: string,
): string | undefined {
  const parts = key.split('.');
  let current: unknown = dictionary;
  for (const part of parts) {
    if (current === null || typeof current !== 'object' || Array.isArray(current)) {
      return undefined;
    }
    current = (current as TranslationDictionary)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

export function interpolateParams(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) {
    return template;
  }
  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    const value = params[name];
    return value === undefined ? `{{${name}}}` : String(value);
  });
}
