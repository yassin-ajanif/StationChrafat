import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '../../../../../core/i18n';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { CategorySidebarComponent } from '../../components/category-sidebar/category-sidebar.component';
import { CatalogueItemTableComponent } from '../../components/catalogue-item-table/catalogue-item-table.component';
import {
  CatalogueCategory,
  CatalogueItem,
  CatalogueItemDraft,
  CategoryDraft,
  CategoryKind,
} from '../../models';
import { ProduitsServicesActions } from '../../state/produits-services.actions';
import {
  selectError,
  selectFilteredItems,
  selectLoading,
  selectProductCategories,
  selectSearchQuery,
  selectSelectedCategoryId,
  selectSaving,
  selectServiceCategories,
} from '../../state/produits-services.selectors';
import { CatalogueItemFormDialogComponent } from './dialogs/catalogue-item-form-dialog/catalogue-item-form-dialog.component';
import { CategoryFormDialogComponent } from './dialogs/category-form-dialog/category-form-dialog.component';

@Component({
  selector: 'app-produits-services',
  standalone: true,
  imports: [ButtonComponent, CategorySidebarComponent, CatalogueItemTableComponent, CatalogueItemFormDialogComponent, CategoryFormDialogComponent, TranslatePipe],
  templateUrl: './produits-services.page.html',
  styleUrl: './produits-services.page.scss',
})
export class ProduitsServicesPage implements OnInit {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);

  readonly serviceCategories = this.store.selectSignal(selectServiceCategories);
  readonly productCategories = this.store.selectSignal(selectProductCategories);
  readonly filteredItems = this.store.selectSignal(selectFilteredItems);
  readonly searchQuery = this.store.selectSignal(selectSearchQuery);
  readonly selectedCategoryId = this.store.selectSignal(selectSelectedCategoryId);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly saving = this.store.selectSignal(selectSaving);
  readonly error = this.store.selectSignal(selectError);

  readonly allCategories = computed(() => [
    ...this.serviceCategories(),
    ...this.productCategories(),
  ]);

  readonly itemDialogOpen = signal(false);
  readonly editingItem = signal<CatalogueItem | null>(null);

  readonly categoryDialogOpen = signal(false);
  readonly editingCategory = signal<CatalogueCategory | null>(null);
  readonly categoryDialogKind = signal<CategoryKind>('service');

  ngOnInit(): void {
    this.store.dispatch(ProduitsServicesActions.loadCatalogue());
  }

  onCategorySelect(categoryId: number): void {
    const next = this.selectedCategoryId() === categoryId ? null : categoryId;
    this.store.dispatch(ProduitsServicesActions.setSelectedCategory({ categoryId: next }));
  }

  onSearchChange(query: string): void {
    this.store.dispatch(ProduitsServicesActions.setSearchQuery({ query }));
  }

  openNewItem(): void {
    this.editingItem.set(null);
    this.itemDialogOpen.set(true);
  }

  openEditItem(item: CatalogueItem): void {
    this.editingItem.set(item);
    this.itemDialogOpen.set(true);
  }

  closeItemDialog(): void {
    this.itemDialogOpen.set(false);
    this.editingItem.set(null);
  }

  onItemSaved(draft: CatalogueItemDraft): void {
    const editing = this.editingItem();
    if (editing) {
      this.store.dispatch(ProduitsServicesActions.updateItem({ id: editing.id, draft }));
    } else {
      this.store.dispatch(ProduitsServicesActions.addItem({ draft }));
    }
    this.closeItemDialog();
  }

  onRemoveItem(id: number): void {
    if (confirm(this.translate.instant('common.confirm.deleteArticle'))) {
      this.store.dispatch(ProduitsServicesActions.removeItem({ id }));
    }
  }

  openNewCategory(kind: CategoryKind): void {
    this.editingCategory.set(null);
    this.categoryDialogKind.set(kind);
    this.categoryDialogOpen.set(true);
  }

  openEditCategory(category: CatalogueCategory): void {
    this.editingCategory.set(category);
    this.categoryDialogKind.set(category.kind);
    this.categoryDialogOpen.set(true);
  }

  closeCategoryDialog(): void {
    this.categoryDialogOpen.set(false);
    this.editingCategory.set(null);
  }

  onCategorySaved(draft: CategoryDraft): void {
    const editing = this.editingCategory();
    if (editing) {
      this.store.dispatch(ProduitsServicesActions.updateCategory({ id: editing.id, draft }));
    } else {
      this.store.dispatch(ProduitsServicesActions.addCategory({ draft }));
    }
    this.closeCategoryDialog();
  }
}
