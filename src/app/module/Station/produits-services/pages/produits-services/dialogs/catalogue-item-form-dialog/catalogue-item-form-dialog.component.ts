import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { TranslatePipe } from '../../../../../../../core/i18n';
import { ButtonComponent } from '../../../../../../../shared/components/button/button.component';
import {
  CatalogueCategory,
  CatalogueItem,
  CatalogueItemDraft,
  CatalogueItemType,
} from '../../../../models';

@Component({
  selector: 'app-catalogue-item-form-dialog',
  standalone: true,
  imports: [ButtonComponent, TranslatePipe],
  templateUrl: './catalogue-item-form-dialog.component.html',
  styleUrl: './catalogue-item-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogueItemFormDialogComponent {
  readonly open = input(false);
  readonly editItem = input<CatalogueItem | null>(null);
  readonly serviceCategories = input.required<CatalogueCategory[]>();
  readonly productCategories = input.required<CatalogueCategory[]>();
  readonly presetCategoryId = input<number | null>(null);
  readonly saving = input(false);

  readonly saved = output<CatalogueItemDraft>();
  readonly closed = output<void>();

  readonly isEditMode = computed(() => this.editItem() != null);

  readonly name = signal('');
  readonly type = signal<CatalogueItemType>('produit');
  readonly categoryId = signal(0);
  readonly unitPrice = signal(0);

  readonly categoriesForType = computed(() =>
    this.type() === 'service' ? this.serviceCategories() : this.productCategories(),
  );

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      const item = this.editItem();
      if (item) {
        this.name.set(item.name);
        this.type.set(item.type);
        this.categoryId.set(item.categoryId);
        this.unitPrice.set(item.unitPrice);
        return;
      }
      const preset = this.presetCategoryId();
      const presetCat = preset
        ? [...this.serviceCategories(), ...this.productCategories()].find((c) => c.id === preset)
        : undefined;
      this.name.set('');
      this.type.set(presetCat?.kind === 'service' ? 'service' : 'produit');
      this.categoryId.set(preset ?? 0);
      this.unitPrice.set(0);
    });
  }

  isValid(): boolean {
    return (
      this.name().trim().length > 0 &&
      this.categoryId() > 0 &&
      this.unitPrice() > 0
    );
  }

  onTypeChange(event: Event): void {
    const next = (event.target as HTMLSelectElement).value as CatalogueItemType;
    this.type.set(next);
    this.categoryId.set(0);
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).dataset['dialogBackdrop'] === 'true') {
      this.cancel();
    }
  }

  cancel(): void {
    this.closed.emit();
  }

  save(): void {
    if (!this.isValid()) {
      return;
    }
    this.saved.emit({
      name: this.name().trim(),
      type: this.type(),
      categoryId: this.categoryId(),
      unitPrice: this.unitPrice(),
    });
  }
}
