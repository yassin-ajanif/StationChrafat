import { CategoryKind } from './category.model';

export interface CategoryDraft {
  kind: CategoryKind;
  label: string;
}

export const EMPTY_CATEGORY_DRAFT: CategoryDraft = {
  kind: 'service',
  label: '',
};
