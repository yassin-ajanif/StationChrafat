import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '../../../../../core/i18n'
import { CatalogueCategory } from '../../state/produits-services.store';

@Component({
  selector: 'app-category-sidebar',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './category-sidebar.component.html',
  styleUrl: './category-sidebar.component.scss',
})
export class CategorySidebarComponent {
  readonly serviceCategories = input.required<CatalogueCategory[]>();
  readonly productCategories = input.required<CatalogueCategory[]>();
  readonly selectedCategoryId = input<number | null>(null);

  readonly categorySelect = output<number>();
  readonly addCategoryRequested = output<'service' | 'product'>();
  readonly editCategoryRequested = output<CatalogueCategory>();

  categoryIcon(label: string): string {
    const key = label.toLowerCase();
    if (key.includes('nettoyage') || key.includes('lavage')) {
      return '🧼';
    }
    if (key.includes('vidange')) {
      return '🛢';
    }
    if (key.includes('maintenance')) {
      return '🔧';
    }
    if (key.includes('carburant')) {
      return '⛽';
    }
    if (key.includes('boutique')) {
      return '🏪';
    }
    if (key.includes('lubrif')) {
      return '🛢';
    }
    return '•';
  }
}
