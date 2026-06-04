import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '../../../../../core/i18n';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-stock-gestion-toolbar',
  standalone: true,
  imports: [ButtonComponent, TranslatePipe],
  templateUrl: './stock-gestion-toolbar.component.html',
  styleUrl: './stock-gestion-toolbar.component.scss',
})
export class StockGestionToolbarComponent {
  readonly searchQuery = input<string>('');
  readonly searchChange = output<string>();

  onSearchInput(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
