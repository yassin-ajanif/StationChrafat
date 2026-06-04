import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { ButtonComponent } from '../../../../../../../shared/components/button/button.component';
import { CatalogueCategory, CategoryDraft, CategoryKind } from '../../../../models';

@Component({
  selector: 'app-category-form-dialog',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './category-form-dialog.component.html',
  styleUrl: './category-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormDialogComponent {
  readonly open = input(false);
  readonly editCategory = input<CatalogueCategory | null>(null);
  readonly presetKind = input<CategoryKind>('service');
  readonly saving = input(false);

  readonly saved = output<CategoryDraft>();
  readonly closed = output<void>();

  readonly isEditMode = computed(() => this.editCategory() != null);

  readonly kind = signal<CategoryKind>('service');
  readonly label = signal('');

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }
      const cat = this.editCategory();
      if (cat) {
        this.kind.set(cat.kind);
        this.label.set(cat.label);
        return;
      }
      this.kind.set(this.presetKind());
      this.label.set('');
    });
  }

  isValid(): boolean {
    return this.label().trim().length > 0;
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
      kind: this.kind(),
      label: this.label().trim(),
    });
  }
}
