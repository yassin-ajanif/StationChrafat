import { Component, input, output } from '@angular/core';
import { LocaleCurrencyPipe, TranslatePipe } from '../../../../../core/i18n'
import { CatalogueCategory, CatalogueItem } from '../../state/produits-services.store';

@Component({
  selector: 'app-catalogue-item-table',
  standalone: true,
  imports: [LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './catalogue-item-table.component.html',
  styleUrl: './catalogue-item-table.component.scss',
})
export class CatalogueItemTableComponent {
  readonly items = input.required<CatalogueItem[]>();
  readonly categories = input.required<CatalogueCategory[]>();
  readonly searchQuery = input<string>('');

  readonly edit = output<CatalogueItem>();
  readonly remove = output<number>();
  readonly searchChange = output<string>();

  categoryLabel(categoryId: number): string {
    return this.categories().find((c) => c.id === categoryId)?.label ?? '\u2014';
  }

  typeLabel(type: string): string {
    return type === 'service' ? 'SERVICE' : 'PRODUIT';
  }

  typeBadgeClass(type: string): string {
    return type === 'service'
      ? 'catalogue-item-table__type-badge--service'
      : 'catalogue-item-table__type-badge--produit';
  }

  onSearchInput(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
