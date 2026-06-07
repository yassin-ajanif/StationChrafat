import { Component, computed, inject } from '@angular/core';
import { AppLocaleId, LocaleService, TranslatePipe } from '../../../core/i18n';

@Component({
  selector: 'app-locale-switcher',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './locale-switcher.component.html',
  styleUrl: './locale-switcher.component.scss',
})
export class LocaleSwitcherComponent {
  private readonly locale = inject(LocaleService);

  readonly activeLocale = this.locale.activeLocale;

  readonly displayLabel = computed(() =>
    this.activeLocale() === 'fr-MA' ? 'ع' : 'FR',
  );

  readonly isArabicLabel = computed(() => this.displayLabel() === 'ع');

  isActive(locale: AppLocaleId): boolean {
    return this.activeLocale() === locale;
  }

  async toggleLocale(): Promise<void> {
    const next: AppLocaleId = this.activeLocale() === 'fr-MA' ? 'ar-MA' : 'fr-MA';
    await this.locale.setLocale(next);
  }
}
